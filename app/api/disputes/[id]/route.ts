/**
 * Single Dispute API Route
 *
 * Get, update, or delete a specific dispute
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Mock dispute data (in production, fetch from database)
    const mockDispute = {
      id,
      caseNumber: 'DSP-1738369200-ABC12',
      customerId: 'customer-1',
      transactionId: 'txn-1',
      status: 'under_review',
      priority: 'high',
      customerClaim: 'I don\'t recognize this charge.',
      intakeConversation: [
        {
          role: 'system',
          content: 'Dispute initiated for transaction',
          timestamp: new Date('2026-01-29T10:00:00'),
        },
        {
          role: 'customer',
          content: 'I don\'t recognize this charge from Netflix.',
          timestamp: new Date('2026-01-29T10:00:30'),
        },
        {
          role: 'agent',
          content: 'I see this is a Netflix subscription charge. Let me check your history with this merchant.',
          timestamp: new Date('2026-01-29T10:00:45'),
        },
      ],
      merchantIntelligence: {
        decodedMerchantName: 'Netflix Streaming Service',
        merchantType: 'Streaming Service',
        merchantLocation: 'Online Service',
        isSubscription: true,
        subscriptionPattern: 'Monthly recurring charge',
        customerHistory: {
          previousTransactions: 24,
          firstTransactionDate: '2024-01-15',
          averageAmount: 15.99,
          frequency: 'monthly',
        },
        contextualNote: 'You\'ve been paying for this Netflix subscription monthly for 2 years.',
      },
      evidenceCorrelation: {
        gpsCorrelation: {
          matched: true,
          customerLocationAtTime: 'At home address',
          transactionLocation: 'Online transaction',
          distanceInMiles: 0,
          correlationScore: 85,
        },
        deviceCorrelation: {
          matched: true,
          transactionDeviceId: 'device-abc123',
          knownDevices: ['device-abc123', 'device-xyz789'],
          correlationScore: 95,
        },
        familyUsageIndicators: {
          potentialFamilyUse: true,
          authorizedUsers: ['Spouse: Emily Smith'],
          usagePattern: 'Regular streaming service usage from home',
          confidence: 80,
        },
        overallCorrelationScore: 87,
        evidenceSummary: 'High correlation with customer\'s normal usage pattern. Likely legitimate subscription.',
        fraudIndicators: [],
        legitimacyIndicators: [
          'Long-standing subscription (2 years)',
          'Consistent monthly charges',
          'Transaction from known device',
          'Potential family usage',
        ],
      },
      riskAssessment: {
        accountHealth: {
          tenureMonths: 24,
          accountStatus: 'excellent',
          averageMonthlyDeposits: 3500,
          currentBalance: 2450,
          overdraftHistory: false,
        },
        disputeHistory: {
          totalDisputes: 1,
          disputesLast12Months: 1,
          approvedDisputes: 1,
          deniedDisputes: 0,
          totalDisputedAmount: 45.0,
          patternDetected: 'Low dispute activity',
        },
        fraudDatabaseFlags: {
          flagged: false,
          flagType: 'None',
          severity: 'none',
        },
        friendlyFraudProbability: 65,
        riskLevel: 'medium',
        riskFactors: [
          'Disputing a long-standing subscription',
          'All evidence suggests legitimate use',
        ],
        protectiveFactors: [
          'Excellent account health',
          'Low dispute history',
        ],
        provisionalCreditRecommendation: {
          recommended: false,
          amount: 0,
          reasoning: 'Strong evidence of legitimate subscription. Recommend denial with gentle reminder.',
          conditions: 'Allow appeal if customer provides additional evidence',
        },
        analystNotes: 'Potential friendly fraud - customer may have forgotten about subscription. Recommend gentle conversation.',
        recommendedAction: 'escalate',
      },
      fraudLikelihoodScore: 25,
      friendlyFraudProbability: 65,
      riskLevel: 'medium',
      recommendedAction: 'escalate',
      provisionalCreditGranted: false,
      chargebackFiled: false,
      regEDeadline: new Date('2026-02-11'),
      createdAt: new Date('2026-01-29'),
      updatedAt: new Date('2026-01-29'),
      transaction: {
        id: 'txn-1',
        rawMerchantDescriptor: 'NETFLIX.COM',
        merchantName: 'Netflix',
        merchantType: 'Streaming Service',
        amount: 15.99,
        transactionDate: new Date('2026-01-28'),
        transactionTime: '03:15 PM',
        status: 'disputed',
      },
      customer: {
        id: 'customer-1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        accountCreatedAt: new Date('2024-01-01'),
        accountStatus: 'excellent',
      },
    };

    return NextResponse.json({
      success: true,
      dispute: mockDispute,
    });
  } catch (error) {
    console.error('Get dispute error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dispute' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    // In production, update the database record
    console.log('Updating dispute:', id, updates);

    return NextResponse.json({
      success: true,
      message: 'Dispute updated successfully',
      dispute: {
        id,
        ...updates,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Update dispute error:', error);
    return NextResponse.json(
      { error: 'Failed to update dispute' },
      { status: 500 }
    );
  }
}
