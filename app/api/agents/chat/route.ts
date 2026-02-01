/**
 * AI Agent Chat API Route
 *
 * This route handles communication with AI agents.
 * It receives agent messages and returns AI responses.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { agentId, message } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Missing agentId or message' },
        { status: 400 }
      );
    }

    // For now, return mock responses based on agent type
    // In production, this would call actual AI agent APIs
    const response = await getMockAgentResponse(agentId, message);

    return NextResponse.json({
      success: true,
      response,
      agentId,
    });
  } catch (error) {
    console.error('Agent chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process agent request' },
      { status: 500 }
    );
  }
}

// Mock agent responses for demonstration
async function getMockAgentResponse(agentId: string, message: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (agentId) {
    case 'merchant-intelligence':
      return JSON.stringify({
        decodedMerchantName: "Joe's Coffee Shop",
        merchantType: "Coffee Shop",
        merchantLocation: "123 Main St, San Francisco, CA",
        isSubscription: false,
        subscriptionPattern: "",
        customerHistory: {
          previousTransactions: 12,
          firstTransactionDate: "2024-01-15",
          averageAmount: 6.50,
          frequency: "weekly"
        },
        contextualNote: "You've visited this coffee shop about once a week for the past 6 months, typically spending around $6.50."
      });

    case 'evidence-correlator':
      return JSON.stringify({
        gpsCorrelation: {
          matched: true,
          customerLocationAtTime: "Within 0.2 miles of merchant location",
          transactionLocation: "123 Main St, San Francisco, CA",
          distanceInMiles: 0.15,
          correlationScore: 92
        },
        deviceCorrelation: {
          matched: true,
          transactionDeviceId: "device-abc123",
          knownDevices: ["device-abc123", "device-xyz789"],
          correlationScore: 95
        },
        familyUsageIndicators: {
          potentialFamilyUse: false,
          authorizedUsers: [],
          usagePattern: "No family usage pattern detected",
          confidence: 85
        },
        overallCorrelationScore: 91,
        evidenceSummary: "Strong evidence suggests customer was present for transaction. GPS location matches merchant location, and transaction was made from customer's primary device.",
        fraudIndicators: [],
        legitimacyIndicators: [
          "Customer's GPS location matches transaction location",
          "Transaction made from known device",
          "Consistent with customer's purchase pattern"
        ]
      });

    case 'risk-scoring':
      return JSON.stringify({
        accountHealth: {
          tenureMonths: 24,
          accountStatus: "excellent",
          averageMonthlyDeposits: 3500,
          currentBalance: 2450,
          overdraftHistory: false
        },
        disputeHistory: {
          totalDisputes: 1,
          disputesLast12Months: 1,
          approvedDisputes: 1,
          deniedDisputes: 0,
          totalDisputedAmount: 45.00,
          patternDetected: "Low dispute activity, no concerning patterns"
        },
        fraudDatabaseFlags: {
          flagged: false,
          flagType: "None",
          severity: "none"
        },
        friendlyFraudProbability: 15,
        riskLevel: "low",
        riskFactors: [],
        protectiveFactors: [
          "Long account tenure with excellent standing",
          "Consistent deposit patterns",
          "Very low dispute history",
          "No fraud database flags"
        ],
        provisionalCreditRecommendation: {
          recommended: true,
          amount: 45.00,
          reasoning: "Customer has excellent account health and low fraud risk. Recommend immediate provisional credit.",
          conditions: "Standard monitoring"
        },
        analystNotes: "Low-risk customer with strong account history. Approve quickly to maintain customer satisfaction.",
        recommendedAction: "approve"
      });

    case 'case-manager':
      return JSON.stringify({
        summary: "Customer is disputing a transaction they don't recognize. Investigation shows strong evidence the customer was present for the transaction.",
        recommendedNextStep: "Gently remind customer of their purchase history at this merchant and show GPS/device evidence.",
        conversationPoints: [
          "Show decoded merchant name and location",
          "Present evidence of regular visits to this merchant",
          "Highlight GPS and device correlation"
        ],
        requiresHumanReview: false,
        confidenceScore: 88
      });

    case 'resolution':
      return JSON.stringify({
        provisionalCreditProcessed: true,
        provisionalCreditAmount: 45.00,
        chargebackFiled: true,
        chargebackReasonCode: "10.4",
        outcomeMessage: "We've reviewed your dispute and issued a provisional credit of $45.00 to your account. We're also filing a chargeback with the card network on your behalf.",
        nextSteps: [
          "Provisional credit will appear in your account within 1 business day",
          "We'll continue investigating with the merchant",
          "You'll receive updates as the chargeback progresses"
        ],
        estimatedResolutionDate: "2026-03-15"
      });

    default:
      return JSON.stringify({
        message: "Agent response",
        status: "success"
      });
  }
}
