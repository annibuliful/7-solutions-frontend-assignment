import { DepartmentStats } from '@/@types/department';

export function computeAgeRanges(
  statsMap: Map<string, DepartmentStats>,
  agesMap: Map<string, number[]>
): Map<string, DepartmentStats> {
  const newStatsMap = new Map<string, DepartmentStats>();

  for (const [department, stats] of statsMap.entries()) {
    const ages = agesMap.get(department) || [];

    if (ages.length === 0) {
      newStatsMap.set(department, { ...stats, ageRange: '' });
      continue;
    }

    let min = ages[0];
    let max = ages[0];

    for (let i = 1; i < ages.length; i++) {
      if (ages[i] < min) min = ages[i];
      if (ages[i] > max) max = ages[i];
    }

    newStatsMap.set(department, {
      ...stats,
      ageRange: `${min}-${max}`,
    });
  }

  return newStatsMap;
}
