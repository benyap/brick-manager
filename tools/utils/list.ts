export function unique<T>(items?: T[]) {
  if (!items) return items;
  return Array.from(new Set(items));
}
