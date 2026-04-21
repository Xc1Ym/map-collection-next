import useSWR from "swr";
import type { Tag } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useTags() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Tag[];
  }>("/api/tags", fetcher);

  return {
    tags: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
