import { DepartmentStats } from '@/@types/department';
import { User, Gender } from '@/@types/user';

export function getUpdatedDepartmentStats(
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
