import useSWR from "swr";
import type { Business } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useBusinesses(tag?: string) {
  const params = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Business[];
  }>(`/api/businesses${params}`, fetcher);

  return {
    businesses: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
