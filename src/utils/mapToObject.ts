export function mapToObject<K extends string, V>(
  map: Map<K, V>
): Record<K, V> {
  const obj = {} as Record<K, V>;
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}
