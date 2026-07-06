import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useMutationWithTokenRefresh<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData | undefined>,
  options?: Omit<UseMutationOptions<TData | undefined, Error, TVariables>, "mutationFn">
) {
  return useMutation<TData | undefined, Error, TVariables>({
    mutationFn,
    ...options,
  });
}
