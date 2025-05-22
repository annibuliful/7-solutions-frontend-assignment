import { DepartmentStats } from '@/@types/department';
import { Gender, User } from '@/@types/user';

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
    ({ statsMap, agesMap } = departmentInitializedPure(
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

  statsMap = computeAgeRangesPure(statsMap, agesMap);
  return mapToObject(statsMap);
}

function departmentInitializedPure(
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

function getUpdatedDepartmentStats(
  user: User,
  stats: DepartmentStats
): DepartmentStats {
  const gender = user.gender as Gender;
  const hairColor = user.hair.color;
  const fullName = `${user.firstName}${user.lastName}`;
  const postalCode = user.address.postalCode;

  return {
    ...stats,
    [gender]: stats[gender] + 1,
    hair: {
      ...stats.hair,
      [hairColor]: (stats.hair[hairColor] || 0) + 1,
    },
    addressUser: {
      ...stats.addressUser,
      [fullName]: postalCode,
    },
  };
}

function computeAgeRangesPure(
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

function mapToObject<K extends string, V>(
  map: Map<K, V>
): Record<K, V> {
  const obj = {} as Record<K, V>;
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}
