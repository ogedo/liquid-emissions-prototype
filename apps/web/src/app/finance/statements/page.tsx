"use client";

import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statements = [
  { id: "st1", period: "February 2026", generated: "01 Mar 2026", credits: 4, total: "$65,654.00" },
  { id: "st2", period: "January 2026", generated: "01 Feb 2026", credits: 3, total: "$90,960.00" },
  { id: "st3", period: "December 2025", generated: "01 Jan 2026", credits: 3, total: "$116,280.00" },
];

export default function StatementsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Monthly Statements</h1>
        <p className="text-gray-500 text-sm mt-1">Wallet statements for NIMASA reconciliation</p>
      </div>
      <div className="space-y-3">
        {statements.map((s) => (
          <Card key={s.id} className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Statement — {s.period}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {s.credits} credit entries · Total credits: {s.total} · Generated {s.generated}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert(`Download statement (prototype)`)}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
