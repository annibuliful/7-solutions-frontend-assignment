import { mapToObject } from '../mapToObject';

describe('mapToObject', () => {
  it('converts a Map<string, number> to a Record<string, number>', () => {
    const input = new Map<string, number>([
      ['one', 1],
      ['two', 2],
    ]);

    const result = mapToObject(input);

    expect(result).toEqual({
      one: 1,
      two: 2,
    });
  });

  it('returns an empty object for an empty map', () => {
    const input = new Map();
    const result = mapToObject(input);
    expect(result).toEqual({});
  });

  it('preserves key/value pairs and types correctly', () => {
    type MyValue = { id: number; name: string };
    const input = new Map<string, MyValue>([
      ['a', { id: 1, name: 'Alice' }],
      ['b', { id: 2, name: 'Bob' }],
    ]);

    const result = mapToObject(input);

    expect(result.a).toEqual({ id: 1, name: 'Alice' });
    expect(result.b).toEqual({ id: 2, name: 'Bob' });
  });
});
