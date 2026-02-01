/**
 * AI Agent Communication Utility
 *
 * This module handles all AI agent interactions for the Varo Dispute Management System.
 * It provides a clean interface for calling agents and parsing their JSON responses.
 */

// Agent configuration types
export interface AgentConfig {
  agentId: string;
  agentName: string;
  apiKey?: string;
  baseUrl?: string;
}

// Generic agent response wrapper
export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
}

// Merchant Intelligence Agent Response
export interface MerchantIntelligenceResponse {
  decodedMerchantName: string;
  merchantType: string;
  merchantLocation: string;
  isSubscription: boolean;
  subscriptionPattern?: string;
  customerHistory: {
    previousTransactions: number;
    firstTransactionDate: string;
    averageAmount: number;
    frequency: string;
  };
  contextualNote: string;
}

// Evidence Correlator Agent Response
export interface EvidenceCorrelationResponse {
  gpsCorrelation: {
    matched: boolean;
    customerLocationAtTime: string;
    transactionLocation: string;
    distanceInMiles: number;
    correlationScore: number;
  };
  deviceCorrelation: {
    matched: boolean;
    transactionDeviceId: string;
    knownDevices: string[];
    correlationScore: number;
  };
  familyUsageIndicators: {
    potentialFamilyUse: boolean;
    authorizedUsers: string[];
    usagePattern: string;
    confidence: number;
  };
  overallCorrelationScore: number;
  evidenceSummary: string;
  fraudIndicators: string[];
  legitimacyIndicators: string[];
}

// Risk Scoring Agent Response
export interface RiskScoringResponse {
  accountHealth: {
    tenureMonths: number;
    accountStatus: string;
    averageMonthlyDeposits: number;
    currentBalance: number;
    overdraftHistory: boolean;
  };
  disputeHistory: {
    totalDisputes: number;
    disputesLast12Months: number;
    approvedDisputes: number;
    deniedDisputes: number;
    totalDisputedAmount: number;
    patternDetected: string;
  };
  fraudDatabaseFlags: {
    flagged: boolean;
    flagType: string;
    severity: string;
  };
  friendlyFraudProbability: number;
  riskLevel: string;
  riskFactors: string[];
  protectiveFactors: string[];
  provisionalCreditRecommendation: {
    recommended: boolean;
    amount: number;
    reasoning: string;
    conditions: string;
  };
  analystNotes: string;
  recommendedAction: string;
}

// Case Manager Agent Response
export interface CaseManagerResponse {
  summary: string;
  recommendedNextStep: string;
  conversationPoints: string[];
  requiresHumanReview: boolean;
  confidenceScore: number;
}

// Resolution Agent Response
export interface ResolutionResponse {
  provisionalCreditProcessed: boolean;
  provisionalCreditAmount?: number;
  chargebackFiled: boolean;
  chargebackReasonCode?: string;
  outcomeMessage: string;
  nextSteps: string[];
  estimatedResolutionDate: string;
}

/**
 * Parse JSON response from AI agent, handling various edge cases
 */
function parseAgentJSON<T>(response: string): T {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.trim();

    // Remove ```json or ``` wrappers
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n/, '').replace(/\n```\s*$/, '');
    }

    // Find JSON object in the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    return JSON.parse(cleaned) as T;
  } catch (error) {
    throw new Error(`Failed to parse agent response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Call an AI agent with proper error handling and JSON parsing
 */
export async function callAgent<T = any>(
  config: AgentConfig,
  prompt: string,
  context?: Record<string, any>
): Promise<AgentResponse<T>> {
  try {
    // Construct the full prompt with context
    const fullPrompt = context
      ? `${prompt}\n\nContext Data:\n${JSON.stringify(context, null, 2)}`
      : prompt;

    // Make API call to the agent
    const response = await fetch(`${config.baseUrl || '/api/agents/chat'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        agentId: config.agentId,
        message: fullPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Agent API error: ${response.status}`);
    }

    const data = await response.json();
    const agentMessage = data.response || data.message || data;

    // Parse the JSON response
    const parsedData = parseAgentJSON<T>(agentMessage);

    return {
      success: true,
      data: parsedData,
      rawResponse: agentMessage,
    };
  } catch (error) {
    console.error(`Error calling agent ${config.agentName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Merchant Intelligence Agent wrapper
 */
export async function callMerchantIntelligenceAgent(
  transactionData: {
    rawMerchantDescriptor: string;
    amount: number;
    transactionDate: string;
    location?: string;
    customerHistory?: any;
  }
): Promise<AgentResponse<MerchantIntelligenceResponse>> {
  const config: AgentConfig = {
    agentId: process.env.MERCHANT_INTELLIGENCE_AGENT_ID || 'merchant-intelligence',
    agentName: 'Merchant Intelligence Agent',
  };

  const prompt = `Analyze this transaction and decode the merchant descriptor:

Transaction: ${transactionData.rawMerchantDescriptor}
Amount: $${transactionData.amount}
Date: ${transactionData.transactionDate}
${transactionData.location ? `Location: ${transactionData.location}` : ''}

Provide a clear merchant name, identify if it's a subscription, and give context that would help the customer recognize this charge.`;

  return callAgent<MerchantIntelligenceResponse>(config, prompt, transactionData);
}

/**
 * Evidence Correlator Agent wrapper
 */
export async function callEvidenceCorrelatorAgent(
  evidenceData: {
    transaction: any;
    gpsHistory: any[];
    deviceFingerprints: any[];
    authorizedUsers: any[];
  }
): Promise<AgentResponse<EvidenceCorrelationResponse>> {
  const config: AgentConfig = {
    agentId: process.env.EVIDENCE_CORRELATOR_AGENT_ID || 'evidence-correlator',
    agentName: 'Evidence Correlator Agent',
  };

  const prompt = `Perform forensic analysis on this transaction to determine if the customer was likely present:

Analyze GPS correlation, device matching, and family usage patterns to provide an evidence-based assessment.`;

  return callAgent<EvidenceCorrelationResponse>(config, prompt, evidenceData);
}

/**
 * Risk Scoring Agent wrapper
 */
export async function callRiskScoringAgent(
  riskData: {
    accountInfo: any;
    disputeHistory: any[];
    fraudFlags: any[];
    transactionAmount: number;
  }
): Promise<AgentResponse<RiskScoringResponse>> {
  const config: AgentConfig = {
    agentId: process.env.RISK_SCORING_AGENT_ID || 'risk-scoring',
    agentName: 'Risk Scoring Agent',
  };

  const prompt = `Assess the fraud risk for this dispute:

Calculate friendly fraud probability, analyze account health, and provide a provisional credit recommendation.`;

  return callAgent<RiskScoringResponse>(config, prompt, riskData);
}

/**
 * Case Manager Agent wrapper (manages sub-agents)
 */
export async function callCaseManagerAgent(
  caseData: {
    customerId: string;
    transactionId: string;
    customerMessage: string;
    merchantIntelligence?: MerchantIntelligenceResponse;
    evidenceCorrelation?: EvidenceCorrelationResponse;
    riskScoring?: RiskScoringResponse;
  }
): Promise<AgentResponse<CaseManagerResponse>> {
  const config: AgentConfig = {
    agentId: process.env.CASE_MANAGER_AGENT_ID || 'case-manager',
    agentName: 'Case Manager Agent',
  };

  const prompt = `You are conducting an empathetic dispute intake interview.

The customer says: "${caseData.customerMessage}"

${caseData.merchantIntelligence ? `Merchant Intelligence: ${JSON.stringify(caseData.merchantIntelligence)}` : ''}
${caseData.evidenceCorrelation ? `Evidence Analysis: ${JSON.stringify(caseData.evidenceCorrelation)}` : ''}
${caseData.riskScoring ? `Risk Assessment: ${JSON.stringify(caseData.riskScoring)}` : ''}

Provide a summary and recommend next steps.`;

  return callAgent<CaseManagerResponse>(config, prompt, caseData);
}

/**
 * Resolution Agent wrapper
 */
export async function callResolutionAgent(
  resolutionData: {
    disputeId: string;
    decision: 'approve' | 'deny';
    provisionalCreditAmount?: number;
    analystNotes?: string;
  }
): Promise<AgentResponse<ResolutionResponse>> {
  const config: AgentConfig = {
    agentId: process.env.RESOLUTION_AGENT_ID || 'resolution',
    agentName: 'Resolution Agent',
  };

  const prompt = `Process this dispute resolution:

Decision: ${resolutionData.decision}
${resolutionData.provisionalCreditAmount ? `Credit Amount: $${resolutionData.provisionalCreditAmount}` : ''}
${resolutionData.analystNotes ? `Analyst Notes: ${resolutionData.analystNotes}` : ''}

Execute the decision and prepare customer communication.`;

  return callAgent<ResolutionResponse>(config, prompt, resolutionData);
}

/**
 * Batch call multiple agents in parallel
 */
export async function callAgentsInParallel<T extends Record<string, any>>(
  agents: Array<{ name: string; promise: Promise<AgentResponse<any>> }>
): Promise<Record<string, AgentResponse<any>>> {
  const results = await Promise.allSettled(
    agents.map(agent => agent.promise)
  );

  return agents.reduce((acc, agent, index) => {
    const result = results[index];
    acc[agent.name] = result.status === 'fulfilled'
      ? result.value
      : { success: false, error: 'Agent call failed' };
    return acc;
  }, {} as Record<string, AgentResponse<any>>);
}
