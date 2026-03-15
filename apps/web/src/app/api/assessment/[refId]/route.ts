/**
 * Mock — External Maritime Emission Authority API
 *
 * In production this would be a call to the NIMASA / port authority system.
 * The platform sends the Payment Reference ID; the authority returns the
 * pre-calculated assessment or raw inputs for the platform to compute from.
 *
 * Auth (production): mutual TLS or API key in Authorization header.
 */

import { NextRequest, NextResponse } from 'next/server'

type AssessmentStatus = 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'DISPUTED'

interface AuthorityAssessment {
  paymentRefId: string
  assessmentStatus: AssessmentStatus
  imoNumber: string
  vesselName: string
  vesselGRT: number
  portOfCall: string
  portCode: string
  voyageArrival: string
  voyageDeparture: string
  co2eTons: number
  fuelConsumedMT: number
  emissionFactorKgPerMT: number
  feeAmountUSD: number        // pre-calculated by authority (cents)
  currency: 'USD'
  feeScheduleRef: string
  assessedBy: string
  assessedAt: string
}

// ─── Mock assessment database ─────────────────────────────────────────────────
const ASSESSMENTS: Record<string, AuthorityAssessment> = {
  'NIMASA-2026-00847': {
    paymentRefId: 'NIMASA-2026-00847',
    assessmentStatus: 'PENDING_PAYMENT',
    imoNumber: 'IMO9234567',
    vesselName: 'MV ATLANTIC PIONEER',
    vesselGRT: 42500,
    portOfCall: 'Lagos',
    portCode: 'NGLOS',
    voyageArrival: '2026-02-14',
    voyageDeparture: '2026-02-21',
    co2eTons: 1247.3,
    fuelConsumedMT: 420.1,
    emissionFactorKgPerMT: 2969.2,
    feeAmountUSD: 12473000,   // $124,730.00 in cents
    currency: 'USD',
    feeScheduleRef: 'NIMASA-FS-2026-001',
    assessedBy: 'NIMASA Port State Control Unit',
    assessedAt: '2026-02-22T10:30:00Z',
  },
  'NIMASA-2026-00900': {
    paymentRefId: 'NIMASA-2026-00900',
    assessmentStatus: 'PENDING_PAYMENT',
    imoNumber: 'IMO8812034',
    vesselName: 'MT BONNY EXPRESS',
    vesselGRT: 68200,
    portOfCall: 'Apapa',
    portCode: 'NGAPP',
    voyageArrival: '2026-03-01',
    voyageDeparture: '2026-03-06',
    co2eTons: 2183.7,
    fuelConsumedMT: 735.6,
    emissionFactorKgPerMT: 2969.2,
    feeAmountUSD: 21837000,   // $218,370.00
    currency: 'USD',
    feeScheduleRef: 'NIMASA-FS-2026-001',
    assessedBy: 'NIMASA Port State Control Unit',
    assessedAt: '2026-03-07T08:15:00Z',
  },
  'NIMASA-2026-00441': {
    paymentRefId: 'NIMASA-2026-00441',
    assessmentStatus: 'PAID',             // already paid — should be rejected by platform
    imoNumber: 'IMO9876543',
    vesselName: 'MV ATLANTIC SPIRIT',
    vesselGRT: 31200,
    portOfCall: 'Apapa',
    portCode: 'NGAPP',
    voyageArrival: '2026-03-05',
    voyageDeparture: '2026-03-10',
    co2eTons: 864.2,
    fuelConsumedMT: 291.1,
    emissionFactorKgPerMT: 2969.2,
    feeAmountUSD: 8642000,    // $86,420.00
    currency: 'USD',
    feeScheduleRef: 'NIMASA-FS-2026-001',
    assessedBy: 'NIMASA Port State Control Unit',
    assessedAt: '2026-03-11T09:00:00Z',
  },
  'NIMASA-2026-00860': {
    paymentRefId: 'NIMASA-2026-00860',
    assessmentStatus: 'PENDING_PAYMENT',
    imoNumber: 'IMO9501234',
    vesselName: 'MV EMERALD BAY',
    vesselGRT: 15400,
    portOfCall: 'Tin Can Island',
    portCode: 'NGTIN',
    voyageArrival: '2026-03-08',
    voyageDeparture: '2026-03-11',
    co2eTons: 381.5,
    fuelConsumedMT: 128.5,
    emissionFactorKgPerMT: 2969.2,
    feeAmountUSD: 3815000,    // $38,150.00
    currency: 'USD',
    feeScheduleRef: 'NIMASA-FS-2026-001',
    assessedBy: 'NIMASA Port State Control Unit',
    assessedAt: '2026-03-12T11:00:00Z',
  },
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { refId: string } }
) {
  // Simulate network latency (50–150ms)
  await new Promise(r => setTimeout(r, 80 + Math.random() * 100))

  const assessment = ASSESSMENTS[params.refId.toUpperCase()]

  if (!assessment) {
    return NextResponse.json(
      {
        error: 'ASSESSMENT_NOT_FOUND',
        message: `No assessment found for reference ID: ${params.refId}. Verify the reference with your issuing Port Authority or NIMASA.`,
      },
      { status: 404 }
    )
  }

  return NextResponse.json(assessment, { status: 200 })
}
