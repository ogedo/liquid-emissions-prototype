"use client";

import { useState } from "react";
import { X, Lock, CreditCard, Loader2, CheckCircle, AlertCircle, RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PaystackModalProps {
  amountNGN: number;
  amountUSD: number;
  vesselName: string;
  paymentRefId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type Tab = "card" | "transfer" | "ussd";
type Stage = "form" | "processing" | "otp" | "success";
type CardType = "visa" | "mastercard" | "verve" | null;

const USSD_CODES: Record<string, string> = {
  "Access Bank":     "*901*000*{amount}#",
  "GTBank":          "*737*58*{amount}*0000#",
  "First Bank":      "*894*{amount}*0000#",
  "Zenith Bank":     "*966*{amount}*0000#",
  "UBA":             "*919*3*{amount}*0000#",
  "Fidelity Bank":   "*770*{amount}*0000#",
  "Union Bank":      "*826*{amount}#",
  "Sterling Bank":   "*822*{amount}#",
};

function detectCardType(number: string): CardType {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (n.startsWith("650") || n.startsWith("506")) return "verve";
  return null;
}

function fmtCard(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
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

// ── Transfer tab ──────────────────────────────────────────────────────────────
function TransferTab({
  amountNGN,
  paymentRefId,
  onSuccess,
}: {
  amountNGN: number;
  paymentRefId: string;
  onSuccess: () => void;
}) {
  const [checking, setChecking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  };

  const checkTransfer = async () => {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 2500));
    setChecking(false);
    setConfirmed(true);
    await new Promise((r) => setTimeout(r, 1000));
    onSuccess();
  };

  const ACCOUNT_NUMBER = "0401847201";
  const BANK_NAME = "Access Bank";
  const ACCOUNT_NAME = "Liquid Emissions / Blue Wave";

  if (confirmed) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <p className="font-bold text-gray-800">Transfer Confirmed!</p>
        <p className="text-sm text-gray-400">Processing payment…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="bg-[#E6F9F8] border border-[#0BA4A0]/20 rounded-xl px-4 py-3 text-sm text-[#0BA4A0] font-medium">
        Transfer the exact amount below to this account. Payment is confirmed automatically.
      </div>

      {/* Account details */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-200 text-sm overflow-hidden">
        {[
          { label: "Bank",           value: BANK_NAME,       copyable: false },
          { label: "Account Number", value: ACCOUNT_NUMBER,  copyable: true  },
          { label: "Account Name",   value: ACCOUNT_NAME,    copyable: false },
          {
            label: "Amount",
            value: formatCurrency(amountNGN, "NGN"),
            copyable: true,
            highlight: true,
          },
          { label: "Reference",      value: paymentRefId,    copyable: true  },
        ].map(({ label, value, copyable, highlight }) => (
          <div key={label} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-gray-500 text-xs">{label}</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-semibold font-mono text-xs",
                  highlight ? "text-[#0BA4A0] text-sm" : "text-gray-800"
                )}
              >
                {value}
              </span>
              {copyable && (
                <button
                  onClick={() => copy(value, label)}
                  className="text-gray-400 hover:text-[#0BA4A0] transition-colors"
                >
                  {copied === label ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-gray-400">
        ⚠ This account expires in{" "}
        <span className="font-semibold text-amber-600">20:00 minutes</span>
      </p>

      <Button
        onClick={checkTransfer}
        disabled={checking}
        className="w-full h-11 bg-[#0BA4A0] hover:bg-[#099590] text-white font-bold"
      >
        {checking ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Verifying Transfer…
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            I&apos;ve Sent the Money
          </>
        )}
      </Button>
    </div>
  );
}

// ── USSD tab ─────────────────────────────────────────────────────────────────
function UssdTab({
  amountNGN,
  onSuccess,
}: {
  amountNGN: number;
  onSuccess: () => void;
}) {
  const [bank, setBank] = useState("");
  const [checking, setChecking] = useState(false);

  const rawAmount = Math.round(amountNGN).toString();
  const ussdCode = bank
    ? USSD_CODES[bank]?.replace("{amount}", rawAmount) ?? ""
    : "";

  const checkPayment = async () => {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 2500));
    setChecking(false);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#E6F9F8] border border-[#0BA4A0]/20 rounded-xl px-4 py-3 text-sm text-[#0BA4A0] font-medium">
        Dial the USSD code on any phone — no internet required.
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Select Your Bank
        </label>
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0BA4A0]/40 focus:border-[#0BA4A0]"
        >
          <option value="">-- Choose bank --</option>
          {Object.keys(USSD_CODES).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {bank && ussdCode && (
        <div className="bg-gray-900 rounded-xl px-5 py-4 text-center">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">Dial this code</p>
          <p className="text-white font-mono text-2xl font-bold tracking-wide">{ussdCode}</p>
          <p className="text-gray-500 text-xs mt-2">
            Follow the prompts and confirm {formatCurrency(amountNGN, "NGN")}
          </p>
        </div>
      )}

      {bank && (
        <Button
          onClick={checkPayment}
          disabled={checking}
          className="w-full h-11 bg-[#0BA4A0] hover:bg-[#099590] text-white font-bold"
        >
          {checking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking Payment…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              I&apos;ve Completed the Dial
            </>
          )}
        </Button>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function PaystackModal({
  amountNGN,
  amountUSD,
  vesselName,
  paymentRefId,
  onSuccess,
  onCancel,
}: PaystackModalProps) {
  const [tab, setTab] = useState<Tab>("card");
  const [stage, setStage] = useState<Stage>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const cardType = detectCardType(cardNumber);
  const last4 = cardNumber.replace(/\s/g, "").slice(-4);

  const handleCardPay = async () => {
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
    await new Promise((r) => setTimeout(r, 2000));
    setStage("otp");
  };

  const handleOtp = async () => {
    if (!otp.match(/^\d{4,6}$/)) {
      setError("Enter the OTP sent to your phone.");
      return;
    }
    setError("");
    setStage("processing");
    await new Promise((r) => setTimeout(r, 1500));
    setStage("success");
    await new Promise((r) => setTimeout(r, 1000));
    onSuccess();
  };

  const tabClass = (t: Tab) =>
    cn(
      "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2",
      tab === t
        ? "text-[#0BA4A0] border-[#0BA4A0]"
        : "text-gray-400 border-transparent hover:text-gray-600"
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={stage === "form" ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-[#0BA4A0] px-5 py-4 flex items-center justify-between">
          {/* Paystack wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm bg-white" />
            </div>
            <span className="text-white font-bold text-[15px] tracking-tight">Paystack</span>
          </div>
          {stage === "form" && (
            <button onClick={onCancel} className="text-white/80 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ── Amount / customer strip ── */}
        <div className="bg-[#F0FAFA] border-b border-[#0BA4A0]/15 px-5 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Emission Fee</p>
              <p className="text-sm font-semibold text-gray-700 truncate mt-0.5">{vesselName}</p>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{paymentRefId}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Total</p>
              <p className="text-xl font-bold text-[#0BA4A0] mt-0.5">
                {formatCurrency(amountNGN, "NGN")}
              </p>
              <p className="text-[10px] text-gray-400">≈ {formatCurrency(amountUSD)}</p>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        {stage === "form" && (
          <div className="flex border-b border-gray-100 bg-white px-5">
            <button onClick={() => setTab("card")} className={tabClass("card")}>Card</button>
            <button onClick={() => setTab("transfer")} className={tabClass("transfer")}>Transfer</button>
            <button onClick={() => setTab("ussd")} className={tabClass("ussd")}>USSD</button>
          </div>
        )}

        {/* ── Body ── */}
        <div className="px-5 py-5">

          {/* PROCESSING */}
          {stage === "processing" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#0BA4A0] animate-spin" />
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
                <p className="font-semibold text-gray-800 text-base">Enter OTP</p>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  We sent a one-time password to the number linked to your card ending{" "}
                  <strong>••{last4}</strong>
                </p>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
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
              <p className="text-xs text-center text-gray-400">
                Demo: enter any 6 digits (e.g.{" "}
                <span className="font-mono font-semibold">123456</span>)
              </p>
              <Button
                onClick={handleOtp}
                className="w-full h-11 bg-[#0BA4A0] hover:bg-[#099590] text-white font-bold"
              >
                Confirm Payment
              </Button>
              <p className="text-xs text-center text-gray-400">
                Didn&apos;t receive it?{" "}
                <button className="text-[#0BA4A0] font-semibold hover:underline">Resend OTP</button>
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

          {/* CARD TAB */}
          {stage === "form" && tab === "card" && (
            <div className="space-y-4">
              {/* Test card hint */}
              <div className="bg-teal-50 border border-[#0BA4A0]/20 rounded-xl px-3.5 py-2.5">
                <p className="text-[11px] font-bold text-[#0BA4A0] uppercase tracking-wider mb-1">
                  Test Card (Demo)
                </p>
                <p className="text-xs font-mono text-teal-800 leading-relaxed">
                  4084 0840 8408 4081<br />
                  Expiry: 12/30 &nbsp;·&nbsp; CVV: 408 &nbsp;·&nbsp; PIN: 0000
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
                    Expiry
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
                onClick={handleCardPay}
                className="w-full h-12 bg-[#0BA4A0] hover:bg-[#099590] text-white font-bold text-base mt-1"
              >
                Pay {formatCurrency(amountNGN, "NGN")}
              </Button>

              <button
                onClick={onCancel}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Cancel and go back
              </button>
            </div>
          )}

          {/* TRANSFER TAB */}
          {stage === "form" && tab === "transfer" && (
            <TransferTab
              amountNGN={amountNGN}
              paymentRefId={paymentRefId}
              onSuccess={onSuccess}
            />
          )}

          {/* USSD TAB */}
          {stage === "form" && tab === "ussd" && (
            <UssdTab amountNGN={amountNGN} onSuccess={onSuccess} />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-4 flex items-center justify-center gap-1.5">
          <Lock className="h-3 w-3 text-gray-300" />
          <p className="text-[11px] text-gray-400">
            Secured by{" "}
            <span className="font-bold text-[#0BA4A0]">Paystack</span>
          </p>
          <span className="text-gray-200 mx-1">·</span>
          <p className="text-[11px] text-gray-400">256-bit SSL encryption</p>
        </div>
      </div>
    </div>
  );
}
