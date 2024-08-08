import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 250): T {
  const [debounceValue, setDebouceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouceValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounceValue;
}
