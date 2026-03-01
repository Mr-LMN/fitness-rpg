/**
 * Adapts an array of narrative lines to match a student's reading level.
 * Entry level gets a single line with an emoji prefix.
 * Simple gets 2 lines, standard gets 3, rich gets all.
 *
 * @param {string[]} lines - full array of narrative lines
 * @param {{ level: string }} readingProfile - from getReadingProfile()
 * @returns {string[]}
 */
export function adaptNarrative(lines, readingProfile) {
  if (!lines || lines.length === 0) return lines;
  if (!readingProfile || readingProfile.level === 'rich') return lines;

  const arr = Array.isArray(lines) ? lines : [lines];

  switch (readingProfile.level) {
    case 'entry':
      return [`⚡ ${arr[0] || ''}`];
    case 'simple':
      return arr.slice(0, 2);
    case 'standard':
      return arr.slice(0, 3);
    default:
      return arr;
  }
}
