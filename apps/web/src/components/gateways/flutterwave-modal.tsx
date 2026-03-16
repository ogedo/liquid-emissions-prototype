"use client";

import { useState } from "react";
import { X, Lock, CreditCard, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FlutterwaveModalProps {
  amount: number;
  vesselName: string;
  paymentRefId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type Stage = "form" | "processing" | "otp" | "success";
type CardType = "visa" | "mastercard" | "verve" | null;

function detectCardType(number: string): CardType {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (n.startsWith("650") || n.startsWith("506")) return "verve";
  return null;
}

function fmtCard(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function fmtExpiry(value: string) {
  const raw = value.replace(/\D/g, "").slice(0, 4);
  return raw.length > 2 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw;
}

function CardLogo({ type }: { type: CardType }) {
  if (type === "visa")
    return (
      <div className="bg-[#1A1F71] text-white text-[10px] font-black px-1.5 py-0.5 rounded italic tracking-tight">
        VISA
      </div>
    );
  if (type === "mastercard")
    return (
      <div className="flex items-center">
        <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
        <div className="w-5 h-5 rounded-full bg-[#F79E1B] -ml-2.5 opacity-90" />
      </div>
    );
  if (type === "verve")
    return (
      <div className="bg-[#003399] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-tight">
        VERVE
      </div>
    );
  return <CreditCard className="h-4 w-4 text-gray-300" />;
}

export function FlutterwaveModal({
  amount,
  vesselName,
  paymentRefId,
  onSuccess,
  onCancel,
}: FlutterwaveModalProps) {
  const [stage, setStage] = useState<Stage>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const cardType = detectCardType(cardNumber);

  const handlePay = async () => {
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      setError("Enter a valid 16-digit card number.");
      return;
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      setError("Enter a valid expiry (MM/YY).");
      return;
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      setError("Enter a valid CVV.");
      return;
    }
    if (!cardName.trim()) {
      setError("Enter the cardholder name.");
      return;
    }
    setError("");
    setStage("processing");
    await new Promise((r) => setTimeout(r, 2200));
    setStage("otp");
  };

  const handleOtp = async () => {
    if (!otp.match(/^\d{4,6}$/)) {
      setError("Enter the OTP sent to your phone.");
      return;
    }
    setError("");
    setStage("processing");
    await new Promise((r) => setTimeout(r, 1600));
    setStage("success");
    await new Promise((r) => setTimeout(r, 1200));
    onSuccess();
  };

  const last4 = cardNumber.replace(/\s/g, "").slice(-4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={stage === "form" ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden">

        {/* ── Header bar ── */}
        <div className="bg-[#F7A21D] px-5 py-4 flex items-center justify-between">
          {/* Flutterwave wordmark */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col justify-center gap-[3px] mr-0.5">
              <div className="h-[3px] w-5 bg-white rounded-full" />
              <div className="h-[3px] w-4 bg-white/75 rounded-full ml-0.5" />
              <div className="h-[3px] w-3 bg-white/50 rounded-full ml-1" />
            </div>
            <span className="text-white font-bold text-[15px] tracking-tight">flutterwave</span>
          </div>
          {stage === "form" && (
            <button onClick={onCancel} className="text-white/80 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ── Amount strip ── */}
        <div className="bg-[#FFFBF2] border-b border-amber-100 px-5 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Emission Fee Payment</p>
              <p className="text-sm font-semibold text-gray-700 truncate mt-0.5">{vesselName}</p>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{paymentRefId}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Total</p>
              <p className="text-xl font-bold text-[#F7A21D] mt-0.5">{formatCurrency(amount)}</p>
              <p className="text-[10px] text-gray-400">USD</p>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-5">

          {/* PROCESSING */}
          {stage === "processing" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-[#F7A21D] animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800">Processing Payment</p>
                <p className="text-sm text-gray-400 mt-1">Please wait — do not close this window</p>
              </div>
            </div>
          )}

          {/* OTP */}
          {stage === "otp" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="font-semibold text-gray-800 text-base">Verify Payment</p>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  A one-time password was sent to the mobile number linked to your card ending in{" "}
                  <strong>••{last4}</strong>
                </p>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs">{error}</p>
                </div>
              )}
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                className="h-12 text-center text-2xl font-mono tracking-[0.5em]"
                maxLength={6}
                autoFocus
              />
              {/* Demo hint */}
              <p className="text-xs text-center text-gray-400">
                Demo: enter any 6 digits (e.g. <span className="font-mono font-semibold">123456</span>)
              </p>
              <Button
                onClick={handleOtp}
                className="w-full h-11 bg-[#F7A21D] hover:bg-[#e5921a] text-white font-bold"
              >
                Confirm Payment
              </Button>
              <p className="text-xs text-center text-gray-400">
                Didn&apos;t receive it?{" "}
                <button className="text-[#F7A21D] font-semibold hover:underline">Resend OTP</button>
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {stage === "success" && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-9 w-9 text-green-600" />
              </div>
              <p className="font-bold text-gray-800 text-lg">Payment Successful!</p>
              <p className="text-sm text-gray-400">Redirecting to confirmation…</p>
            </div>
          )}

          {/* CARD FORM */}
          {stage === "form" && (
            <div className="space-y-4">
              {/* Test card hint */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Test Card (Demo)
                </p>
                <p className="text-xs font-mono text-amber-800 leading-relaxed">
                  5531 8866 5214 2950<br />
                  Expiry: 09/32 &nbsp;·&nbsp; CVV: 564
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <p className="text-xs">{error}</p>
                </div>
              )}

              {/* Card number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(fmtCard(e.target.value))}
                    className="h-11 font-mono tracking-widest pr-14 text-sm"
                    maxLength={19}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CardLogo type={cardType} />
                  </div>
                </div>
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                    className="h-11 font-mono text-sm text-center"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    CVV
                  </label>
                  <Input
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="h-11 font-mono text-sm text-center"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Cardholder name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Cardholder Name
                </label>
                <Input
                  type="text"
                  placeholder="Name as it appears on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="h-11 text-sm"
                />
              </div>

              <Button
                onClick={handlePay}
                className="w-full h-12 bg-[#F7A21D] hover:bg-[#e5921a] text-white font-bold text-base mt-1"
              >
                Pay {formatCurrency(amount)}
              </Button>

              <button
                onClick={onCancel}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Cancel and go back
              </button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-4 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3 text-gray-300" />
          <p className="text-[11px] text-gray-400">
            Secured by{" "}
            <span className="font-bold text-[#F7A21D]">Flutterwave</span>
          </p>
          <span className="text-gray-200 mx-1">·</span>
          <Shield className="h-3 w-3 text-gray-300" />
          <p className="text-[11px] text-gray-400">256-bit SSL</p>
        </div>
      </div>
    </div>
  );
}
