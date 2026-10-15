-- Brewscout initial schema: cafes, hours, tags, photos, helper functions, RLS, seed tags.
-- Run once on a fresh Supabase project (SQL editor or `supabase db push`).

create extension if not exists postgis with schema extensions;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.cafe_status as enum ('unverified', 'verified', 'closed');
create type public.tag_category as enum ('work', 'hours', 'vibe', 'practical', 'coffee', 'location');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.cafes (
  id          uuid primary key default gen_random_uuid(),
  osm_id      text unique,                       -- e.g. 'node/123456', 'way/7890'; null for hand-added cafes
  name        text not null,
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  location    extensions.geography(Point, 4326) not null,
  address     text,
  city        text,
  price_min   integer check (price_min >= 0),    -- typical latte price, PHP
  price_max   integer check (price_max >= 0),
  is_chain    boolean not null default false,
  is_24h      boolean not null default false,
  status      public.cafe_status not null default 'unverified',
  description text,
  fb_url      text,
  ig_url      text,
  website     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (price_min is null or price_max is null or price_min <= price_max)
);

create index cafes_location_idx on public.cafes using gist (location);
create index cafes_status_idx on public.cafes (status);
create index cafes_city_idx on public.cafes (city);

-- One row per opening window. closes < opens means the window runs past midnight
-- (e.g. Fri 16:00 -> 02:00 is stored on day 5). 24/7 cafes use cafes.is_24h instead.
create table public.cafe_hours (
  cafe_id     uuid not null references public.cafes (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),  -- 0 = Sunday ... 6 = Saturday
  opens       time not null,
  closes      time not null,
  primary key (cafe_id, day_of_week, opens),
  check (opens <> closes)
);

create table public.tags (
  id       bigint generated always as identity primary key,
  slug     text not null unique,
  name     text not null,
  category public.tag_category not null
);

create table public.cafe_tags (
  cafe_id uuid not null references public.cafes (id) on delete cascade,
  tag_id  bigint not null references public.tags (id) on delete cascade,
  primary key (cafe_id, tag_id)
);

create index cafe_tags_tag_id_idx on public.cafe_tags (tag_id);

create table public.photos (
  id           uuid primary key default gen_random_uuid(),
  cafe_id      uuid not null references public.cafes (id) on delete cascade,
  storage_path text not null,                    -- path inside the cafe-photos bucket
  source_url   text,                             -- where the photo came from (cafe's FB/IG post)
  credit       text not null,                    -- e.g. 'Photo: Cafe Name (Facebook)'
  is_cover     boolean not null default false,
  created_at   timestamptz not null default now()
);

create index photos_cafe_id_idx on public.photos (cafe_id);
create unique index photos_one_cover_per_cafe on public.photos (cafe_id) where is_cover;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cafes_set_updated_at
before update on public.cafes
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------

-- True if the cafe is open at p_at, evaluated in Asia/Manila time.
-- Handles windows past midnight (closes < opens) and 24/7 cafes.
create function public.is_open_now(p_cafe_id uuid, p_at timestamptz default now())
returns boolean
language sql
stable
set search_path = ''
as $$
  with local_time as (
    select extract(dow from p_at at time zone 'Asia/Manila')::int as dow,
           (p_at at time zone 'Asia/Manila')::time               as t
  )
  select coalesce((select c.is_24h from public.cafes c where c.id = p_cafe_id), false)
      or exists (
        select 1
        from public.cafe_hours h, local_time l
        where h.cafe_id = p_cafe_id
          and (
            -- window that started today
            (h.day_of_week = l.dow and (
                (h.opens < h.closes and l.t >= h.opens and l.t < h.closes)
             or (h.closes < h.opens and l.t >= h.opens)
            ))
            -- window that started yesterday and runs past midnight
            or (h.day_of_week = (l.dow + 6) % 7 and h.closes < h.opens and l.t < h.closes)
          )
      );
$$;

-- Verified cafes within radius_m of a point, nearest first.
create function public.cafes_near(p_lat double precision, p_lng double precision, radius_m integer default 5000)
returns table (
  id         uuid,
  name       text,
  slug       text,
  city       text,
  lat        double precision,
  lng        double precision,
  price_min  integer,
  price_max  integer,
  distance_m double precision,
  open_now   boolean
)
language sql
stable
set search_path = ''
as $$
  with origin as (
    select extensions.st_setsrid(extensions.st_makepoint(p_lng, p_lat), 4326)::extensions.geography as pt
  )
  select c.id,
         c.name,
         c.slug,
         c.city,
         extensions.st_y(c.location::extensions.geometry) as lat,
         extensions.st_x(c.location::extensions.geometry) as lng,
         c.price_min,
         c.price_max,
         extensions.st_distance(c.location, o.pt)         as distance_m,
         public.is_open_now(c.id)                         as open_now
  from public.cafes c, origin o
  where c.status = 'verified'
    and extensions.st_dwithin(c.location, o.pt, radius_m)
  order by distance_m;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- Public (anon) can only read verified cafes and their related rows.
-- All writes go through the dashboard or the service role key (which bypasses RLS).
-- ---------------------------------------------------------------------------

alter table public.cafes      enable row level security;
alter table public.cafe_hours enable row level security;
alter table public.tags       enable row level security;
alter table public.cafe_tags  enable row level security;
alter table public.photos     enable row level security;

create policy "Public can read verified cafes"
  on public.cafes for select
  to anon, authenticated
  using (status = 'verified');

create policy "Public can read hours of verified cafes"
  on public.cafe_hours for select
  to anon, authenticated
  using (exists (select 1 from public.cafes c where c.id = cafe_id and c.status = 'verified'));

create policy "Public can read tags"
  on public.tags for select
  to anon, authenticated
  using (true);

create policy "Public can read tags of verified cafes"
  on public.cafe_tags for select
  to anon, authenticated
  using (exists (select 1 from public.cafes c where c.id = cafe_id and c.status = 'verified'));

create policy "Public can read photos of verified cafes"
  on public.photos for select
  to anon, authenticated
  using (exists (select 1 from public.cafes c where c.id = cafe_id and c.status = 'verified'));

-- ---------------------------------------------------------------------------
-- Storage: public bucket for cafe photos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('cafe-photos', 'cafe-photos', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Seed tags
-- ---------------------------------------------------------------------------

insert into public.tags (slug, name, category) values
  ('fast-wifi',       'Fast wifi',       'work'),
  ('outlets',         'Outlets',         'work'),
  ('laptop-friendly', 'Laptop-friendly', 'work'),
  ('quiet',           'Quiet',           'work'),
  ('open-late',       'Open late',       'hours'),
  ('with-view',       'With a view',     'vibe'),
  ('aesthetic',       'Aesthetic',       'vibe'),
  ('cozy',            'Cozy',            'vibe'),
  ('al-fresco',       'Al fresco',       'vibe'),
  ('parking',         'Parking',         'practical'),
  ('pet-friendly',    'Pet-friendly',    'practical'),
  ('aircon',          'Aircon',          'practical'),
  ('specialty',       'Specialty coffee','coffee'),
  ('local-beans',     'Local beans',     'coffee'),
  ('near-campus',     'Near campus',     'location');
