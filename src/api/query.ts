import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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
      // Selalu sertakan query params dan timestamp _t agar request tidak pernah di-cache oleh CEF OBS
      const url = new URL(URL_, window.location.origin);
      if (params.startDate) url.searchParams.set("startDate", params.startDate);
      if (params.endDate) url.searchParams.set("endDate", params.endDate);
      url.searchParams.set("_t", Date.now().toString());

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
      return res.json();
    },
    refetchInterval: 2 * 60 * 1000, // Polling berkala 2 menit
    refetchIntervalInBackground: true, // Tetap berjalan di background
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    staleTime: 0,
  });

  const lastTimeRef = useRef<number>(Date.now());
  const refetchRef = useRef(query.refetch);
  refetchRef.current = query.refetch;

  // 1. Time-gap detector (menangkap kondisi freeze / pause saat OBS pindah scene)
  // Ketika scene OBS disembunyikan dan dibuka kembali setelah freeze,
  // gap waktu melompat (> 2 detik), seketika melakukan refresh tanpa menunggu interval 2 menit habis.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (elapsed > 2000) {
        // Terjadi wake-up setelah freeze/pause di OBS
        refetchRef.current();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Multi-event listener untuk OBS CEF & Browser saat scene/layar aktif kembali
  useEffect(() => {
    const triggerRefetch = () => {
      refetchRef.current();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        triggerRefetch();
      }
    };

    // Event browser & OBS CEF saat scene aktif kembali
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", triggerRefetch);
    window.addEventListener("pageshow", triggerRefetch);
    window.addEventListener("resize", triggerRefetch); // OBS CEF sering mengirim resize saat switch scene
    window.addEventListener("online", triggerRefetch);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", triggerRefetch);
      window.removeEventListener("pageshow", triggerRefetch);
      window.removeEventListener("resize", triggerRefetch);
      window.removeEventListener("online", triggerRefetch);
    };
  }, []);

  return query;
}
