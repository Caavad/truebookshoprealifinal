"use client";

import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number) {
  const [debounce, setDebonce] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebonce(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounce;
}
