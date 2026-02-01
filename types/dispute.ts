/**
 * Type definitions for the Varo Dispute Management System
 */

export type DisputeStatus =
  | 'intake'
  | 'investigating'
  | 'under_review'
  | 'approved'
  | 'denied'
  | 'appealed';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type RecommendedAction = 'approve' | 'deny' | 'escalate' | 'needMoreInfo';

export interface ChatMessage {
  role: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

export interface TransactionDetails {
  id: string;
  rawMerchantDescriptor: string;
  merchantName?: string;
  merchantType?: string;
  amount: number;
  transactionDate: Date;
  transactionTime: string;
  merchantLocation?: string;
  deviceId?: string;
  status: string;
}

export interface DisputeCase {
  id: string;
  caseNumber: string;
  customerId: string;
  transactionId: string;
  status: DisputeStatus;
  priority: string;
  customerClaim?: string;
  fraudLikelihoodScore?: number;
  friendlyFraudProbability?: number;
  riskLevel?: RiskLevel;
  recommendedAction?: RecommendedAction;
  assignedAnalystId?: string;
  analystNotes?: string;
  provisionalCreditGranted: boolean;
  provisionalCreditAmount?: number;
  chargebackFiled: boolean;
  regEDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  transaction?: TransactionDetails;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface EvidenceData {
  merchantIntelligence?: any;
  evidenceCorrelation?: any;
  riskAssessment?: any;
}

export interface AnalystDashboardFilters {
  status?: DisputeStatus[];
  riskLevel?: RiskLevel[];
  priority?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
