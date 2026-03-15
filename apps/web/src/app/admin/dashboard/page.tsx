import {
  DollarSign,
  TrendingUp,
  Clock,
  Building2,
  Activity,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminStats, activityFeed } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const eventColorMap: Record<string, string> = {
  PaymentCompleted: "bg-green-100 text-green-800",
  WalletCredited: "bg-teal-100 text-teal-800",
  EscrowReleased: "bg-blue-100 text-blue-800",
  SettlementDispatched: "bg-purple-100 text-purple-800",
  PaymentFailed: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide revenue and activity · March 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <Card className="border-0 shadow-sm xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between">
              Total Revenue (YTD)
              <TrendingUp className="h-4 w-4 text-teal" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-navy">{formatCurrency(adminStats.totalRevenueYTD)}</p>
            <p className="text-xs text-green-600 mt-1">+12.4% vs last year</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between">
              This Month
              <DollarSign className="h-4 w-4 text-teal" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-navy">{formatCurrency(adminStats.thisMonth)}</p>
            <p className="text-xs text-gray-400 mt-1">March 2026</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between">
              Pending Settlement
              <Clock className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-navy">{formatCurrency(adminStats.pendingSettlement)}</p>
            <p className="text-xs text-amber-500 mt-1">Awaiting dispatch</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between">
              Organisations
              <Building2 className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-navy">{adminStats.organisations}</p>
            <p className="text-xs text-gray-400 mt-1">Active operators</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 flex items-center justify-between">
              Payments Today
              <CreditCard className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-navy">{adminStats.paymentsToday}</p>
            <p className="text-xs text-gray-400 mt-1">10 Mar 2026</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart placeholder */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-navy flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 bg-gradient-to-br from-navy/5 to-teal/5 rounded-xl border-2 border-dashed border-navy/10 flex flex-col items-center justify-center">
              <TrendingUp className="h-10 w-10 text-navy/20 mb-3" />
              <p className="text-navy/40 font-semibold text-sm">Revenue trend chart (Jan–Mar 2026)</p>
              <p className="text-navy/30 text-xs mt-1">Chart component — integrate Recharts or Chart.js</p>
            </div>
            {/* Mock bar chart visual */}
            <div className="mt-4 flex items-end justify-around gap-2 h-16">
              {[
                { month: "Jan", pct: 60 },
                { month: "Feb", pct: 75 },
                { month: "Mar", pct: 45 },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-teal/20 rounded-t-md relative overflow-hidden"
                    style={{ height: `${item.pct}px` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-teal rounded-t-md"
                      style={{ height: `${item.pct * 0.7}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-navy flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {activityFeed.map((item) => (
                <div key={item.id} className="px-5 py-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mt-0.5 ${
                        eventColorMap[item.event] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.event}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{item.timestamp}</p>
                    {item.amount && (
                      <p className="text-xs font-semibold text-teal">
                        {formatCurrency(item.amount)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
