"use client";

import { Wallet, ArrowDownCircle, TrendingUp, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { walletInfo, ledgerEntries } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function WalletPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Wallet &amp; Ledger</h1>
        <p className="text-gray-500 text-sm mt-1">
          {walletInfo.organisation} beneficiary wallet · Settlement credits and payouts
        </p>
      </div>

      {/* Wallet stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-navy to-navy-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-white/60 flex items-center justify-between uppercase tracking-wider">
              Wallet Balance
              <Wallet className="h-4 w-4 text-teal" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(walletInfo.balance)}</p>
            <p className="text-xs text-white/50 mt-1">{walletInfo.organisation}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between uppercase tracking-wider">
              Available for Payout
              <ArrowDownCircle className="h-4 w-4 text-teal" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">{formatCurrency(walletInfo.availableForPayout)}</p>
            <p className="text-xs text-green-600 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between uppercase tracking-wider">
              Total Credits (YTD)
              <TrendingUp className="h-4 w-4 text-teal" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">
              {formatCurrency(ledgerEntries.filter(e => e.type === "CREDIT").reduce((s, e) => s + e.amount, 0))}
            </p>
            <p className="text-xs text-gray-400 mt-1">10 credit entries</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between uppercase tracking-wider">
              Last Payout
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">{walletInfo.lastPayout}</p>
            <p className="text-xs text-gray-400 mt-1">To NIMASA Gov Account</p>
          </CardContent>
        </Card>
      </div>

      {/* Ledger */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-navy">Ledger Entries</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">Append-only transaction history</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Export ledger CSV (prototype)")}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  {["Date", "Type", "Description", "Amount", "Running Balance"].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          entry.type === "CREDIT"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.type === "CREDIT" ? "↑ " : "↓ "}
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-700">{entry.description}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-sm font-semibold ${
                          entry.type === "CREDIT" ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {entry.type === "CREDIT" ? "+" : "-"}
                        {formatCurrency(entry.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-mono font-medium text-gray-900">
                        {formatCurrency(entry.runningBalance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
