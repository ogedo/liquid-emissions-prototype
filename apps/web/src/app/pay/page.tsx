"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  Ship,
  CheckCircle,
  Loader2,
  Download,
  ArrowLeft,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAssessment } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

const stepLabels = [
  "Enter Reference",
  "Review Assessment",
  "Select Payment",
  "Confirmation",
];

function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {stepLabels.map((label, idx) => {
        const stepNum = (idx + 1) as Step;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                  isCompleted
                    ? "bg-teal border-teal text-white"
                    : isActive
                    ? "bg-navy border-navy text-white"
                    : "bg-white border-gray-200 text-gray-400"
                )}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 font-medium whitespace-nowrap",
                  isActive ? "text-navy" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </div>
            {idx < stepLabels.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-2 mb-4 transition-all",
                  stepNum < currentStep ? "bg-teal" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PayPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [refInput, setRefInput] = useState("NIMASA-2026-00847");
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN" | null>(null);
  const [paying, setPaying] = useState(false);

  const assessment = mockAssessment;

  const handleLookup = async () => {
    if (!refInput.trim()) {
      setLookupError("Please enter a Payment Reference ID.");
      return;
    }
    setLookupError("");
    setLookingUp(true);
    try {
      const res = await fetch(`/api/assessment/${encodeURIComponent(refInput.trim())}`);
      if (res.status === 404) {
        setLookupError("No assessment found for this reference ID. Verify the reference with your issuing Port Authority or NIMASA.");
        setLookingUp(false);
        return;
      }
      const data = await res.json();
      if (data.assessmentStatus === "PAID") {
        setLookupError("This assessment has already been paid. Contact NIMASA if you believe this is an error.");
        setLookingUp(false);
        return;
      }
      if (data.assessmentStatus === "CANCELLED" || data.assessmentStatus === "DISPUTED") {
        setLookupError(`This assessment has status: ${data.assessmentStatus}. Please contact NIMASA to resolve.`);
        setLookingUp(false);
        return;
      }
    } catch {
      setLookupError("Unable to reach the assessment authority. Please try again.");
      setLookingUp(false);
      return;
    }
    setLookingUp(false);
    setStep(2);
  };

  const handleProceedToPayment = () => {
    setStep(3);
  };

  const handlePay = async (currency: "USD" | "NGN") => {
    setSelectedCurrency(currency);
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaying(false);
    setStep(4);
  };

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Pay Emission Fee</h1>
        <p className="text-gray-500 text-sm mt-1">
          Submit payment for a vessel emission assessment
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="max-w-2xl mx-auto">
        {/* Step 1 — Enter Reference */}
        {step === 1 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-navy flex items-center gap-2">
                <Search className="h-5 w-5 text-teal" />
                Enter Payment Reference ID
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>What is a Payment Reference ID?</strong>
                  <br />
                  This reference was issued to you by NIMASA or the Port Authority upon completion
                  of your vessel&apos;s emission assessment. It is unique to your voyage.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Payment Reference ID
                </label>
                <Input
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="e.g. NIMASA-2026-00441"
                  className="text-lg h-14 font-mono tracking-wide"
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
                {lookupError && (
                  <p className="text-sm text-red-600">{lookupError}</p>
                )}
              </div>

              <Button
                onClick={handleLookup}
                variant="navy"
                size="xl"
                className="w-full"
                disabled={lookingUp}
              >
                {lookingUp ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Looking up assessment…
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Look Up Assessment
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                If you cannot locate your reference ID, contact the issuing Port Authority or NIMASA directly.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Review Assessment */}
        {step === 2 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-navy flex items-center gap-2">
                <Ship className="h-5 w-5 text-teal" />
                Review Emission Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-column layout: Vessel Info + Fee Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vessel Information */}
                <div className="bg-slate-50 rounded-xl border p-5 space-y-3">
                  <p className="text-xs font-bold text-navy uppercase tracking-wider mb-3">Vessel Information</p>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Vessel Name</p>
                    <p className="font-bold text-navy mt-0.5 text-base">{assessment.vesselName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">IMO Number</p>
                    <p className="font-semibold text-gray-900 mt-0.5 font-mono">{assessment.imoNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">GRT</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{assessment.grt.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Port of Call</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{assessment.portOfCall}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Voyage</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{assessment.voyageArrival} → {assessment.voyageDeparture}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">CO₂e Emissions</p>
                    <p className="font-semibold text-gray-900 mt-0.5">{assessment.co2Emissions.toLocaleString()} tonnes</p>
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div className="bg-navy rounded-xl p-5 text-white space-y-3">
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Fee Breakdown</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Base Emission Fee</span>
                    <span className="font-semibold">{formatCurrency(assessment.baseEmissionFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Platform Charge (1.2%)</span>
                    <span className="font-semibold">{formatCurrency(assessment.platformServiceCharge)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between">
                    <span className="font-bold text-white">Total Due</span>
                    <span className="font-bold text-2xl text-teal">{formatCurrency(assessment.totalDue)}</span>
                  </div>
                  <p className="text-xs text-white/40 pt-1">{assessment.feeNote}</p>
                  <div className="mt-2 bg-white/5 rounded-lg p-2.5">
                    <p className="text-xs text-white/50">REF: <span className="text-white/80 font-mono">{assessment.paymentRefId}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="teal"
                  size="lg"
                  onClick={handleProceedToPayment}
                  className="flex-2 flex-1"
                >
                  Confirm & Proceed to Payment
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Select Currency & Method */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-navy flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-teal" />
                  Select Currency &amp; Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 border rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vessel:</span>
                    <span className="font-medium">{assessment.vesselName}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-500">Reference:</span>
                    <span className="font-mono text-xs">{assessment.paymentRefId}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Rate locked at <strong>₦{assessment.exchangeRate.toLocaleString()}/USD</strong> as of {assessment.rateLockTime}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* USD Card */}
                  <div className="border-2 border-navy rounded-xl p-5 hover:border-teal transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <p className="font-bold text-navy">USD Payment</p>
                    </div>
                    <p className="text-2xl font-bold text-navy mb-1">
                      {formatCurrency(assessment.totalDue)}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">via Flutterwave (USD)</p>
                    <Button
                      variant="navy"
                      className="w-full"
                      onClick={() => handlePay("USD")}
                      disabled={paying}
                    >
                      {paying && selectedCurrency === "USD" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        "Pay in USD"
                      )}
                    </Button>
                  </div>

                  {/* NGN Card */}
                  <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-teal transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">₦</span>
                      </div>
                      <p className="font-bold text-gray-900">NGN Payment</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {formatCurrency(assessment.totalDueNGN, "NGN")}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">via Paystack (Naira)</p>
                    <Button
                      variant="teal"
                      className="w-full"
                      onClick={() => handlePay("NGN")}
                      disabled={paying}
                    >
                      {paying && selectedCurrency === "NGN" ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        "Pay in Naira"
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-navy">Payment Successful</h2>
                <p className="text-gray-500 mt-2">
                  Your emission fee has been received and recorded.
                </p>
              </div>

              <div className="bg-slate-50 border rounded-xl divide-y">
                <div className="flex justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">Transaction Reference</span>
                  <span className="text-sm font-mono font-bold text-navy">TXN-2026-001847</span>
                </div>
                <div className="flex justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">Amount Paid</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedCurrency === "NGN"
                      ? formatCurrency(assessment.totalDueNGN, "NGN")
                      : `${formatCurrency(assessment.totalDue)} USD`}
                  </span>
                </div>
                <div className="flex justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">Payment Ref ID</span>
                  <span className="text-sm font-mono text-gray-700">{assessment.paymentRefId}</span>
                </div>
                <div className="flex justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">Vessel</span>
                  <span className="text-sm font-medium text-gray-900">{assessment.vesselName}</span>
                </div>
                <div className="flex justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm text-gray-700">10 Mar 2026</span>
                </div>
                <div className="flex justify-between px-5 py-3">
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <span className="text-sm text-gray-700">
                    {selectedCurrency === "NGN" ? "Paystack (NGN)" : "Flutterwave (USD)"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => alert("Receipt PDF download (prototype — no real file)")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt PDF
                </Button>
                <Button
                  variant="navy"
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
