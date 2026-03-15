"use client";

import { FileBarChart, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  { id: "r1", name: "Revenue Summary Report (Q1 2026)", type: "Revenue", period: "Jan–Mar 2026", generated: "10 Mar 2026" },
  { id: "r2", name: "Emissions Compliance Report (Feb 2026)", type: "Compliance", period: "Feb 2026", generated: "01 Mar 2026" },
  { id: "r3", name: "Settlement Disbursement Report (Feb 2026)", type: "Settlement", period: "Feb 2026", generated: "01 Mar 2026" },
  { id: "r4", name: "Operator Activity Report (Jan 2026)", type: "Activity", period: "Jan 2026", generated: "01 Feb 2026" },
];

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Audit trails, analytics and exports</p>
        </div>
        <Button variant="teal" size="sm">
          <FileBarChart className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="border-0 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                    <FileBarChart className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">{report.period}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{report.type}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">Generated {report.generated}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Download ${report.name} (prototype)`)}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
