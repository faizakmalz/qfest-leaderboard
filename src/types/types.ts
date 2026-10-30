export type Tenant = {
  posProfileId: string;
  name: string;
  profilePict: string | null;
  location?: string | null;
  totalSales?: number;
  transactionCount?: number;
  transactionPercentage?: number;
};

export type LeaderboardResponse = {
  refreshedAt: string;
  topByRevenue: Tenant[];
  topByTransactionCount?: Tenant[];
};
