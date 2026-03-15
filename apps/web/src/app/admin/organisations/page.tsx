"use client";

import { useState } from "react";
import { Search, Eye, Ban, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { organisations } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function OrganisationsPage() {
  const [search, setSearch] = useState("");

  const filtered = organisations.filter(
    (o) =>
      !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.rcNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.primaryContact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Organisations</h1>
          <p className="text-gray-500 text-sm mt-1">
            Registered operator organisations · {organisations.length} total
          </p>
        </div>
        <Button variant="teal" size="sm">
          <Building2 className="h-4 w-4 mr-2" />
          Add Organisation
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="pt-4 pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, RC number or contact…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  {["Org Name", "RC Number", "Primary Contact", "Vessels", "Status", "Joined", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((org, idx) => (
                  <tr
                    key={org.id}
                    className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-navy/60" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{org.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-gray-600">{org.rcNumber}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{org.primaryContact}</p>
                        <p className="text-xs text-gray-400">{org.contactEmail}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-center block">{org.vessels}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={org.status === "ACTIVE" ? "success" : "error"}>
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">{formatDate(org.joined)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-teal hover:text-teal-700"
                          onClick={() => alert(`View organisation: ${org.name}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 px-2 ${org.status === "ACTIVE" ? "text-red-500 hover:text-red-700" : "text-green-600 hover:text-green-700"}`}
                          onClick={() => alert(`${org.status === "ACTIVE" ? "Suspend" : "Reinstate"}: ${org.name}`)}
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          {org.status === "ACTIVE" ? "Suspend" : "Reinstate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No organisations match your search.
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
