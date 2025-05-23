import { User } from '@/@types/user';
import { groupDepartmentByUserData } from '../groupDepartmentByUserData';

const mockUser = (overrides: Partial<User>): User =>
  ({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    gender: 'male',
    email: '',
    phone: '',
    username: '',
    password: '',
    birthDate: '',
    image: '',
    bloodGroup: '',
    height: 0,
    weight: 0,
    eyeColor: '',
    hair: { color: 'Black', type: 'Straight' },
    ip: '',
    address: {
      address: '',
      city: '',
      state: '',
      stateCode: '',
      postalCode: '12345',
      coordinates: { lat: 0, lng: 0 },
      country: '',
    },
    macAddress: '',
    university: '',
    bank: {
      cardExpire: '',
      cardNumber: '',
      cardType: '',
      currency: '',
      iban: '',
    },
    company: {
      department: 'Engineering',
      name: '',
      title: '',
      address: {
        address: '',
        city: '',
        state: '',
        stateCode: '',
        postalCode: '',
        coordinates: { lat: 0, lng: 0 },
        country: '',
      },
    },
    ein: '',
    ssn: '',
    userAgent: '',
    crypto: {
      coin: '',
      wallet: '',
      network: '',
    },
    role: 'user',
    ...overrides,
  } as never);

describe('groupDepartmentByUserData', () => {
  it('groups one user correctly', () => {
    const result = groupDepartmentByUserData([
      mockUser({
        firstName: 'Jane',
        lastName: 'Smith',
        gender: 'female',
        age: 25,
        hair: { color: 'Blond', type: 'Curly' },
        address: {
          ...mockUser({}).address,
          postalCode: '99999',
        },
        company: { ...mockUser({}).company, department: 'Design' },
      }),
    ]);

    expect(result).toEqual({
      Design: {
        male: 0,
        female: 1,
        ageRange: '25-25',
        hair: { Blond: 1 },
        addressUser: { JaneSmith: '99999' },
      },
    });
  });

  it('aggregates multiple users into the same department', () => {
    const users: User[] = [
      mockUser({
        gender: 'male',
        age: 28,
        hair: { color: 'Black', type: 'Straight' },
      }),
      mockUser({
        firstName: 'Alice',
        lastName: 'Lee',
        gender: 'female',
        age: 34,
        hair: { color: 'Black', type: 'Curly' },
      }),
    ];

    const result = groupDepartmentByUserData(users);
    expect(result.Engineering.male).toBe(1);
    expect(result.Engineering.female).toBe(1);
    expect(result.Engineering.hair).toEqual({ Black: 2 });
    expect(result.Engineering.ageRange).toBe('28-34');
    expect(result.Engineering.addressUser['JohnDoe']).toBe('12345');
    expect(result.Engineering.addressUser['AliceLee']).toBe('12345');
  });

  it('handles multiple departments independently', () => {
    const users: User[] = [
      mockUser({
        age: 22,
        company: { ...mockUser({}).company, department: 'HR' },
      }),
      mockUser({
        firstName: 'Ella',
        lastName: 'White',
        age: 45,
        gender: 'female',
        company: { ...mockUser({}).company, department: 'Finance' },
        address: { ...mockUser({}).address, postalCode: '55555' },
        hair: { color: 'Brown', type: 'Wavy' },
      }),
    ];

    const result = groupDepartmentByUserData(users);

    expect(Object.keys(result)).toContain('HR');
    expect(Object.keys(result)).toContain('Finance');
    expect(result.HR.ageRange).toBe('22-22');
    expect(result.Finance.ageRange).toBe('45-45');
    expect(result.Finance.hair.Brown).toBe(1);
    expect(result.Finance.addressUser['EllaWhite']).toBe('55555');
  });

  it('produces an empty object for an empty user list', () => {
    const result = groupDepartmentByUserData([]);
    expect(result).toEqual({});
  });
});
