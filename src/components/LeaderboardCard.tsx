import { Avatar } from "reshaped";
import type { Tenant } from "../types/types";

type Metric = "transactions" | "revenue";

type Props = {
  title: string;
  description: string;
  items: Tenant[];
  metric: Metric;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const valueOf = (t: Tenant, m: Metric) =>
  m === "revenue" ? t.totalSales ?? 0 : t.transactionCount ?? 0;

export function LeaderboardCard({ title, description, items, metric }: Props) {
  // Hitung fallback total jika backend tidak menyediakan transactionPercentage
  const total = items.reduce((sum, t) => sum + valueOf(t, metric), 0);

  return (
    <section className="overflow-hidden rounded-lg bg-white">
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-xl font-semibold text-neutral-950">{title}</h2>
        <p className="mt-2 text-neutral-600">{description}</p>
      </div>

      {items.length === 0 ? (
        <p className="px-6 pb-8 text-neutral-500">Belum ada transaksi.</p>
      ) : (
        <ol>
          {items.map((t, i) => {
            const percentage =
              typeof t.transactionPercentage === "number"
                ? t.transactionPercentage
                : total
                  ? (valueOf(t, metric) / total) * 100
                  : 0;

            const first = i === 0;

            return (
              <li
                key={t.posProfileId}
                className={`px-6 ${first ? "bg-[#fdf5e6]" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 py-4 ${
                    i < items.length - 1 ? "border-b border-neutral-200" : ""
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                      first
                        ? "bg-gradient-to-b from-[#ffd85a] to-[#f5b400] text-neutral-950"
                        : "bg-neutral-100 text-neutral-950"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <Avatar
                    size={12}
                    src={t.profilePict || undefined}
                    initials={initials(t.name)}
                    color="neutral"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-950">
                      {t.name}
                    </p>
                    {t.location && (
                      <p className="truncate text-xs text-neutral-500">
                        {t.location}
                      </p>
                    )}
                    {/* <p className="truncate text-xs text-neutral-600">
                      {metric === "revenue"
                        ? rupiah.format(t.totalSales ?? 0)
                        : `${(t.transactionCount ?? 0).toLocaleString("id-ID")} transaksi`}
                    </p> */}
                  </div>

                  <span className="text-sm font-semibold text-neutral-950 tabular-nums">
                    {percentage.toFixed(2)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
