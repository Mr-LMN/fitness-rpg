import { describe, it, expect } from 'vitest';
import { parseWeightInput } from '../src/utils.js';

describe('parseWeightInput', () => {
  it('returns 0 for bodyweight or 0', () => {
    expect(parseWeightInput('bw')).toBe(0);
    expect(parseWeightInput('0')).toBe(0);
  });

  it('parses numeric values', () => {
    expect(parseWeightInput('15')).toBe(15);
    expect(parseWeightInput('20kg')).toBe(20);
  });

  it('parses bodyweight plus additional weight', () => {
    expect(parseWeightInput('bw + 5')).toBe(5);
  });
});
