import { DepartmentStats } from '@/@types/department';
import { User } from '@/@types/user';
import { mapToObject } from './mapToObject';
import { computeAgeRanges } from './computeAgeRanges';
import { getUpdatedDepartmentStats } from './getUpdatedDepartmentStats';

type TransformedResult = Record<string, DepartmentStats>;

export function groupDepartmentByUserData(
  users: User[]
): TransformedResult {
  let statsMap = new Map<string, DepartmentStats>();
  let agesMap = new Map<string, number[]>();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const department = user.company.department;

    if (!statsMap.has(department)) {
      statsMap = new Map(statsMap).set(department, {
        male: 0,
        female: 0,
        ageRange: '',
        hair: {},
        addressUser: {},
      });
      agesMap = new Map(agesMap).set(department, []);
    }

    const currentStats = statsMap.get(department)!;
    const currentAges = agesMap.get(department)!;

    const updatedStats = getUpdatedDepartmentStats(
      user,
      currentStats
    );
    statsMap.set(department, updatedStats);
    currentAges.push(user.age);
  }

  const finalStatsMap = computeAgeRanges(statsMap, agesMap);
  return mapToObject(finalStatsMap);
}
