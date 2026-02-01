/**
 * Create Dispute API Route
 *
 * Handles the creation of a new dispute and triggers the investigation workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  callMerchantIntelligenceAgent,
  callEvidenceCorrelatorAgent,
  callRiskScoringAgent,
  callAgentsInParallel,
} from '@/lib/agents/aiAgent';

export async function POST(request: NextRequest) {
  try {
    const { transactionId, customerId, customerMessage } = await request.json();

    if (!transactionId || !customerId || !customerMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate case number
    const caseNumber = `DSP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Mock transaction and customer data (in production, fetch from database)
    const transaction = {
      id: transactionId,
      rawMerchantDescriptor: "SQ *JOES COFFEE",
      amount: 6.50,
      transactionDate: "2026-01-30",
      transactionTime: "08:45 AM",
      merchantLocation: "123 Main St, San Francisco, CA",
      latitude: 37.7749,
      longitude: -122.4194,
      deviceId: "device-abc123",
    };

    const customer = {
      id: customerId,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      accountCreatedAt: "2024-01-01",
      averageMonthlyDeposits: 3500,
      currentBalance: 2450,
      accountStatus: "excellent",
    };

    // Call all investigation agents in parallel
    console.log('Starting parallel agent investigation...');

    const agentResults = await callAgentsInParallel([
      {
        name: 'merchantIntelligence',
        promise: callMerchantIntelligenceAgent({
          rawMerchantDescriptor: transaction.rawMerchantDescriptor,
          amount: transaction.amount,
          transactionDate: transaction.transactionDate,
          location: transaction.merchantLocation,
        }),
      },
      {
        name: 'evidenceCorrelation',
        promise: callEvidenceCorrelatorAgent({
          transaction,
          gpsHistory: [
            {
              latitude: 37.7750,
              longitude: -122.4195,
              timestamp: "2026-01-30T08:45:00Z",
              accuracy: 10,
            },
          ],
          deviceFingerprints: [
            { deviceId: "device-abc123", deviceType: "mobile", lastUsed: "2026-01-30" },
          ],
          authorizedUsers: [],
        }),
      },
      {
        name: 'riskScoring',
        promise: callRiskScoringAgent({
          accountInfo: customer,
          disputeHistory: [
            {
              id: "prev-1",
              amount: 45.00,
              status: "approved",
              createdAt: "2025-06-15",
            },
          ],
          fraudFlags: [],
          transactionAmount: transaction.amount,
        }),
      },
    ]);

    // Extract successful responses
    const merchantIntelligence = agentResults.merchantIntelligence?.data;
    const evidenceCorrelation = agentResults.evidenceCorrelation?.data;
    const riskAssessment = agentResults.riskScoring?.data;

    // Determine if case requires human review
    const requiresHumanReview =
      (riskAssessment?.friendlyFraudProbability || 0) > 50 ||
      (evidenceCorrelation?.overallCorrelationScore || 0) > 70 ||
      (riskAssessment?.riskLevel === 'high' || riskAssessment?.riskLevel === 'critical');

    // Calculate overall fraud likelihood score
    const fraudLikelihoodScore = Math.round(
      100 - (evidenceCorrelation?.overallCorrelationScore || 50)
    );

    // Create dispute record
    const dispute = {
      id: `dispute-${Date.now()}`,
      caseNumber,
      customerId,
      transactionId,
      status: requiresHumanReview ? 'under_review' : 'investigating',
      priority: riskAssessment?.riskLevel === 'high' ? 'high' : 'medium',
      customerClaim: customerMessage,
      merchantIntelligence,
      evidenceCorrelation,
      riskAssessment,
      fraudLikelihoodScore,
      friendlyFraudProbability: riskAssessment?.friendlyFraudProbability,
      riskLevel: riskAssessment?.riskLevel,
      recommendedAction: riskAssessment?.recommendedAction,
      provisionalCreditGranted: false,
      chargebackFiled: false,
      regEDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days for Reg E
      createdAt: new Date(),
      updatedAt: new Date(),
      transaction,
      customer,
    };

    return NextResponse.json({
      success: true,
      dispute,
      requiresHumanReview,
      message: requiresHumanReview
        ? 'Dispute created and sent for analyst review'
        : 'Dispute investigation in progress',
    });
  } catch (error) {
    console.error('Create dispute error:', error);
    return NextResponse.json(
      { error: 'Failed to create dispute' },
      { status: 500 }
    );
  }
}
