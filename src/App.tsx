import { Button, useToast } from "reshaped";
import { useLeaderboard } from "./api/query";
import { LeaderboardCard } from "./components/LeaderboardCard";
import { Check, RotateCw } from "lucide-react";

const TOP_N = 5;

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", ...opts });

const dateFmt = fmt({ day: "numeric", month: "long", year: "numeric" });
const timeFmt = fmt({ hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

const formatUpdated = (iso: string) => {
  const d = new Date(iso);
  return `${dateFmt.format(d)}, at ${timeFmt.format(d)}`;
};

export default function App() {
  const { data, isFetching, isError, refetch } = useLeaderboard();

  const toast = useToast();

  const handleUpdate = async () => {
    const res = await refetch();
    toast.show(
      res.isSuccess
        ? { color: "positive", icon: <Check />, text: "Data berhasil diperbarui", position: 'bottom' }
        : { color: "critical", text: "Gagal memperbarui data" },
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="relative h-[200px] overflow-hidden bg-[linear-gradient(90deg,#edf2ff_0%,#e8eeff_50%,#f3f6ff_100%)]">
        {/* lingkaran dekoratif (koordinat dari design 1440px) */}
        <div className="absolute -top-[55px] -left-[55px] size-[310px] rounded-full bg-gradient-to-br from-white/95 to-[#f3f6ff]/80 ring-1 ring-white" />
        <div className="absolute top-[234px] left-[248px] size-[126px] rounded-full bg-white/75 ring-1 ring-[#dfe7ff]" />        <div className="absolute -top-[34px] right-[182px] size-[98px] rounded-full bg-[#e9efff]/70 ring-1 ring-white/70" />
        <div className="absolute top-[60px] -right-[90px] size-[290px] rounded-full bg-gradient-to-bl from-white/60 via-white/30 to-[#e8eeff]/20 ring-1 ring-[#dfe7ff]/60" />

        {/* medal: ujung ribbon terpotong di bawah header, seperti di design */}
        <img src="/assets/medal.svg" alt="" className="absolute top-[10px] left-[88px] hidden w-[152px] max-w-none lg:block" />
        <img src="/assets/trophy.svg" alt="" className="absolute right-[95px] bottom-0 hidden w-[165px] max-w-none lg:block" />

        <div className="relative flex h-full flex-col items-center px-6 pt-[50px] text-center">
          <h1 className="text-[32px] lg:text-4xl leading-[38px] font-bold text-neutral-950">
            QFEST Tenant Leaderboard
          </h1>
          <p className="mt-3 text-neutral-600">
            Siapa yang memimpin kompetisi penjualan QFEST? Lihat peringkat tenant terbaik di sini.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <img src="/assets/logo-channelq.svg" alt="Channel" className="h-5" />
            <img src="/assets/qfest-logo.svg" alt="QFEST" className="h-11" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[964px] px-4 pb-16">
        {/* Last update */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">Last update</h2>
            <p className="mt-1 text-neutral-600">
              {data ? formatUpdated(data.refreshedAt) : "—"}
              {isError && <span className="ml-2 text-red-600">Koneksi bermasalah, menampilkan data terakhir.</span>}
            </p>
          </div>
          <Button variant="outline" loading={isFetching} onClick={handleUpdate} className="font-sans!">
            <RotateCw className="text-neutral-500 font-sans"/> Update
          </Button>
        </div>

        {/* Leaderboards */}
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <LeaderboardCard
            title="Transaction Champion"
            description="Tenant dengan transaksi terbanyak selama QFEST."
            items={data?.topByTransactionCount?.slice(0, TOP_N).sort((n) => Number(n.transactionPercentage) ) ?? []}
            metric="transactions"
          />
          <LeaderboardCard
            title="Revenue Champion"
            description="Tenant dengan total omzet tertinggi selama QFEST."
            items={
              data?.topByRevenue
                ?.slice(0, TOP_N)
                .sort(
                  (a, b) =>
                    Number(b.totalSalesPercentage) -
                    Number(a.totalSalesPercentage)
                ) ?? []
            }
            metric="revenue"
          />
        </div>
      </main>
    </div>
  );
}
