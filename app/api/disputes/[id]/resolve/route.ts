/**
 * Resolve Dispute API Route
 *
 * Processes analyst decision and triggers Resolution Agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { callResolutionAgent } from '@/lib/agents/aiAgent';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { decision, analystNotes, provisionalCreditAmount } = await request.json();

    if (!decision || !['approve', 'deny'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision. Must be "approve" or "deny"' },
        { status: 400 }
      );
    }

    // Call Resolution Agent to process the decision
    const resolutionResult = await callResolutionAgent({
      disputeId: id,
      decision,
      provisionalCreditAmount,
      analystNotes,
    });

    if (!resolutionResult.success) {
      return NextResponse.json(
        { error: resolutionResult.error || 'Resolution agent failed' },
        { status: 500 }
      );
    }

    const resolution = resolutionResult.data;

    // Update dispute record with resolution details
    const updatedDispute = {
      id,
      status: decision === 'approve' ? 'approved' : 'denied',
      analystNotes,
      analystDecision: decision,
      analystDecisionDate: new Date(),
      provisionalCreditGranted: resolution?.provisionalCreditProcessed || false,
      provisionalCreditAmount: resolution?.provisionalCreditAmount,
      provisionalCreditDate: resolution?.provisionalCreditProcessed ? new Date() : null,
      chargebackFiled: resolution?.chargebackFiled || false,
      chargebackReasonCode: resolution?.chargebackReasonCode,
      chargebackFiledDate: resolution?.chargebackFiled ? new Date() : null,
      outcomeNotified: true,
      outcomeMessage: resolution?.outcomeMessage,
      outcomeNotifiedDate: new Date(),
      resolvedAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      dispute: updatedDispute,
      resolution,
      message: `Dispute ${decision === 'approve' ? 'approved' : 'denied'} successfully`,
    });
  } catch (error) {
    console.error('Resolve dispute error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve dispute' },
      { status: 500 }
    );
  }
}
