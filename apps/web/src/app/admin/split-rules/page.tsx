"use client";

import { useState } from "react";
import { SplitSquareHorizontal, Edit, Save, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { splitRules, type SplitRule } from "@/lib/mock-data";

export default function SplitRulesPage() {
  const [open, setOpen] = useState(false);
  const [editValues, setEditValues] = useState<SplitRule[]>(splitRules.map((r) => ({ ...r })));
  const [saved, setSaved] = useState(false);

  const total = editValues.reduce((sum, r) => sum + r.basisPoints, 0);
  const isValid = total === 10000;

  const handleBPChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setEditValues((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, basisPoints: num, percentage: num / 100 }
          : r
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    if (!isValid) return;
    setSaved(true);
    setOpen(false);
  };

  const displayRules = saved ? editValues : splitRules;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Split Rules</h1>
          <p className="text-gray-500 text-sm mt-1">
            Revenue distribution configuration · Basis points must total 10,000
          </p>
        </div>
        <Button variant="teal" onClick={() => setOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Split Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current split rule */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-navy flex items-center gap-2">
              <SplitSquareHorizontal className="h-4 w-4 text-teal" />
              Active Split Rule
            </CardTitle>
            <p className="text-xs text-green-600 font-medium mt-1">
              ✓ Active · Effective 01 Jan 2026
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Beneficiary</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Basis Points</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {displayRules.map((rule) => (
                  <tr key={rule.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal" />
                        <span className="text-sm font-medium text-gray-900">{rule.beneficiary}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-mono font-semibold text-gray-700">
                        {rule.basisPoints.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-teal">
                        {rule.percentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-navy/5">
                  <td className="px-5 py-3 font-bold text-navy text-sm">Total</td>
                  <td className="px-5 py-3 text-right font-bold text-navy text-sm font-mono">10,000</td>
                  <td className="px-5 py-3 text-right font-bold text-navy text-sm">100.00%</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Visual breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-navy">Visual Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stacked bar */}
            <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
              {[
                { rule: displayRules[0], color: "bg-navy" },
                { rule: displayRules[1], color: "bg-teal" },
                { rule: displayRules[2], color: "bg-blue-400" },
                { rule: displayRules[3], color: "bg-blue-200" },
              ].map(({ rule, color }) => (
                <div
                  key={rule.id}
                  className={`${color} flex items-center justify-center`}
                  style={{ width: `${rule.percentage}%` }}
                  title={`${rule.beneficiary}: ${rule.percentage}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-3 mt-4">
              {[
                { rule: displayRules[0], color: "bg-navy", textColor: "text-navy" },
                { rule: displayRules[1], color: "bg-teal", textColor: "text-teal" },
                { rule: displayRules[2], color: "bg-blue-400", textColor: "text-blue-600" },
                { rule: displayRules[3], color: "bg-blue-200", textColor: "text-blue-400" },
              ].map(({ rule, color, textColor }) => (
                <div key={rule.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${color}`} />
                    <span className="text-sm text-gray-700">{rule.beneficiary}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">{rule.basisPoints} bp</span>
                    <span className={`text-sm font-bold ${textColor}`}>{rule.percentage.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t text-xs text-gray-400 space-y-1">
              <p className="font-medium text-gray-500">Example: $126,226 payment</p>
              {displayRules.map(rule => (
                <div key={rule.id} className="flex justify-between">
                  <span>{rule.beneficiary}</span>
                  <span className="font-mono">${(126226 * rule.basisPoints / 10000).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Methods */}
      <Card className="border-0 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-base text-navy">Payout Methods per Beneficiary</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            NGN beneficiaries receive payouts via Paystack Transfer to registered Nigerian bank accounts.
            USD beneficiaries receive payouts via Grey.co Business API to USD virtual accounts.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Beneficiary</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Payout Currency</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Payout Provider</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wider">Account Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "NIMASA",               currency: "NGN", provider: "Paystack Transfer",  account: "Nigerian Bank Account (CBN)", dot: "bg-teal" },
                { name: "Lagos Port Authority", currency: "NGN", provider: "Paystack Transfer",  account: "Nigerian Bank Account (CBN)", dot: "bg-navy-light" },
                { name: "Blue Wave Maritime",   currency: "USD", provider: "Grey.co Business API", account: "USD Virtual Account",        dot: "bg-blue-400" },
                { name: "Liquid Payments",      currency: "USD", provider: "Grey.co Business API", account: "USD Virtual Account",        dot: "bg-blue-200" },
              ].map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${row.dot}`} />
                      <span className="text-sm font-medium text-gray-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.currency === "NGN" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {row.currency}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{row.provider}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{row.account}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Split Rule</DialogTitle>
            <DialogDescription>
              Adjust basis points for each beneficiary. Total must equal exactly 10,000.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4">
            {editValues.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{rule.beneficiary}</p>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    min="0"
                    max="10000"
                    value={rule.basisPoints}
                    onChange={(e) => handleBPChange(rule.id, e.target.value)}
                    className="text-right font-mono"
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm text-teal font-semibold">
                    {(rule.basisPoints / 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-semibold text-sm">Total</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold font-mono text-sm ${isValid ? "text-green-600" : "text-red-600"}`}>
                  {total.toLocaleString()} / 10,000
                </span>
                {!isValid && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            {!isValid && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                Basis points must total exactly 10,000. Current total: {total.toLocaleString()}.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="teal" onClick={handleSave} disabled={!isValid}>
              <Save className="h-4 w-4 mr-2" />
              Save Split Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
