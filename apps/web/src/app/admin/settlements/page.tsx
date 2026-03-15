"use client";

import { useState } from "react";
import { Landmark, CheckCircle, Clock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { settlements, type Settlement } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

function SettlementStatusBadge({ status }: { status: string }) {
  if (status === "SETTLED") return <Badge variant="success">SETTLED</Badge>;
  if (status === "PROCESSING") return <Badge variant="processing">PROCESSING</Badge>;
  return <Badge variant="pending">PENDING</Badge>;
}

function PayoutStatusDot({ status }: { status: string }) {
  if (status === "COMPLETED") return <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5" />;
  if (status === "FAILED") return <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5" />;
  return <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5" />;
}

function BatchDetailRow({ settlement }: { settlement: Settlement }) {
  return (
    <tr>
      <td colSpan={10} className="px-4 py-0">
        <div className="bg-slate-50 border border-slate-200 rounded-lg mx-1 my-2 overflow-hidden">
          <div className="px-4 py-2 bg-navy/5 border-b border-slate-200">
            <p className="text-xs font-semibold text-navy uppercase tracking-wider">
              Payout Breakdown — {settlement.batchId}
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Beneficiary</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Currency</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Provider</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Status</th>
                <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Payout Ref</th>
              </tr>
            </thead>
            <tbody>
              {settlement.payouts.map((p, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{p.beneficiary}</td>
                  <td className="px-4 py-2 text-sm font-mono text-gray-700">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.payoutCurrency === "NGN" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {p.payoutCurrency}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{p.payoutMethod}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className="flex items-center">
                      <PayoutStatusDot status={p.payoutStatus} />
                      {p.payoutStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs font-mono text-gray-400">{p.payoutRef ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
}

export default function SettlementsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Settlements</h1>
          <p className="text-gray-500 text-sm mt-1">
            Revenue settlement batches dispatched to beneficiaries
          </p>
        </div>
        <Button variant="teal" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Trigger Manual Settlement
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Settled (YTD)</p>
                <p className="text-xl font-bold text-navy mt-1">
                  {formatCurrency(settlements.filter(s => s.status === "SETTLED").reduce((sum, s) => sum + s.total, 0))}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Batches Settled</p>
                <p className="text-xl font-bold text-navy mt-1">
                  {settlements.filter(s => s.status === "SETTLED").length}
                </p>
              </div>
              <Landmark className="h-8 w-8 text-teal" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Pending</p>
                <p className="text-xl font-bold text-navy mt-1">
                  {formatCurrency(settlements.filter(s => s.status !== "SETTLED").reduce((sum, s) => sum + s.total, 0))}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settlements table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-navy">Settlement Batches</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  {[
                    "Batch ID", "Period", "Payments", "Total",
                    "NIMASA (25%)", "Port Auth (25%)", "Blue Wave (25%)", "Liquid Payments (25%)",
                    "Status", "Triggered",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {settlements.map((s, idx) => (
                  <>
                    <tr
                      key={s.id}
                      className={`border-b hover:bg-slate-50 transition-colors cursor-pointer ${idx % 2 !== 0 ? "bg-slate-50/50" : ""}`}
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {expandedId === s.id
                            ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                            : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
                          <span className="text-sm font-mono font-bold text-navy">{s.batchId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600 whitespace-nowrap">{s.period}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-medium">{s.payments}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(s.total)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{formatCurrency(s.nimasa)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{formatCurrency(s.portAuthority)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{formatCurrency(s.blueWave)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{formatCurrency(s.liquidPayments)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <SettlementStatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-400 whitespace-nowrap">{s.triggered}</span>
                      </td>
                    </tr>
                    {expandedId === s.id && <BatchDetailRow key={`detail-${s.id}`} settlement={s} />}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
