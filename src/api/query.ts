import { useQuery } from "@tanstack/react-query";
import type { LeaderboardResponse } from "../types/types";

const URL_ = import.meta.env.VITE_LEADERBOARD_URL as string;

export type LeaderboardParams = {
  startDate?: string;
  endDate?: string;
};

export function useLeaderboard(params: LeaderboardParams = { startDate: "2026-10-31", endDate: "2026-11-01" }) {
  return useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard", params],
    queryFn: async () => {
      const url = new URL(URL_, window.location.origin);
      if (params.startDate) url.searchParams.set("startDate", params.startDate);
      if (params.endDate) url.searchParams.set("endDate", params.endDate);

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
      return res.json();
    },
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true, // layar event bisa tidak fokus
    staleTime: 5 * 60 * 1000,
  });
}
