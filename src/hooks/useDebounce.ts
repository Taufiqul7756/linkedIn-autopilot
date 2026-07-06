import { useMemo } from "react";
import debounce from "lodash/debounce";

export function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
  return useMemo(() => debounce(fn, delay), [fn, delay]);
}
