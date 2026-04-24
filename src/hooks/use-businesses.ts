import useSWR from "swr";
import type { Business } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useBusinesses(tag?: string, visited?: boolean) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (visited !== undefined) params.set("visited", String(visited));

  const qs = params.toString();
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Business[];
  }>(`/api/businesses${qs ? `?${qs}` : ""}`, fetcher);

  return {
    businesses: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
