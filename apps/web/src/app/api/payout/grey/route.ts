/**
 * Mock — Grey.co Business API
 *
 * Grey.co is a Nigerian-first multi-currency financial platform that provides
 * USD/GBP/EUR virtual accounts and programmatic cross-border transfers.
 * Used by Liquid Payments and Blue Wave Maritime for USD disbursements.
 *
 * Production docs: https://docs.grey.co (API key in Authorization: Bearer header)
 *
 * This mock simulates:
 *   POST /api/payout/grey  → initiate a USD payout to a Grey virtual account
 *   Typical real endpoint: POST https://api.grey.co/v1/transfers
 */

import { NextRequest, NextResponse } from 'next/server'

interface GreyPayoutRequest {
  recipientAccountId: string   // Grey virtual account ID of the beneficiary
  amount: number               // in USD cents
  currency: 'USD'
  reference: string            // platform-generated idempotency reference
  narration: string            // description shown on transfer
}

interface GreyPayoutResponse {
  transferId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  reference: string
  amount: number
  currency: string
  fee: number                  // Grey transaction fee in cents
  recipientAccountId: string
  recipientName: string
  estimatedArrival: string
  createdAt: string
  provider: 'grey.co'
}

// Simulated virtual account registry
const GREY_ACCOUNTS: Record<string, { name: string; accountNumber: string; bank: string }> = {
  'GREY-ACC-BLUEWAVE-001':  { name: 'Blue Wave Maritime Ltd',  accountNumber: '****4821', bank: 'Grey USD Account' },
  'GREY-ACC-LIQUID-001':    { name: 'Liquid Payments Ltd',     accountNumber: '****9034', bank: 'Grey USD Account' },
}

export async function POST(req: NextRequest) {
  await new Promise(r => setTimeout(r, 120))  // simulate ~120ms API latency

  const body = (await req.json()) as GreyPayoutRequest

  const recipient = GREY_ACCOUNTS[body.recipientAccountId]
  if (!recipient) {
    return NextResponse.json(
      { error: 'RECIPIENT_NOT_FOUND', message: `No Grey account found for ID: ${body.recipientAccountId}` },
      { status: 404 }
    )
  }

  if (!body.amount || body.amount < 100) {
    return NextResponse.json(
      { error: 'INVALID_AMOUNT', message: 'Minimum payout amount is $1.00 (100 cents)' },
      { status: 422 }
    )
  }

  const transferId = `GRY-TRF-${Date.now().toString(36).toUpperCase()}`
  const fee = Math.round(body.amount * 0.005)  // Grey charges ~0.5% per transfer
  const now = new Date()
  const arrival = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)  // ~2 business days

  const response: GreyPayoutResponse = {
    transferId,
    status: 'PROCESSING',
    reference: body.reference,
    amount: body.amount,
    currency: 'USD',
    fee,
    recipientAccountId: body.recipientAccountId,
    recipientName: recipient.name,
    estimatedArrival: arrival.toISOString().split('T')[0],
    createdAt: now.toISOString(),
    provider: 'grey.co',
  }

  return NextResponse.json(response, { status: 201 })
}

// GET /api/payout/grey?transferId=GRY-TRF-XXX — poll transfer status
export async function GET(req: NextRequest) {
  await new Promise(r => setTimeout(r, 80))

  const transferId = req.nextUrl.searchParams.get('transferId')
  if (!transferId) {
    return NextResponse.json({ error: 'transferId query param required' }, { status: 400 })
  }

  // Simulate completed status for known mock IDs
  const mockCompleted = ['GRY-TRF-0031441', 'GRY-TRF-0031442', 'GRY-TRF-0028311', 'GRY-TRF-0028312',
                         'GRY-TRF-0021201', 'GRY-TRF-0021202']
  const status = mockCompleted.includes(transferId) ? 'COMPLETED' : 'PROCESSING'

  return NextResponse.json({
    transferId,
    status,
    provider: 'grey.co',
    checkedAt: new Date().toISOString(),
  })
}
