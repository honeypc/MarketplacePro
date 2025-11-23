import { useEffect, useState } from "react";
import { Link } from "wouter";

interface AffiliateSummary {
  affiliate: {
    referralCode: string;
    commissionRate: number;
  };
  summary: {
    clicks: number;
    conversions: number;
    pendingCommission: number;
  };
  conversions: Array<{
    id: number;
    amount: number;
    commission: number;
    status: string;
  }>;
  payouts: Array<{
    id: number;
    amount: number;
    status: string;
    requestedAt: string;
  }>;
}

export default function AffiliateDashboard() {
  const [data, setData] = useState<AffiliateSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/affiliates/stats");
        if (!res.ok) throw new Error("Unable to load affiliate stats");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading affiliate dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track clicks, conversions, and payouts for your referral code.
          </p>
        </div>
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 shadow">
          Referral Code: <span className="font-mono">{data.affiliate.referralCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Clicks</p>
          <p className="text-3xl font-semibold">{data.summary.clicks}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Conversions</p>
          <p className="text-3xl font-semibold">{data.summary.conversions}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pending Commission</p>
          <p className="text-3xl font-semibold">
            ${data.summary.pendingCommission.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Conversions</h2>
          <span className="text-sm text-muted-foreground">Commission rate {data.affiliate.commissionRate * 100}%</span>
        </div>
        <div className="space-y-2">
          {data.conversions.length === 0 && (
            <p className="text-sm text-muted-foreground">No conversions yet. Share your referral link!</p>
          )}
          {data.conversions.map((conversion) => (
            <div key={conversion.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <p className="font-medium">${conversion.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Commission ${conversion.commission.toFixed(2)}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{conversion.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Payouts</h2>
          <Link href="/support" className="text-sm text-primary hover:underline">
            Request payout
          </Link>
        </div>
        <div className="space-y-2">
          {data.payouts.length === 0 && (
            <p className="text-sm text-muted-foreground">No payouts requested yet.</p>
          )}
          {data.payouts.map((payout) => (
            <div key={payout.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <p className="font-medium">${payout.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Requested {new Date(payout.requestedAt).toLocaleDateString()}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{payout.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
