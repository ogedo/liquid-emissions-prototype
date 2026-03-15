import Link from "next/link";
import {
  DollarSign,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { dashboardStats, operatorPayments } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const recentPayments = operatorPayments.slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Apex Shipping Ltd · March 2026</p>
        </div>
        <Link href="/pay">
          <Button variant="teal" size="lg">
            Pay Emission Fee
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Total Payments (This Month)
              <DollarSign className="h-4 w-4 text-teal" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">
              {formatCurrency(dashboardStats.totalPaymentsThisMonth)}
            </p>
            <p className="text-xs text-gray-400 mt-1">March 2026</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Payments Made
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">{dashboardStats.paymentsMade}</p>
            <p className="text-xs text-gray-400 mt-1">Completed this month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Pending Assessments
              <Clock className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">{dashboardStats.pendingAssessments}</p>
            <p className="text-xs text-amber-500 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
              Last Payment
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-navy">{dashboardStats.lastPayment}</p>
            <p className="text-xs text-gray-400 mt-1">MV Atlantic Spirit</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent payments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-navy">Recent Payments</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">Last 5 emission fee payments</p>
          </div>
          <Link href="/payments">
            <Button variant="outline" size="sm">
              View all
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">Payment Ref ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">Vessel</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">Amount (USD)</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">NGN Equiv</th>
                  <th className="text-center text-xs font-semibold text-gray-500 px-6 py-3 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment, idx) => (
                  <tr
                    key={payment.id}
                    className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/50"}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-navy font-medium">
                        {payment.paymentRefId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.vesselName}</p>
                        <p className="text-xs text-gray-400">IMO {payment.imoNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(payment.ngnEquiv, "NGN")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={payment.status} />
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
