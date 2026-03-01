/**
 * Adapts narrative content to a student's reading level.
 *
 * Handles TWO formats:
 *  1. Tiered object — { rich: [...], standard: [...], simple: [...], entry: [...] }
 *     Returns the correct tier directly.
 *  2. Legacy flat array — string[]
 *     Falls back to length-based truncation.
 *
 * Also works on single tiered strings (non-array):
 *     { rich: "...", standard: "...", simple: "...", entry: "..." }
 *     Returns the matching string wrapped in an array.
 *
 * @param {string[]|object} lines - Full narrative content
 * @param {{ level: string }} readingProfile - from getReadingProfile()
 * @returns {string[]}
 */
export function adaptNarrative(lines, readingProfile) {
  if (!lines) return [];
  const level = readingProfile?.level || 'rich';

  // ── Tiered object (new format) ─────────────────────────
  if (lines && typeof lines === 'object' && !Array.isArray(lines)) {
    // Pick the best available tier, falling back gracefully
    const tiers = ['entry', 'simple', 'standard', 'rich'];
    const startIdx = tiers.indexOf(level);
    let picked = null;

    // Walk up from requested level to richest until we find content
    for (let i = startIdx; i < tiers.length; i++) {
      if (lines[tiers[i]]) { picked = lines[tiers[i]]; break; }
    }
    // If nothing found walking up, walk down
    if (!picked) {
      for (let i = startIdx - 1; i >= 0; i--) {
        if (lines[tiers[i]]) { picked = lines[tiers[i]]; break; }
      }
    }

    if (!picked) return [];
    return Array.isArray(picked) ? picked : [picked];
  }

  // ── Legacy flat array ──────────────────────────────────
  const arr = Array.isArray(lines) ? lines : [lines];
  if (arr.length === 0) return arr;
  if (level === 'rich') return arr;

  switch (level) {
    case 'entry':
      return [arr[0] || ''];
    case 'simple':
      return arr.slice(0, 2);
    case 'standard':
      return arr.slice(0, Math.min(arr.length, 4));
    default:
      return arr;
  }
}

/**
 * Resolves a single tiered string/value to the correct reading level.
 * Useful for one-off messages like foundItem, rest, etc.
 *
 * @param {string|object} value - Either a plain string or { rich, standard, simple, entry }
 * @param {{ level: string }} readingProfile
 * @returns {string}
 */
export function adaptSingleLine(value, readingProfile) {
  if (!value) return '';
  if (typeof value === 'string') return value;

  const level = readingProfile?.level || 'rich';
  const tiers = ['entry', 'simple', 'standard', 'rich'];
  const startIdx = tiers.indexOf(level);

  for (let i = startIdx; i < tiers.length; i++) {
    if (value[tiers[i]]) return value[tiers[i]];
  }
  for (let i = startIdx - 1; i >= 0; i--) {
    if (value[tiers[i]]) return value[tiers[i]];
  }
  return '';
}
