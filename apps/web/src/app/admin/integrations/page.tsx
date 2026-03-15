"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Integration {
  id: string;
  name: string;
  category: string;
  purpose: string;
  endpoint: string;       // mock API route to ping
  status: "connected" | "degraded" | "disconnected" | "testing";
  env: string;            // env var name
  docsUrl: string;
  note: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "nimasa-api",
    name: "NIMASA Emission Authority API",
    category: "Emission Data",
    purpose: "Retrieve emission assessments by Payment Reference ID",
    endpoint: "/api/assessment/NIMASA-2026-00847",
    status: "connected",
    env: "EMISSION_AUTHORITY_API_KEY",
    docsUrl: "#",
    note: "Returns vessel assessment data and pre-calculated fee amounts",
  },
  {
    id: "fx-rate",
    name: "ExchangeRate-API (FX Rates)",
    category: "Foreign Exchange",
    purpose: "Live USD/NGN spot rate for NGN payment option",
    endpoint: "/api/fx-rate",
    status: "connected",
    env: "EXCHANGE_RATE_API_KEY",
    docsUrl: "#",
    note: "1.5% spread applied on top of spot rate. Rate locked per PaymentOrder.",
  },
  {
    id: "paystack",
    name: "Paystack",
    category: "Payment Gateway",
    purpose: "NGN card & bank transfer collection + NGN payout to Nigerian banks",
    endpoint: "/api/payout/paystack",
    status: "connected",
    env: "PAYSTACK_SECRET_KEY",
    docsUrl: "https://paystack.com/docs",
    note: "Primary NGN collection gateway. Also handles payout to NIMASA & Port Authority.",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    category: "Payment Gateway",
    purpose: "USD card collection + NGN fallback gateway",
    endpoint: "#",
    status: "connected",
    env: "FLUTTERWAVE_SECRET_KEY",
    docsUrl: "https://developer.flutterwave.com",
    note: "Primary USD collection. Fallback NGN gateway if Paystack unavailable.",
  },
  {
    id: "grey",
    name: "Grey.co Business API",
    category: "USD Payout",
    purpose: "USD disbursement to Blue Wave Maritime and Liquid Payments virtual accounts",
    endpoint: "/api/payout/grey",
    status: "connected",
    env: "GREY_API_KEY",
    docsUrl: "https://docs.grey.co",
    note: "Nigerian-first multi-currency payout. ~0.5% fee, 1–2 business day settlement.",
  },
  {
    id: "resend",
    name: "Resend",
    category: "Email",
    purpose: "Transactional email: receipts, alerts, password reset, welcome",
    endpoint: "/api/notify/email",
    status: "connected",
    env: "RESEND_API_KEY",
    docsUrl: "https://resend.com/docs",
    note: "From: noreply@liquidemissions.ng — domain verified. 7 email templates.",
  },
  {
    id: "termii",
    name: "Termii",
    category: "SMS",
    purpose: "Optional SMS payment confirmation to vessel operators",
    endpoint: "/api/notify/sms",
    status: "connected",
    env: "TERMII_API_KEY",
    docsUrl: "https://developers.termii.com",
    note: "Sender ID: LQDEMIT. Enabled per-organisation. 3 SMS templates.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Emission Data":    "bg-purple-100 text-purple-800",
  "Foreign Exchange": "bg-amber-100 text-amber-800",
  "Payment Gateway":  "bg-blue-100 text-blue-800",
  "USD Payout":       "bg-teal-100 text-teal-800",
  "Email":            "bg-green-100 text-green-800",
  "SMS":              "bg-orange-100 text-orange-800",
};

type TestResult = {
  status: "success" | "error";
  latencyMs: number;
  response?: string;
};

export default function IntegrationsPage() {
  const [testing, setTesting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});

  const testIntegration = async (integration: Integration) => {
    if (integration.endpoint === "#") return;
    setTesting(integration.id);
    const start = Date.now();
    try {
      const method = integration.id === "resend" ? "POST"
                   : integration.id === "termii" ? "POST"
                   : integration.id === "grey-payout" ? "POST"
                   : "GET";

      let res: Response;
      if (method === "POST") {
        // Send a minimal test payload
        const testBody =
          integration.id === "resend"
            ? { to: "test@example.com", template: "admin_alert", data: { alertType: "TEST", message: "Connection test", severity: "low", dashboardUrl: "#" } }
            : { to: "+2348000000000", template: "payment_receipt", data: { transactionRef: "TEST-001", amount: "$100", vesselName: "TEST VESSEL" } };
        res = await fetch(integration.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testBody),
        });
      } else {
        res = await fetch(integration.endpoint);
      }
      const latencyMs = Date.now() - start;
      const data = await res.json();
      setResults(prev => ({
        ...prev,
        [integration.id]: {
          status: res.ok ? "success" : "error",
          latencyMs,
          response: JSON.stringify(data).slice(0, 120) + "…",
        },
      }));
    } catch {
      setResults(prev => ({
        ...prev,
        [integration.id]: { status: "error", latencyMs: Date.now() - start, response: "Network error" },
      }));
    } finally {
      setTesting(null);
    }
  };

  const testAll = async () => {
    for (const i of INTEGRATIONS) {
      await testIntegration(i);
      await new Promise(r => setTimeout(r, 100));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Integrations</h1>
          <p className="text-gray-500 text-sm mt-1">
            External vendor connections — all mocked for prototype. Click &quot;Test&quot; to ping each mock API.
          </p>
        </div>
        <Button variant="teal" onClick={testAll} disabled={testing !== null}>
          {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Test All Connections
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Connected", count: INTEGRATIONS.length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
          { label: "Degraded",  count: 0,                   color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
          { label: "Down",      count: 0,                   color: "text-red-600",    bg: "bg-red-50 border-red-200" },
        ].map(s => (
          <Card key={s.label} className={`border ${s.bg} shadow-none`}>
            <CardContent className="pt-4 pb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration cards */}
      <div className="space-y-4">
        {INTEGRATIONS.map(integration => {
          const result = results[integration.id];
          const isTesting = testing === integration.id;
          return (
            <Card key={integration.id} className="border-0 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">{integration.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[integration.category] ?? "bg-gray-100 text-gray-700"}`}>
                        {integration.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">{integration.purpose}</p>
                    <p className="text-xs text-gray-400 ml-7 mt-1">{integration.note}</p>

                    {/* Env var + endpoint */}
                    <div className="ml-7 mt-2 flex gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">Env var:</span>
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-gray-700">
                          {integration.env}
                        </code>
                      </div>
                      {integration.endpoint !== "#" && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">Mock route:</span>
                          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-teal">
                            {integration.endpoint}
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Test result */}
                    {result && (
                      <div className={`ml-7 mt-2 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg w-fit
                        ${result.status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {result.status === "success"
                          ? <CheckCircle className="h-3 w-3" />
                          : <AlertCircle className="h-3 w-3" />}
                        <span>{result.latencyMs}ms — {result.response}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">
                      Connected
                    </Badge>
                    {integration.endpoint !== "#" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testIntegration(integration)}
                        disabled={isTesting || testing !== null}
                        className="text-xs"
                      >
                        {isTesting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Test"}
                      </Button>
                    )}
                    {integration.docsUrl !== "#" && (
                      <a href={integration.docsUrl} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm" className="text-xs text-gray-400 px-2">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
