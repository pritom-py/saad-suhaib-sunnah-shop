/**
 * ড়, ঢ় and য় can each be typed as one code point or as base letter + nukta. They look
 * identical but do not match in a database LIKE query, so search tries both spellings.
 * (Written as escapes so no editor can silently re-normalise them.)
 */
const NUKTA_PAIRS: [single: string, combined: string][] = [
  ["ড়", "ড়"],
  ["ঢ়", "ঢ়"],
  ["য়", "য়"],
];

export function bengaliVariants(text: string): string[] {
  let combined = text;
  let single = text;
  for (const [one, two] of NUKTA_PAIRS) {
    combined = combined.split(one).join(two);
    single = single.split(two).join(one);
  }
  return [...new Set([text, combined, single])];
}
