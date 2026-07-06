import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

export function useQueryWithTokenRefresh<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T | undefined>,
  options?: Omit<UseQueryOptions<T | undefined, Error>, "queryKey" | "queryFn">
) {
  return useQuery<T | undefined, Error>({
    queryKey,
    queryFn,
    ...options,
  });
}
