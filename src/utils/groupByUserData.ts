import { DepartmentStats } from '@/@types/department';
import { Gender, User } from '@/@types/user';

type TransformedResult = Record<string, DepartmentStats>;

export function groupByUserData(users: User[]): TransformedResult {
  const departmentStatsMap = new Map<string, DepartmentStats>();
  const departmentAgesMap = new Map<string, number[]>();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const department = user.company.department;

    departmentInitialized({
      department,
      statsMap: departmentStatsMap,
      agesMap: departmentAgesMap,
    });

    const stats = departmentStatsMap.get(department)!;
    const ages = departmentAgesMap.get(department)!;

    updateDepartmentStats(user, stats);
    ages.push(user.age);
  }

  computeAgeRanges(departmentStatsMap, departmentAgesMap);

  return mapToObject(departmentStatsMap);
}

type DepartmentInitializedParams = {
  department: string;
  statsMap: Map<string, DepartmentStats>;
  agesMap: Map<string, number[]>;
};

function departmentInitialized({
  department,
  statsMap,
  agesMap,
}: DepartmentInitializedParams) {
  if (!statsMap.has(department)) {
    statsMap.set(department, {
      male: 0,
      female: 0,
      ageRange: '',
      hair: {},
      addressUser: {},
    });
    agesMap.set(department, []);
  }
}

function updateDepartmentStats(user: User, stats: DepartmentStats) {
  const gender = user.gender as Gender;
  const hairColor = user.hair.color;
  const nameKey = `${user.firstName}${user.lastName}`;
  const postalCode = user.address.postalCode;

  stats[gender]++;
  stats.hair[hairColor] = (stats.hair[hairColor] || 0) + 1;
  stats.addressUser[nameKey] = postalCode;
}

function computeAgeRanges(
  statsMap: Map<string, DepartmentStats>,
  agesMap: Map<string, number[]>
) {
  for (const [department, stats] of statsMap.entries()) {
    const ages = agesMap.get(department) || [];
    if (ages.length > 0) {
      let min = ages[0];
      let max = ages[0];

      for (let i = 1; i < ages.length; i++) {
        if (ages[i] < min) min = ages[i];
        if (ages[i] > max) max = ages[i];
      }

      stats.ageRange = `${min}-${max}`;
    }
  }
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
