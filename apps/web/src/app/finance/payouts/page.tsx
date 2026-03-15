import { TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const payouts = [
  { id: "po1", date: "28 Feb 2026", amount: 145000, ref: "PO-2026-002", status: "COMPLETED", account: "NIMASA Gov Account ****4521" },
  { id: "po2", date: "31 Jan 2026", amount: 128000, ref: "PO-2026-001", status: "COMPLETED", account: "NIMASA Gov Account ****4521" },
  { id: "po3", date: "31 Dec 2025", amount: 189000, ref: "PO-2025-012", status: "COMPLETED", account: "NIMASA Gov Account ****4521" },
];

export default function PayoutsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Payouts</h1>
          <p className="text-gray-500 text-sm mt-1">Withdrawal history to NIMASA government account</p>
        </div>
        <Button variant="teal" size="sm">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-navy flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-teal" />
            Payout History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                {["Date", "Reference", "Amount", "Account", "Status"].map((col) => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 text-sm text-gray-600">{p.date}</td>
                  <td className="px-5 py-3 text-sm font-mono text-navy font-medium">{p.ref}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{p.account}</td>
                  <td className="px-5 py-3"><Badge variant="success">{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
