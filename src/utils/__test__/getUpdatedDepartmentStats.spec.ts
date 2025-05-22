import { DepartmentStats } from '@/@types/department';
import { getUpdatedDepartmentStats } from '../getUpdatedDepartmentStats';
import { mockBaseStats, mockUser } from './mock';

describe('getUpdatedDepartmentStats', () => {
  it('increments gender count and adds hair color and address entry', () => {
    const updated = getUpdatedDepartmentStats(
      mockUser,
      mockBaseStats
    );

    expect(updated.male).toBe(1);
    expect(updated.female).toBe(0);
    expect(updated.hair.Black).toBe(1);
    expect(updated.addressUser['JohnDoe']).toBe('12345');
  });

  it('increments existing values instead of overwriting', () => {
    const currentStats: DepartmentStats = {
      male: 2,
      female: 1,
      ageRange: '',
      hair: { Black: 3 },
      addressUser: { JohnDoe: '00000' },
    };

    const updated = getUpdatedDepartmentStats(mockUser, currentStats);

    expect(updated.male).toBe(3);
    expect(updated.female).toBe(1);
    expect(updated.hair.Black).toBe(4);
    expect(updated.addressUser['JohnDoe']).toBe('12345');
  });

  it('returns a new object and preserves immutability', () => {
    const updated = getUpdatedDepartmentStats(
      mockUser,
      mockBaseStats
    );

    expect(updated).not.toBe(mockBaseStats);
    expect(updated.hair).not.toBe(mockBaseStats.hair);
    expect(updated.addressUser).not.toBe(mockBaseStats.addressUser);
  });
});
