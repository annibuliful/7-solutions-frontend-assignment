import { DepartmentStats } from '@/@types/department';

export function departmentInitialized(
  statsMap: Map<string, DepartmentStats>,
  agesMap: Map<string, number[]>,
  department: string
): {
  statsMap: Map<string, DepartmentStats>;
  agesMap: Map<string, number[]>;
} {
  if (!statsMap.has(department)) {
    const newStatsMap = new Map(statsMap);
    const newAgesMap = new Map(agesMap);

    newStatsMap.set(department, {
      male: 0,
      female: 0,
      ageRange: '',
      hair: {},
      addressUser: {},
    });

    newAgesMap.set(department, []);

    return { statsMap: newStatsMap, agesMap: newAgesMap };
  }

  return { statsMap, agesMap };
}
