import { DepartmentStats } from '@/@types/department';
import { computeAgeRanges } from '../computeAgeRanges';

describe('computeAgeRanges', () => {
  const baseStats: DepartmentStats = {
    male: 0,
    female: 0,
    ageRange: '',
    hair: {},
    addressUser: {},
  };

  it('computes correct age range for a single department', () => {
    const statsMap = new Map<string, DepartmentStats>([
      ['Engineering', { ...baseStats }],
    ]);

    const agesMap = new Map<string, number[]>([
      ['Engineering', [25, 30, 40]],
    ]);

    const result = computeAgeRanges(statsMap, agesMap);
    const updatedStats = result.get('Engineering');

    expect(updatedStats).toBeDefined();
    expect(updatedStats!.ageRange).toBe('25-40');
  });

  it('handles multiple departments with varying ages', () => {
    const statsMap = new Map([
      ['HR', { ...baseStats }],
      ['Design', { ...baseStats }],
    ]);

    const agesMap = new Map([
      ['HR', [22, 29, 31]],
      ['Design', [45, 50]],
    ]);

    const result = computeAgeRanges(statsMap, agesMap);

    expect(result.get('HR')!.ageRange).toBe('22-31');
    expect(result.get('Design')!.ageRange).toBe('45-50');
  });

  it('returns empty ageRange if department has no ages', () => {
    const statsMap = new Map([['EmptyDept', { ...baseStats }]]);

    const agesMap = new Map(); // no entry for 'EmptyDept'

    const result = computeAgeRanges(statsMap, agesMap);
    expect(result.get('EmptyDept')!.ageRange).toBe('');
  });

  it('does not mutate original statsMap', () => {
    const originalStats = { ...baseStats };
    const statsMap = new Map([['Ops', originalStats]]);

    const agesMap = new Map([['Ops', [30, 30, 30]]]);

    const result = computeAgeRanges(statsMap, agesMap);

    expect(result).not.toBe(statsMap); // new Map instance
    expect(result.get('Ops')).not.toBe(originalStats); // new object
    expect(statsMap.get('Ops')!.ageRange).toBe(''); // original remains unchanged
  });

  it('computes correct min age when minimum is not the first element', () => {
    const statsMap = new Map([['Finance', { ...baseStats }]]);
    const agesMap = new Map([['Finance', [60, 40, 25]]]);

    const result = computeAgeRanges(statsMap, agesMap);
    const stats = result.get('Finance');

    expect(stats).toBeDefined();
    expect(stats!.ageRange).toBe('25-60');
  });
});
