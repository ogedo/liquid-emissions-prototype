import { FileBarChart, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const feeSchedules = [
  {
    id: "fs1",
    name: "Nigeria Standard Emission Fee",
    rate: 100,
    currency: "USD",
    unit: "per tonne CO₂e",
    minGRT: 5000,
    effectiveFrom: "01 Jan 2026",
    effectiveTo: "31 Dec 2026",
    status: "ACTIVE",
  },
  {
    id: "fs2",
    name: "Nigeria Standard Emission Fee (2025)",
    rate: 75,
    currency: "USD",
    unit: "per tonne CO₂e",
    minGRT: 5000,
    effectiveFrom: "01 Jan 2025",
    effectiveTo: "31 Dec 2025",
    status: "EXPIRED",
  },
];

export default function FeeSchedulesPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Fee Schedules</h1>
          <p className="text-gray-500 text-sm mt-1">
            Emission fee rate configurations per assessment period
          </p>
        </div>
        <Button variant="teal" size="sm">
          <FileBarChart className="h-4 w-4 mr-2" />
          New Fee Schedule
        </Button>
      </div>

      <div className="space-y-4">
        {feeSchedules.map((schedule) => (
          <Card key={schedule.id} className={`border-0 shadow-sm ${schedule.status === "ACTIVE" ? "ring-2 ring-teal/30" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-navy">{schedule.name}</CardTitle>
                    {schedule.status === "ACTIVE" && (
                      <Badge variant="success" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {schedule.status === "EXPIRED" && (
                      <Badge variant="outline" className="text-xs text-gray-400">Expired</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {schedule.effectiveFrom} — {schedule.effectiveTo}
                  </p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Fee Rate</p>
                  <p className="text-lg font-bold text-navy mt-1">
                    ${schedule.rate} <span className="text-sm font-normal text-gray-500">{schedule.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Currency</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{schedule.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Min Vessel Size</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{schedule.minGRT.toLocaleString()} GRT</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Applies To</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">All Nigerian Ports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
