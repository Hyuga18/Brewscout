import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-display text-2xl text-espresso">Café not found</h1>
      <p className="mt-2 text-muted">It may have closed or moved. Try the map instead.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-ink px-4 py-2 text-sm text-surface">
        Browse cafés
      </Link>
    </div>
  );
}
