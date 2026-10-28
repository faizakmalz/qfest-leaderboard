import { useQuery } from "@tanstack/react-query";
import type { LeaderboardResponse } from "../types/types";

const URL_ = import.meta.env.VITE_LEADERBOARD_URL as string;

export function useLeaderboard() {
  return useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch(URL_, { cache: "no-store" });
      if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
      return res.json();
    },
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true, // layar event bisa tidak fokus
    staleTime: 5 * 60 * 1000,
  });
}