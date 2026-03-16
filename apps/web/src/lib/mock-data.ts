// ============================================================
// MOCK DATA — Liquid Emissions Revenue Collection Prototype
// ============================================================

export type PaymentStatus = "COMPLETED" | "PROCESSING" | "FAILED" | "PENDING";
export type OrgStatus = "ACTIVE" | "SUSPENDED";
export type SettlementStatus = "SETTLED" | "PENDING" | "PROCESSING";

// ── Operator Payments ──────────────────────────────────────

export interface Payment {
  id: string;
  date: string;
  paymentRefId: string;
  vesselName: string;
  imoNumber: string;
  portOfCall: string;
  baseFee: number;
  charges: number;
  total: number;
  ngnEquiv: number;
  currency: "USD" | "NGN";
  status: PaymentStatus;
  transactionRef: string;
}

export const operatorPayments: Payment[] = [
  {
    id: "p1",
    date: "2026-03-10",
    paymentRefId: "NIMASA-2026-00441",
    vesselName: "MV Atlantic Spirit",
    imoNumber: "9876543",
    portOfCall: "Apapa, Lagos (NGAPP)",
    baseFee: 86400,
    charges: 1036.80,
    total: 87436.80,
    ngnEquiv: 145296000,
    currency: "USD",
    status: "COMPLETED",
    transactionRef: "LQD-2026-038441",
  },
  {
    id: "p2",
    date: "2026-03-07",
    paymentRefId: "NIMASA-2026-00437",
    vesselName: "MT Oduduwa Voyager",
    imoNumber: "9234781",
    portOfCall: "Tin Can Island (NGTIN)",
    baseFee: 124730,
    charges: 1496.76,
    total: 126226.76,
    ngnEquiv: 209734000,
    currency: "USD",
    status: "COMPLETED",
    transactionRef: "LQD-2026-038037",
  },
  {
    id: "p3",
    date: "2026-03-05",
    paymentRefId: "NIMASA-2026-00431",
    vesselName: "MV Bonny River",
    imoNumber: "9445892",
    portOfCall: "Onne Port (NGONE)",
    baseFee: 67380,
    charges: 808.56,
    total: 68188.56,
    ngnEquiv: 113310000,
    currency: "NGN",
    status: "COMPLETED",
    transactionRef: "LQD-2026-037831",
  },
  {
    id: "p4",
    date: "2026-03-03",
    paymentRefId: "NIMASA-2026-00428",
    vesselName: "MT Gulf Harmony",
    imoNumber: "9112034",
    portOfCall: "Warri Port (NGWAR)",
    baseFee: 218370,
    charges: 2620.44,
    total: 220990.44,
    ngnEquiv: 367220000,
    currency: "USD",
    status: "PROCESSING",
    transactionRef: "LQD-2026-037528",
  },
  {
    id: "p5",
    date: "2026-02-28",
    paymentRefId: "NIMASA-2026-00419",
    vesselName: "MV Meridian Star",
    imoNumber: "9667120",
    portOfCall: "Calabar Port (NGCBQ)",
    baseFee: 95200,
    charges: 1142.40,
    total: 96342.40,
    ngnEquiv: 160090000,
    currency: "USD",
    status: "COMPLETED",
    transactionRef: "LQD-2026-037119",
  },
  {
    id: "p6",
    date: "2026-02-25",
    paymentRefId: "NIMASA-2026-00412",
    vesselName: "MT Horizon Carrier",
    imoNumber: "9389045",
    portOfCall: "Apapa, Lagos (NGAPP)",
    baseFee: 183640,
    charges: 2203.68,
    total: 185843.68,
    ngnEquiv: 308820000,
    currency: "NGN",
    status: "FAILED",
    transactionRef: "LQD-2026-036812",
  },
  {
    id: "p7",
    date: "2026-02-20",
    paymentRefId: "NIMASA-2026-00405",
    vesselName: "MV Emerald Bay",
    imoNumber: "9501234",
    portOfCall: "Tin Can Island (NGTIN)",
    baseFee: 38150,
    charges: 457.80,
    total: 38607.80,
    ngnEquiv: 64155000,
    currency: "USD",
    status: "COMPLETED",
    transactionRef: "LQD-2026-036405",
  },
  {
    id: "p8",
    date: "2026-02-15",
    paymentRefId: "NIMASA-2026-00398",
    vesselName: "MT Apex Pioneer",
    imoNumber: "9723890",
    portOfCall: "Onne Port (NGONE)",
    baseFee: 271900,
    charges: 3262.80,
    total: 275162.80,
    ngnEquiv: 457240000,
    currency: "USD",
    status: "COMPLETED",
    transactionRef: "LQD-2026-035998",
  },
  {
    id: "p9",
    date: "2026-02-10",
    paymentRefId: "NIMASA-2026-00389",
    vesselName: "MV Lagos Express",
    imoNumber: "9234567",
    portOfCall: "Apapa, Lagos (NGAPP)",
    baseFee: 74600,
    charges: 895.20,
    total: 75495.20,
    ngnEquiv: 125450000,
    currency: "NGN",
    status: "COMPLETED",
    transactionRef: "LQD-2026-035689",
  },
  {
    id: "p10",
    date: "2026-02-05",
    paymentRefId: "NIMASA-2026-00381",
    vesselName: "MT Coastal Queen",
    imoNumber: "9812345",
    portOfCall: "Warri Port (NGWAR)",
    baseFee: 158200,
    charges: 1898.40,
    total: 160098.40,
    ngnEquiv: 266040000,
    currency: "USD",
    status: "FAILED",
    transactionRef: "LQD-2026-035381",
  },
];

// ── Dashboard Stats ────────────────────────────────────────

export const dashboardStats = {
  totalPaymentsThisMonth: 308427,
  paymentsMade: 14,
  pendingAssessments: 2,
  lastPayment: "3 days ago",
};

// ── Assessment (mock lookup result) ───────────────────────
// Service charge: 1.2% of base fee
// Base: $124,730.00 → 1.2% = $1,496.76 → Total: $126,226.76
// NGN at effective rate ₦1,661.72/USD (spot ₦1,637.20 + 1.5% spread):
//   $126,226.76 × 1,661.72 = ₦209,733,612

export const mockAssessment = {
  paymentRefId: "NIMASA-2026-00847",
  vesselName: "MV ATLANTIC PIONEER",
  imoNumber: "IMO9234567",
  grt: 42500,
  portOfCall: "Lagos (NGLOS)",
  voyageArrival: "14 Feb 2026",
  voyageDeparture: "21 Feb 2026",
  co2Emissions: 1247.3,
  fuelConsumedMT: 420.1,
  baseEmissionFee: 124730.0,
  serviceChargeRate: 0.012,            // 1.2%
  platformServiceCharge: 1496.76,      // 124730 × 1.2%
  totalDue: 126226.76,
  spotRate: 1637.20,
  spreadPercent: 1.5,
  exchangeRate: 1661.72,               // effective rate with 1.5% spread
  totalDueNGN: 209733612,              // 126226.76 × 1661.72 (in kobo: ×100)
  rateLockTime: "14 Mar 2026 09:14 WAT",
  rateExpiresAt: "14 Mar 2026 09:44 WAT",
  feeNote: "Fee assessed by NIMASA under MARPOL Annex VI. Platform charge: 1.2% of base fee.",
  dataSource: "NIMASA Port State Control Unit",
};

// ── Admin Stats ────────────────────────────────────────────

export const adminStats = {
  totalRevenueYTD: 187420000,
  thisMonth: 38240000,
  pendingSettlement: 495000,
  organisations: 287,
  paymentsToday: 8,
};

// ── Admin Activity Feed ────────────────────────────────────

export interface ActivityItem {
  id: string;
  event: string;
  description: string;
  timestamp: string;
  amount?: number;
}

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    event: "PaymentCompleted",
    description: "MV Atlantic Spirit — NIMASA-2026-00441",
    timestamp: "2026-03-10 14:35 WAT",
    amount: 87437,
  },
  {
    id: "a2",
    event: "WalletCredited",
    description: "NIMASA wallet credited — Settlement Batch B-2026-031",
    timestamp: "2026-03-10 14:36 WAT",
    amount: 72500,
  },
  {
    id: "a3",
    event: "EscrowReleased",
    description: "Escrow released for batch B-2026-031",
    timestamp: "2026-03-10 14:36 WAT",
    amount: 290000,
  },
  {
    id: "a4",
    event: "SettlementDispatched",
    description: "Batch B-2026-031 dispatched to 4 beneficiaries",
    timestamp: "2026-03-10 14:37 WAT",
  },
  {
    id: "a5",
    event: "PaymentCompleted",
    description: "MT Oduduwa Voyager — NIMASA-2026-00437",
    timestamp: "2026-03-07 09:12 WAT",
    amount: 126227,
  },
];

// ── Organisations ──────────────────────────────────────────

export interface Organisation {
  id: string;
  name: string;
  rcNumber: string;
  primaryContact: string;
  contactEmail: string;
  vessels: number;
  status: OrgStatus;
  joined: string;
}

export const organisations: Organisation[] = [
  {
    id: "o1",
    name: "Apex Shipping Ltd",
    rcNumber: "RC-0234561",
    primaryContact: "Chukwuemeka Obi",
    contactEmail: "c.obi@apexshipping.ng",
    vessels: 8,
    status: "ACTIVE",
    joined: "2026-01-15",
  },
  {
    id: "o2",
    name: "Gulf Maritime Services",
    rcNumber: "RC-0198732",
    primaryContact: "Fatima Al-Hassan",
    contactEmail: "f.alhassan@gulfmaritime.ng",
    vessels: 5,
    status: "ACTIVE",
    joined: "2026-01-22",
  },
  {
    id: "o3",
    name: "Bonny River Carriers",
    rcNumber: "RC-0345678",
    primaryContact: "Emmanuel Ekwueme",
    contactEmail: "e.ekwueme@bonnycarriers.ng",
    vessels: 12,
    status: "ACTIVE",
    joined: "2026-01-28",
  },
  {
    id: "o4",
    name: "Coastal Tankers Nigeria",
    rcNumber: "RC-0412890",
    primaryContact: "Ngozi Adeyemi",
    contactEmail: "n.adeyemi@coastaltankers.ng",
    vessels: 3,
    status: "SUSPENDED",
    joined: "2026-02-05",
  },
  {
    id: "o5",
    name: "Delta Offshore Ltd",
    rcNumber: "RC-0567234",
    primaryContact: "Babatunde Fashola",
    contactEmail: "b.fashola@deltaoffshore.ng",
    vessels: 7,
    status: "ACTIVE",
    joined: "2026-02-12",
  },
  {
    id: "o6",
    name: "Meridian Shipping Corp",
    rcNumber: "RC-0678901",
    primaryContact: "Aisha Buhari",
    contactEmail: "a.buhari@meridianshipping.ng",
    vessels: 4,
    status: "ACTIVE",
    joined: "2026-02-19",
  },
];

// ── Split Rules ────────────────────────────────────────────

export interface SplitRule {
  id: string;
  beneficiary: string;
  basisPoints: number;
  percentage: number;
}

// Equal 25% split across all 4 beneficiaries (2500 bp × 4 = 10,000 bp = 100%) — CONFIRMED.
export const splitRules: SplitRule[] = [
  { id: "sr1", beneficiary: "NIMASA",                  basisPoints: 2500, percentage: 25.0 },
  { id: "sr2", beneficiary: "Lagos Port Authority",    basisPoints: 2500, percentage: 25.0 },
  { id: "sr3", beneficiary: "Blue Wave Maritime",      basisPoints: 2500, percentage: 25.0 },
  { id: "sr4", beneficiary: "Liquid Payments",         basisPoints: 2500, percentage: 25.0 },
];

// ── Settlements ────────────────────────────────────────────

export interface BeneficiaryPayout {
  beneficiary: string;
  amount: number;             // USD
  payoutMethod: string;
  payoutCurrency: "USD" | "NGN";
  payoutStatus: "COMPLETED" | "PENDING" | "FAILED";
  payoutRef?: string;
}

export interface Settlement {
  id: string;
  batchId: string;
  period: string;
  payments: number;
  total: number;
  nimasa: number;
  portAuthority: number;
  blueWave: number;
  liquidPayments: number;
  payouts: BeneficiaryPayout[];
  status: SettlementStatus;
  triggered: string;
}

// Splits: 25% each. Payout methods:
//   NIMASA → Paystack Transfer (NGN bank — Central Bank of Nigeria)
//   Lagos Port Authority → Paystack Transfer (NGN bank)
//   Blue Wave Maritime → Grey.co (USD virtual account)
//   Liquid Payments → Grey.co (USD virtual account)

export const settlements: Settlement[] = [
  {
    id: "s1",
    batchId: "B-2026-031",
    period: "01–10 Mar 2026",
    payments: 3,
    total: 290000,
    nimasa: 72500,
    portAuthority: 72500,
    blueWave: 72500,
    liquidPayments: 72500,
    payouts: [
      { beneficiary: "NIMASA",               amount: 72500, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "COMPLETED", payoutRef: "PSK-TRF-8812031" },
      { beneficiary: "Lagos Port Authority",  amount: 72500, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "COMPLETED", payoutRef: "PSK-TRF-8812032" },
      { beneficiary: "Blue Wave Maritime",    amount: 72500, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "COMPLETED", payoutRef: "GRY-TRF-0031441" },
      { beneficiary: "Liquid Payments",       amount: 72500, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "COMPLETED", payoutRef: "GRY-TRF-0031442" },
    ],
    status: "SETTLED",
    triggered: "2026-03-10 14:37 WAT",
  },
  {
    id: "s2",
    batchId: "B-2026-028",
    period: "21–28 Feb 2026",
    payments: 4,
    total: 396000,
    nimasa: 99000,
    portAuthority: 99000,
    blueWave: 99000,
    liquidPayments: 99000,
    payouts: [
      { beneficiary: "NIMASA",               amount: 99000, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "COMPLETED", payoutRef: "PSK-TRF-8803101" },
      { beneficiary: "Lagos Port Authority",  amount: 99000, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "COMPLETED", payoutRef: "PSK-TRF-8803102" },
      { beneficiary: "Blue Wave Maritime",    amount: 99000, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "COMPLETED", payoutRef: "GRY-TRF-0028311" },
      { beneficiary: "Liquid Payments",       amount: 99000, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "COMPLETED", payoutRef: "GRY-TRF-0028312" },
    ],
    status: "SETTLED",
    triggered: "2026-02-28 16:00 WAT",
  },
  {
    id: "s3",
    batchId: "B-2026-021",
    period: "11–20 Feb 2026",
    payments: 3,
    total: 283500,
    nimasa: 70875,
    portAuthority: 70875,
    blueWave: 70875,
    liquidPayments: 70875,
    payouts: [
      { beneficiary: "NIMASA",               amount: 70875, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "COMPLETED", payoutRef: "PSK-TRF-8795441" },
      { beneficiary: "Lagos Port Authority",  amount: 70875, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "COMPLETED", payoutRef: "PSK-TRF-8795442" },
      { beneficiary: "Blue Wave Maritime",    amount: 70875, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "COMPLETED", payoutRef: "GRY-TRF-0021201" },
      { beneficiary: "Liquid Payments",       amount: 70875, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "COMPLETED", payoutRef: "GRY-TRF-0021202" },
    ],
    status: "SETTLED",
    triggered: "2026-02-20 16:00 WAT",
  },
  {
    id: "s4",
    batchId: "B-2026-014",
    period: "01–10 Feb 2026",
    payments: 4,
    total: 387000,
    nimasa: 96750,
    portAuthority: 96750,
    blueWave: 96750,
    liquidPayments: 96750,
    payouts: [
      { beneficiary: "NIMASA",               amount: 96750, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "PENDING" },
      { beneficiary: "Lagos Port Authority",  amount: 96750, payoutMethod: "Paystack Transfer",  payoutCurrency: "NGN", payoutStatus: "PENDING" },
      { beneficiary: "Blue Wave Maritime",    amount: 96750, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "PENDING" },
      { beneficiary: "Liquid Payments",       amount: 96750, payoutMethod: "Grey.co Transfer",   payoutCurrency: "USD", payoutStatus: "PENDING" },
    ],
    status: "PROCESSING",
    triggered: "2026-02-10 16:00 WAT",
  },
];

// ── Finance Wallet / Ledger ────────────────────────────────

export interface LedgerEntry {
  id: string;
  date: string;
  type: "CREDIT" | "DEBIT";
  description: string;
  amount: number;
  runningBalance: number;
}

export const walletInfo = {
  organisation: "Liquid Payments",
  balance: 2358185,               // cumulative 25% LP share across all settled batches (ledger running balance)
  availableForPayout: 2358185,
  currency: "USD",
  payoutMethod: "Grey.co Transfer",
  lastPayout: "28 Feb 2026",
};

// ── Vendor / Integration Config (Mock) ────────────────────
// Decisions resolved from SRS Open Items:
//   OI-01: External Emission Authority API — mocked at /api/assessment/[refId]
//   OI-02: FX Rate Provider — ExchangeRate-API (mocked at /api/fx-rate)
//   OI-03: USD Payout Provider — Grey.co (Nigerian-ecosystem USD virtual accounts)
//   OI-04: Split Rule — 25% each (pending clarification on "20% each" → 80% gap)
//   OI-05: Platform Service Charge — 1.2% of base fee
//   OI-06: Email Provider — Resend (resend.com)

export const vendorConfig = {
  fxProvider:           { name: "ExchangeRate-API",     env: "EXCHANGE_RATE_API_KEY" },
  emailProvider:        { name: "Resend",                env: "RESEND_API_KEY",  fromAddress: "noreply@liquidemissions.ng" },
  smsProvider:          { name: "Termii",                env: "TERMII_API_KEY" },
  paymentGateways: {
    ngn:                { primary: "Paystack",           fallback: "Flutterwave" },
    usd:                { primary: "Flutterwave",        fallback: "Paystack USD" },
    crypto:             { primary: "TBD (future phase)", fallback: null },
  },
  payoutProviders: {
    ngn:                { provider: "Paystack Transfer API",  notes: "NIMASA + Port Authority (NGN bank accounts)" },
    usd:                { provider: "Grey.co Business API",   notes: "Blue Wave Maritime + Liquid Payments (USD virtual accounts)" },
    usdFallback:        { provider: "Flutterwave Transfer",   notes: "Fallback if Grey.co unavailable" },
  },
  platformChargeRate:   0.012,   // 1.2% of base emission fee
};

export const ledgerEntries: LedgerEntry[] = [
  {
    id: "l1",
    date: "2026-03-10",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-031 (3 payments)",
    amount: 72500,
    runningBalance: 2358185,
  },
  {
    id: "l2",
    date: "2026-02-28",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-028 (4 payments)",
    amount: 99000,
    runningBalance: 2285685,
  },
  {
    id: "l3",
    date: "2026-02-20",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-021 (3 payments)",
    amount: 70875,
    runningBalance: 2186685,
  },
  {
    id: "l4",
    date: "2026-02-10",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-014 (4 payments)",
    amount: 96750,
    runningBalance: 2115810,
  },
  {
    id: "l5",
    date: "2026-01-31",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-007 (5 payments)",
    amount: 72500,
    runningBalance: 2019060,
  },
  {
    id: "l6",
    date: "2026-01-20",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-003 (4 payments)",
    amount: 61750,
    runningBalance: 1946560,
  },
  {
    id: "l7",
    date: "2026-01-10",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2026-001 (6 payments)",
    amount: 96250,
    runningBalance: 1884810,
  },
  {
    id: "l8",
    date: "2025-12-31",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2025-052 (7 payments)",
    amount: 111800,
    runningBalance: 1788560,
  },
  {
    id: "l9",
    date: "2025-12-15",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2025-049 (5 payments)",
    amount: 82750,
    runningBalance: 1676760,
  },
  {
    id: "l10",
    date: "2025-12-01",
    type: "CREDIT",
    description: "Settlement credit — Batch B-2025-046 (6 payments)",
    amount: 99150,
    runningBalance: 1594010,
  },
];
