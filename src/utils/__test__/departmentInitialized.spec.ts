import { DepartmentStats } from '@/@types/department';
import { departmentInitialized } from '../departmentInitialized';

describe('departmentInitialized', () => {
  const baseStats: DepartmentStats = {
    male: 0,
    female: 0,
    ageRange: '',
    hair: {},
    addressUser: {},
  };

  it('adds a new department if not present', () => {
    const statsMap = new Map<string, DepartmentStats>();
    const agesMap = new Map<string, number[]>();

    const { statsMap: newStatsMap, agesMap: newAgesMap } =
      departmentInitialized(statsMap, agesMap, 'Engineering');

    expect(newStatsMap.has('Engineering')).toBe(true);
    expect(newAgesMap.has('Engineering')).toBe(true);

    expect(newStatsMap.get('Engineering')).toEqual(baseStats);
    expect(newAgesMap.get('Engineering')).toEqual([]);
  });

  it('does not modify the original maps when department is already present', () => {
    const statsMap = new Map([['HR', { ...baseStats }]]);
    const agesMap = new Map([['HR', [25]]]);

    const result = departmentInitialized(statsMap, agesMap, 'HR');

    expect(result.statsMap).toBe(statsMap);
    expect(result.agesMap).toBe(agesMap);
  });

  it('returns new Map instances only if modification is needed', () => {
    const statsMap = new Map();
    const agesMap = new Map();

    const result = departmentInitialized(
      statsMap,
      agesMap,
      'NewDept'
    );

    expect(result.statsMap).not.toBe(statsMap);
    expect(result.agesMap).not.toBe(agesMap);
  });
});
