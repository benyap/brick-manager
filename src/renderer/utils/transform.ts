export function keyBy<T>(objects: T[], field: keyof T): { [key: string]: T } {
  const map: { [key: string]: T } = {};
  for (const object of objects) {
    const key = String(object[field]);
    if (!key) continue;
    map[key] = object;
  }
  return map;
}

export function groupBy<T>(objects: T[], field: keyof T): { [key: string]: T[] } {
  const map: { [key: string]: T[] } = {};
  for (const object of objects) {
    const key = String(object[field]);
    if (!key) continue;
    if (key in map) map[key].push(object);
    else map[key] = [object];
  }
  return map;
}
