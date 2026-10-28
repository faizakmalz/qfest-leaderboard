export type Tenant = {
  posProfileId: string;
  name: string;
  profilePict: string | null;
  totalSales: number;
  transactionCount: number;
};

export type LeaderboardResponse = {
  refreshedAt: string;
  topByRevenue: Tenant[];
  topByTransactionCount: Tenant[];
};