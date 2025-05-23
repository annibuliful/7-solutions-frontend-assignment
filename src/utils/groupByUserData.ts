import { DepartmentStats } from '@/@types/department';
import { User } from '@/@types/user';
import { mapToObject } from './mapToObject';
import { computeAgeRanges } from './computeAgeRanges';
import { getUpdatedDepartmentStats } from './getUpdatedDepartmentStats';
import { departmentInitialized } from './departmentInitialized';

type TransformedResult = Record<string, DepartmentStats>;

export function groupDepartmentByUserData(
  users: User[]
): TransformedResult {
  let statsMap = new Map<string, DepartmentStats>();
  let agesMap = new Map<string, number[]>();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const department = user.company.department;

    // make to immutable value
    ({ statsMap, agesMap } = departmentInitialized(
      statsMap,
      agesMap,
      department
    ));

    const stats = statsMap.get(department)!;
    const updatedStats = getUpdatedDepartmentStats(user, stats);
    statsMap.set(department, updatedStats);

    const updatedAges = [...agesMap.get(department)!, user.age];
    agesMap.set(department, updatedAges);
  }

  statsMap = computeAgeRanges(statsMap, agesMap);
  return mapToObject(statsMap);
}
