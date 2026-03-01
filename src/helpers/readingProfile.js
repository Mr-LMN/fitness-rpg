/**
 * Returns a reading profile object based on a student's reading age.
 * Used to adapt narrative complexity throughout the game.
 *
 * @param {string} readingAge - one of the dropdown values from CharacterCreation
 * @returns {{ level: string, maxSentences: number, useIcons: boolean, simplifyWords: boolean }}
 */
export function getReadingProfile(readingAge) {
  switch (readingAge) {
    case 'under7':
    case '7-8':
      return { level: 'entry', maxSentences: 1, useIcons: true, simplifyWords: true };
    case '9-10':
    case '11-12':
      return { level: 'simple', maxSentences: 2, useIcons: true, simplifyWords: false };
    case '13-14':
      return { level: 'standard', maxSentences: 3, useIcons: false, simplifyWords: false };
    case '15+':
    case 'not-sure':
    default:
      return { level: 'rich', maxSentences: Infinity, useIcons: false, simplifyWords: false };
  }
}
