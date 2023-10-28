// useApiWithToken.js
import useSWR from "swr";
import axios from "axios";

// pass the T here so that we get some type safety
const fetcher = <T>(url: string, queryParams?: Record<string, any>) => {
  // TODO: this is not really serious, but it works for the demo
  const storedToken = localStorage.getItem("jwtToken") ?? "";
  return axios
    .get<T>(url, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
      params: queryParams,
    })
    .then((response) => response.data);
};

/**
 *
 * @param endpoint an endpoint
 * @param queryParams query params, can be undefined and actually anything
 * @returns
 */
export function useData<T>(
  endpoint: string,
  queryParams?: Record<string, any>
) {
  // take any type
  const { data, error, mutate } = useSWR([endpoint, queryParams], () =>
    fetcher<T>(endpoint, queryParams)
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
}
