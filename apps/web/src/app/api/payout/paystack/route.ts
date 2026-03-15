/**
 * Mock — Paystack Transfer API (NGN Payouts)
 *
 * Used for disbursing NGN to NIMASA and Lagos Port Authority
 * via their registered Nigerian bank accounts.
 *
 * Production docs: https://paystack.com/docs/transfers
 * Auth: Authorization: Bearer sk_live_XXXX
 *
 * Real flow:
 *   1. Create Transfer Recipient (if not cached)  POST /transferrecipient
 *   2. Initiate Transfer                          POST /transfer
 *   3. Poll / webhook for status                  GET  /transfer/:code
 *
 * This mock combines steps 2+3 into a single POST endpoint.
 */

import { NextRequest, NextResponse } from 'next/server'

interface PaystackTransferRequest {
  recipientCode: string      // Paystack recipient code (pre-registered)
  amount: number             // in kobo (NGN minor units)
  reference: string          // idempotency reference
  reason: string             // narration / description
}

interface PaystackTransferResponse {
  status: boolean
  message: string
  data: {
    transferCode: string
    reference: string
    amount: number           // kobo
    currency: string
    status: 'pending' | 'success' | 'failed' | 'reversed'
    recipient: {
      recipientCode: string
      name: string
      bank: string
      accountNumber: string
    }
    fee: number              // Paystack fee in kobo
    createdAt: string
    updatedAt: string
    provider: 'paystack'
  }
}

// Pre-registered recipient codes for Nigerian government beneficiaries
const PAYSTACK_RECIPIENTS: Record<string, { name: string; bank: string; accountNumber: string }> = {
  'RCP_NIMASA_001':      { name: 'NIMASA (Nigerian Maritime Administration)', bank: 'Access Bank',  accountNumber: '****8812' },
  'RCP_LPA_001':         { name: 'Lagos Port Authority',                      bank: 'Zenith Bank',  accountNumber: '****3394' },
}

export async function POST(req: NextRequest) {
  await new Promise(r => setTimeout(r, 150))  // Paystack typical latency

  const body = (await req.json()) as PaystackTransferRequest

  const recipient = PAYSTACK_RECIPIENTS[body.recipientCode]
  if (!recipient) {
    return NextResponse.json(
      {
        status: false,
        message: `Recipient not found: ${body.recipientCode}. Create recipient first via POST /transferrecipient.`,
      },
      { status: 404 }
    )
  }

  if (!body.amount || body.amount < 100) {
    return NextResponse.json(
      { status: false, message: 'Minimum transfer amount is ₦1 (100 kobo)' },
      { status: 422 }
    )
  }

  const transferCode = `TRF_${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const fee = 5000  // ₦50 flat Paystack fee in kobo (mock)
  const now = new Date()

  const response: PaystackTransferResponse = {
    status: true,
    message: 'Transfer has been queued',
    data: {
      transferCode,
      reference: body.reference,
      amount: body.amount,
      currency: 'NGN',
      status: 'pending',
      recipient: {
        recipientCode: body.recipientCode,
        name: recipient.name,
        bank: recipient.bank,
        accountNumber: recipient.accountNumber,
      },
      fee,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      provider: 'paystack',
    },
  }

  return NextResponse.json(response, { status: 200 })
}

// GET ?transferCode=TRF_XXX — check transfer status
export async function GET(req: NextRequest) {
  await new Promise(r => setTimeout(r, 80))

  const transferCode = req.nextUrl.searchParams.get('transferCode')
  if (!transferCode) {
    return NextResponse.json({ status: false, message: 'transferCode query param required' }, { status: 400 })
  }

  const mockCompleted = ['PSK-TRF-8812031', 'PSK-TRF-8812032', 'PSK-TRF-8803101', 'PSK-TRF-8803102',
                         'PSK-TRF-8795441', 'PSK-TRF-8795442']
  const status = mockCompleted.includes(transferCode) ? 'success' : 'pending'

  return NextResponse.json({
    status: true,
    data: {
      transferCode,
      status,
      currency: 'NGN',
      provider: 'paystack',
      checkedAt: new Date().toISOString(),
    },
  })
}
