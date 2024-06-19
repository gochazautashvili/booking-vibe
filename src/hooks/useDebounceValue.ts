import { useEffect, useState } from "react";

export const useDebounceValue = (value: string, delay?: number) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay || 300);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
};
