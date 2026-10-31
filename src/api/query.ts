import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { LeaderboardResponse } from "../types/types";

const URL_ = import.meta.env.VITE_LEADERBOARD_URL as string;

export type LeaderboardParams = {
  startDate?: string;
  endDate?: string;
};

export function useLeaderboard(
  params: LeaderboardParams = {
    startDate: "2026-10-31",
    endDate: "2026-11-01",
  }
) {
  const query = useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard", params],
    queryFn: async () => {
      const url = new URL(URL_, window.location.origin);
      if (params.startDate) url.searchParams.set("startDate", params.startDate);
      if (params.endDate) url.searchParams.set("endDate", params.endDate);

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
      return res.json();
    },
    refetchInterval: 2 * 60 * 1000, // polling otomatis setiap 10 detik agar OBS selalu ter-update
    refetchIntervalInBackground: true, // OBS browser source / background tab tetap ter-update
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    staleTime: 0,
  });

  // Listener khusus visibility & focus untuk OBS Browser Source / Window capture
  useEffect(() => {
    const handleActive = () => {
      if (document.visibilityState === "visible") {
        query.refetch();
      }
    };

    const handleFocus = () => {
      query.refetch();
    };

    document.addEventListener("visibilitychange", handleActive);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handleActive);

    return () => {
      document.removeEventListener("visibilitychange", handleActive);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handleActive);
    };
  }, [query.refetch]);

  return query;
}
