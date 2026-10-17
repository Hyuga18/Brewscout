/** OSM often stores just a handle ("@cafe", "cafe", "1000123") instead of a full link. */
export function socialUrl(value: string | undefined, base: string): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(www\.)?(facebook|fb|instagram)\.com\//i.test(v)) return `https://${v}`;
  return `${base}${v.replace(/^@/, "")}`;
}
