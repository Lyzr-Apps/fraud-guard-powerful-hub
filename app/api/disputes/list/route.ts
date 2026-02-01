/**
 * List Disputes API Route
 *
 * Returns a list of disputes with filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');
    const customerId = searchParams.get('customerId');

    // Mock dispute data (in production, fetch from database with filters)
    const mockDisputes = [
      {
        id: 'dispute-1',
        caseNumber: 'DSP-1738369200-ABC12',
        customerId: 'customer-1',
        transactionId: 'txn-1',
        status: 'under_review',
        priority: 'high',
        customerClaim: 'I don\'t recognize this charge from Netflix.',
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
          amount: 15.99,
          transactionDate: new Date('2026-01-28'),
          status: 'disputed',
        },
        customer: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
      },
      {
        id: 'dispute-2',
        caseNumber: 'DSP-1738369300-XYZ89',
        customerId: 'customer-2',
        transactionId: 'txn-2',
        status: 'under_review',
        priority: 'critical',
        customerClaim: 'My card was stolen and this charge is fraudulent.',
        fraudLikelihoodScore: 85,
        friendlyFraudProbability: 10,
        riskLevel: 'low',
        recommendedAction: 'approve',
        provisionalCreditGranted: false,
        chargebackFiled: false,
        regEDeadline: new Date('2026-02-10'),
        createdAt: new Date('2026-01-28'),
        updatedAt: new Date('2026-01-28'),
        transaction: {
          id: 'txn-2',
          rawMerchantDescriptor: 'AMZN MKTP US',
          merchantName: 'Amazon Marketplace',
          amount: 299.99,
          transactionDate: new Date('2026-01-27'),
          status: 'disputed',
        },
        customer: {
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.j@example.com',
        },
      },
      {
        id: 'dispute-3',
        caseNumber: 'DSP-1738369400-LMN45',
        customerId: 'customer-3',
        transactionId: 'txn-3',
        status: 'approved',
        priority: 'medium',
        customerClaim: 'Charged twice for the same purchase.',
        fraudLikelihoodScore: 90,
        friendlyFraudProbability: 5,
        riskLevel: 'low',
        recommendedAction: 'approve',
        provisionalCreditGranted: true,
        provisionalCreditAmount: 45.50,
        chargebackFiled: true,
        regEDeadline: new Date('2026-02-09'),
        createdAt: new Date('2026-01-27'),
        updatedAt: new Date('2026-01-30'),
        resolvedAt: new Date('2026-01-30'),
        transaction: {
          id: 'txn-3',
          rawMerchantDescriptor: 'SQ *RESTAURANT',
          merchantName: 'Local Restaurant',
          amount: 45.50,
          transactionDate: new Date('2026-01-26'),
          status: 'disputed',
        },
        customer: {
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.w@example.com',
        },
      },
    ];

    // Apply filters
    let filteredDisputes = mockDisputes;

    if (status) {
      filteredDisputes = filteredDisputes.filter(d => d.status === status);
    }

    if (riskLevel) {
      filteredDisputes = filteredDisputes.filter(d => d.riskLevel === riskLevel);
    }

    if (customerId) {
      filteredDisputes = filteredDisputes.filter(d => d.customerId === customerId);
    }

    return NextResponse.json({
      success: true,
      disputes: filteredDisputes,
      total: filteredDisputes.length,
    });
  } catch (error) {
    console.error('List disputes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disputes' },
      { status: 500 }
    );
  }
}
