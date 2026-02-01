'use client';

/**
 * Case Detail View
 *
 * Deep-dive into individual dispute evidence with tabbed interface
 */

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaCreditCard,
  FaCalendar,
  FaClock,
  FaShieldAlt,
} from 'react-icons/fa';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EvidenceCard } from '@/components/shared/EvidenceCard';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [activeTab, setActiveTab] = useState<'summary' | 'evidence' | 'timeline' | 'notes'>('summary');
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<'approve' | 'deny' | null>(null);
  const [analystNotes, setAnalystNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/disputes/${caseId}`);
      const data = await response.json();

      if (data.success) {
        setCaseData(data.dispute);
      }
    } catch (error) {
      console.error('Failed to fetch case details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessDecision = async () => {
    if (!decision) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/disputes/${caseId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          analystNotes,
          provisionalCreditAmount: decision === 'approve' ? caseData.transaction.amount : 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/analyst/dashboard');
      }
    } catch (error) {
      console.error('Failed to process decision:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4AA] mx-auto" />
          <p className="mt-4 text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(caseData.regEDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Case {caseData.caseNumber}</h1>
                <p className="text-sm text-gray-500">
                  {caseData.customer.firstName} {caseData.customer.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Reg E Deadline</div>
                <div className={`text-lg font-bold ${daysUntilDeadline <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                  {daysUntilDeadline} days left
                </div>
              </div>
              <RiskBadge level={caseData.riskLevel} size="lg" />
              <StatusBadge status={caseData.status} size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Transaction & Customer Info */}
          <div className="space-y-4">
            {/* Transaction Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaCreditCard className="text-[#00D4AA]" />
                Transaction Details
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Merchant</div>
                  <div className="font-medium text-gray-900">
                    {caseData.transaction.merchantName || caseData.transaction.rawMerchantDescriptor}
                  </div>
                  {caseData.transaction.merchantName && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Raw: {caseData.transaction.rawMerchantDescriptor}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${caseData.transaction.amount.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(caseData.transaction.transactionDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Time</div>
                    <div className="text-sm font-medium text-gray-900">
                      {caseData.transaction.transactionTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaUser className="text-[#00D4AA]" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-gray-900">
                    {caseData.customer.firstName} {caseData.customer.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">{caseData.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-green-600 capitalize">
                    {caseData.customer.accountStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {new Date(caseData.customer.accountCreatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Risk Scores</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Fraud Likelihood</span>
                    <span className="font-bold text-red-600">{caseData.fraudLikelihoodScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${caseData.fraudLikelihoodScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Friendly Fraud Probability</span>
                    <span className="font-bold text-amber-600">{caseData.friendlyFraudProbability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${caseData.friendlyFraudProbability}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs and Content */}
          <div className="col-span-2 space-y-4">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {(['summary', 'evidence', 'timeline', 'notes'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-[#00D4AA] border-b-2 border-[#00D4AA] bg-teal-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Customer Claim</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {caseData.customerClaim}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          caseData.recommendedAction === 'approve'
                            ? 'bg-green-50 border-green-200'
                            : caseData.recommendedAction === 'deny'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-2 capitalize">
                          {caseData.recommendedAction}
                        </div>
                        <p className="text-sm text-gray-700">
                          {caseData.riskAssessment?.analystNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evidence Tab */}
                {activeTab === 'evidence' && (
                  <div className="space-y-4">
                    {/* Merchant Intelligence */}
                    <EvidenceCard
                      title="Merchant Intelligence"
                      icon={<FaCreditCard />}
                      defaultExpanded={true}
                    >
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-gray-600 mb-1">Decoded Name</div>
                            <div className="font-medium text-gray-900">
                              {caseData.merchantIntelligence?.decodedMerchantName}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Type</div>
                            <div className="font-medium text-gray-900">
                              {caseData.merchantIntelligence?.merchantType}
                            </div>
                          </div>
                        </div>

                        {caseData.merchantIntelligence?.isSubscription && (
                          <div className="bg-amber-50 border border-amber-200 rounded p-2">
                            <div className="font-medium text-amber-900">Subscription Detected</div>
                            <div className="text-amber-700 text-xs mt-1">
                              {caseData.merchantIntelligence.subscriptionPattern}
                            </div>
                          </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <div className="text-blue-900 text-xs">
                            {caseData.merchantIntelligence?.contextualNote}
                          </div>
                        </div>
                      </div>
                    </EvidenceCard>

                    {/* GPS Correlation */}
                    <EvidenceCard
                      title="GPS Location Analysis"
                      icon={<FaMapMarkerAlt />}
                      score={caseData.evidenceCorrelation?.gpsCorrelation.correlationScore}
                      defaultExpanded={true}
                    >
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          {caseData.evidenceCorrelation?.gpsCorrelation.matched ? (
                            <FaCheckCircle className="text-green-600" />
                          ) : (
                            <FaExclamationTriangle className="text-red-600" />
                          )}
                          <span className={caseData.evidenceCorrelation?.gpsCorrelation.matched ? 'text-green-700' : 'text-red-700'}>
                            {caseData.evidenceCorrelation?.gpsCorrelation.matched ? 'Location Match' : 'Location Mismatch'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-600">Customer Location</div>
                            <div className="text-gray-900">
                              {caseData.evidenceCorrelation?.gpsCorrelation.customerLocationAtTime}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Transaction Location</div>
                            <div className="text-gray-900">
                              {caseData.evidenceCorrelation?.gpsCorrelation.transactionLocation}
                            </div>
                          </div>
                        </div>

                        {caseData.evidenceCorrelation?.gpsCorrelation.distanceInMiles > 0 && (
                          <div className="text-xs text-gray-600">
                            Distance: {caseData.evidenceCorrelation.gpsCorrelation.distanceInMiles} miles
                          </div>
                        )}
                      </div>
                    </EvidenceCard>

                    {/* Device Correlation */}
                    <EvidenceCard
                      title="Device Fingerprint Analysis"
                      icon={<FaMobileAlt />}
                      score={caseData.evidenceCorrelation?.deviceCorrelation.correlationScore}
                    >
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          {caseData.evidenceCorrelation?.deviceCorrelation.matched ? (
                            <FaCheckCircle className="text-green-600" />
                          ) : (
                            <FaExclamationTriangle className="text-red-600" />
                          )}
                          <span className={caseData.evidenceCorrelation?.deviceCorrelation.matched ? 'text-green-700' : 'text-red-700'}>
                            {caseData.evidenceCorrelation?.deviceCorrelation.matched ? 'Known Device' : 'Unknown Device'}
                          </span>
                        </div>

                        <div className="text-xs">
                          <div className="text-gray-600 mb-1">Transaction Device</div>
                          <div className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {caseData.evidenceCorrelation?.deviceCorrelation.transactionDeviceId}
                          </div>
                        </div>
                      </div>
                    </EvidenceCard>

                    {/* Risk Assessment */}
                    <EvidenceCard
                      title="Risk Assessment"
                      icon={<FaShieldAlt />}
                    >
                      <div className="space-y-3 text-sm">
                        {caseData.riskAssessment?.riskFactors?.length > 0 && (
                          <div>
                            <div className="font-medium text-red-900 mb-1">Risk Factors</div>
                            <ul className="list-disc list-inside space-y-1 text-red-700">
                              {caseData.riskAssessment.riskFactors.map((factor: string, i: number) => (
                                <li key={i} className="text-xs">{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {caseData.riskAssessment?.protectiveFactors?.length > 0 && (
                          <div>
                            <div className="font-medium text-green-900 mb-1">Protective Factors</div>
                            <ul className="list-disc list-inside space-y-1 text-green-700">
                              {caseData.riskAssessment.protectiveFactors.map((factor: string, i: number) => (
                                <li key={i} className="text-xs">{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </EvidenceCard>
                  </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    {caseData.intakeConversation?.map((msg: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-[#00D4AA]" />
                          {index < caseData.intakeConversation.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {msg.role}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Analyst Notes
                      </label>
                      <textarea
                        value={analystNotes}
                        onChange={(e) => setAnalystNotes(e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent"
                        placeholder="Add your notes about this case..."
                      />
                    </div>

                    {caseData.riskAssessment?.provisionalCreditRecommendation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">AI Recommendation</h4>
                        <p className="text-sm text-blue-700">
                          {caseData.riskAssessment.provisionalCreditRecommendation.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Decision Panel */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Make Decision</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setDecision('approve')}
                  className={`px-6 py-4 rounded-lg font-medium transition-all ${
                    decision === 'approve'
                      ? 'bg-green-600 text-white ring-2 ring-green-600 ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <FaCheckCircle className="inline mr-2" />
                  Approve & Credit
                </button>

                <button
                  onClick={() => setDecision('deny')}
                  className={`px-6 py-4 rounded-lg font-medium transition-all ${
                    decision === 'deny'
                      ? 'bg-red-600 text-white ring-2 ring-red-600 ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                  }`}
                >
                  <FaExclamationTriangle className="inline mr-2" />
                  Deny Dispute
                </button>
              </div>

              <button
                onClick={handleProcessDecision}
                disabled={!decision || isProcessing}
                className="w-full px-6 py-4 bg-[#00D4AA] text-white rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Process Decision'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
