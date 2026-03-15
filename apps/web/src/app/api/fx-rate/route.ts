/**
 * Mock — FX Rate Provider API
 *
 * In production: call a live provider (Open Exchange Rates, ExchangeRate-API, CBN feed).
 * The platform fetches the rate at PaymentOrder creation and locks it.
 * The spread margin (1.5%) is applied on top to cover FX risk.
 *
 * Rate source: ExchangeRate-API (mock)
 */

import { NextResponse } from 'next/server'

const MOCK_SPOT_RATE = 1637.20     // USD → NGN mid-market rate
const SPREAD_PERCENT = 1.5         // 1.5% spread applied by platform

export async function GET() {
  // Simulate provider latency
  await new Promise(r => setTimeout(r, 60))

  const spotRate = MOCK_SPOT_RATE
  const effectiveRate = parseFloat((spotRate * (1 + SPREAD_PERCENT / 100)).toFixed(2))

  const now = new Date()
  const expires = new Date(now.getTime() + 30 * 60 * 1000) // 30-min validity window

  return NextResponse.json({
    base: 'USD',
    target: 'NGN',
    spotRate,
    spreadPercent: SPREAD_PERCENT,
    effectiveRate,       // rate shown to operator and locked on PaymentOrder
    lockedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    provider: 'ExchangeRate-API',
    note: 'Rate locked for 30 minutes. Effective rate includes 1.5% platform FX spread.',
  })
}
