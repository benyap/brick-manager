import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number): T | undefined {
  const [debouncedValue, setDebouncedValue] = useState<T>();
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
