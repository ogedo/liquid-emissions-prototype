"use client";

import { useState } from "react";
import { Search, Filter, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { operatorPayments, type PaymentStatus } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = operatorPayments.filter((p) => {
    const matchesSearch =
      !search ||
      p.vesselName.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentRefId.toLowerCase().includes(search.toLowerCase()) ||
      p.imoNumber.includes(search);
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesDateFrom = !dateFrom || p.date >= dateFrom;
    const matchesDateTo = !dateTo || p.date <= dateTo;
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Payment History</h1>
        <p className="text-gray-500 text-sm mt-1">
          All emission fee payments for Apex Shipping Ltd · {operatorPayments.length} records
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Filter className="h-3 w-3 inline mr-1" />
                Search vessel or reference
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Vessel name, IMO, or ref ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-40 space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-36"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-36"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base text-navy">
            {filtered.length} payment{filtered.length !== 1 ? "s" : ""} found
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  {["Date", "Payment Ref ID", "Vessel Name", "IMO", "Port", "Base Fee", "Charges", "Total", "Currency", "Status", "Actions"].map((col) => (
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
                {filtered.map((payment, idx) => (
                  <tr
                    key={payment.id}
                    className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-navy font-semibold">
                        {payment.paymentRefId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{payment.vesselName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-500">{payment.imoNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{payment.portOfCall.split(" (")[0]}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {formatCurrency(payment.baseFee)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatCurrency(payment.charges)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                        {formatCurrency(payment.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${payment.currency === "USD" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
                        {payment.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal hover:text-teal-700 h-7 px-2"
                        onClick={() => alert(`Receipt for ${payment.transactionRef} (prototype — no real PDF)`)}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-gray-400">
                      No payments match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
