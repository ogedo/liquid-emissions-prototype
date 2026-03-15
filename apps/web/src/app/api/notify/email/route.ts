/**
 * Mock — Resend Email API
 *
 * Resend (resend.com) is the email provider for all transactional email.
 * Used for: payment receipts, payment failure alerts, settlement notifications,
 * welcome emails, password resets, and admin alerts.
 *
 * Production setup:
 *   npm install resend
 *   import { Resend } from 'resend'
 *   const resend = new Resend(process.env.RESEND_API_KEY)
 *
 * From address: noreply@liquidemissions.ng  (domain verified in Resend dashboard)
 * Auth: Authorization: Bearer re_XXXXXXXXXXXX
 *
 * This mock simulates the Resend /emails endpoint response shape.
 */

import { NextRequest, NextResponse } from 'next/server'

type EmailTemplate =
  | 'payment_receipt'
  | 'payment_failed'
  | 'settlement_credited'
  | 'settlement_failed'
  | 'welcome'
  | 'password_reset'
  | 'admin_alert'

interface SendEmailRequest {
  to: string | string[]
  template: EmailTemplate
  subject?: string           // overrides template default if provided
  data: Record<string, unknown>  // template-specific variables
}

interface ResendEmailResponse {
  id: string                 // Resend message ID
  to: string | string[]
  from: string
  subject: string
  template: EmailTemplate
  status: 'sent' | 'queued'
  createdAt: string
  provider: 'resend'
}

const TEMPLATE_SUBJECTS: Record<EmailTemplate, string> = {
  payment_receipt:      'Payment Receipt — Liquid Emissions Revenue Collection',
  payment_failed:       'Payment Failed — Action Required',
  settlement_credited:  'Settlement Credited to Your Wallet',
  settlement_failed:    'Settlement Payout Failed — Admin Notification',
  welcome:              'Welcome to Liquid Emissions Revenue Collection',
  password_reset:       'Reset Your Password',
  admin_alert:          '[ADMIN ALERT] Platform Notification',
}

// Simulated email log (in-memory for prototype; production: persisted in DB)
const EMAIL_LOG: ResendEmailResponse[] = []

export async function POST(req: NextRequest) {
  await new Promise(r => setTimeout(r, 90))  // Resend typical latency

  const body = (await req.json()) as SendEmailRequest

  if (!body.to || !body.template) {
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: '`to` and `template` are required' },
      { status: 422 }
    )
  }

  const messageId = `re_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  const subject = body.subject ?? TEMPLATE_SUBJECTS[body.template] ?? 'Notification'
  const now = new Date().toISOString()

  const response: ResendEmailResponse = {
    id: messageId,
    to: body.to,
    from: 'noreply@liquidemissions.ng',
    subject,
    template: body.template,
    status: 'sent',
    createdAt: now,
    provider: 'resend',
  }

  EMAIL_LOG.push(response)

  return NextResponse.json(response, { status: 201 })
}

// GET /api/notify/email — view sent email log (prototype dev tool only)
export async function GET() {
  return NextResponse.json({
    total: EMAIL_LOG.length,
    emails: EMAIL_LOG.slice(-20),  // last 20
    note: 'Prototype email log — not persisted across restarts',
  })
}

/**
 * Template variable reference (for frontend/backend integration docs):
 *
 * payment_receipt:
 *   { recipientName, vesselName, paymentRefId, transactionRef, amountPaid,
 *     currency, paymentDate, receiptUrl }
 *
 * payment_failed:
 *   { recipientName, vesselName, paymentRefId, failureReason, retryUrl }
 *
 * settlement_credited:
 *   { recipientName, organisation, batchId, amount, currency,
 *     payoutMethod, walletUrl }
 *
 * settlement_failed:
 *   { batchId, beneficiary, amount, failureReason, adminDashboardUrl }
 *
 * welcome:
 *   { recipientName, organisation, loginUrl }
 *
 * password_reset:
 *   { recipientName, resetUrl, expiresIn }
 *
 * admin_alert:
 *   { alertType, message, severity, dashboardUrl }
 */
