export function mergeObjects<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const k = key as keyof T;
    if (source[k] !== undefined && source[k] !== null) {
      result[k] = source[k] as T[keyof T];
    }
  }
  return result;
}
