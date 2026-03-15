/**
 * Mock — Termii SMS API
 *
 * Termii (termii.com) is the SMS provider for optional payment confirmation
 * and alert messages to vessel operators. Enabled per-organisation.
 *
 * Production docs: https://developers.termii.com
 * Auth: api_key in request body (Termii pattern)
 *
 * From: LQDEMIT (sender ID — max 11 chars, registered with NCC)
 *
 * Use cases:
 *   - PaymentCompleted: SMS receipt to operator's registered phone
 *   - PaymentFailed: SMS alert to operator
 *   - Large payment due: reminder SMS (configurable)
 */

import { NextRequest, NextResponse } from 'next/server'

interface SmsRequest {
  to: string               // phone number in international format (+234XXXXXXXXXX)
  template: 'payment_receipt' | 'payment_failed' | 'payment_reminder'
  data: Record<string, string>
}

const SMS_TEMPLATES = {
  payment_receipt:   (d: Record<string, string>) =>
    `LQDEMIT: Payment confirmed. Ref: ${d.transactionRef}. Amount: ${d.amount}. Vessel: ${d.vesselName}. Thank you.`,
  payment_failed:    (d: Record<string, string>) =>
    `LQDEMIT: Payment FAILED for Ref ${d.paymentRefId}. Please retry at liquidemissions.ng or contact support.`,
  payment_reminder:  (d: Record<string, string>) =>
    `LQDEMIT: Emission fee of ${d.amount} is outstanding for vessel ${d.vesselName} (Ref: ${d.paymentRefId}). Pay at liquidemissions.ng.`,
}

const SMS_LOG: Array<{ to: string; message: string; messageId: string; sentAt: string }> = []

export async function POST(req: NextRequest) {
  await new Promise(r => setTimeout(r, 100))

  const body = (await req.json()) as SmsRequest

  const templateFn = SMS_TEMPLATES[body.template]
  if (!templateFn) {
    return NextResponse.json(
      { code: '02', message: `Unknown template: ${body.template}` },
      { status: 422 }
    )
  }

  const message = templateFn(body.data)
  const messageId = `termii_${Date.now().toString(36)}`
  const sentAt = new Date().toISOString()

  SMS_LOG.push({ to: body.to, message, messageId, sentAt })

  // Termii-shaped response
  return NextResponse.json({
    code: 'ok',
    message_id: messageId,
    message: 'Successfully Sent',
    balance: 9842,           // mock balance
    user: 'Liquid Emissions',
    to: body.to,
    sms: message,
    provider: 'termii',
  }, { status: 200 })
}

export async function GET() {
  return NextResponse.json({
    total: SMS_LOG.length,
    messages: SMS_LOG.slice(-20),
    note: 'Prototype SMS log — not persisted across restarts',
  })
}
