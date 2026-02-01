'use client';

/**
 * Analyst Review Dashboard
 *
 * Three-column layout for efficient case triage and decision-making
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaFilter,
  FaClock,
  FaExclamationCircle,
  FaSearch,
  FaChartLine,
} from 'react-icons/fa';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface DisputeListItem {
  id: string;
  caseNumber: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  transaction: {
    merchantName?: string;
    rawMerchantDescriptor: string;
    amount: number;
  };
  status: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  fraudLikelihoodScore: number;
  friendlyFraudProbability: number;
  regEDeadline: Date;
  createdAt: Date;
}

export default function AnalystDashboard() {
  const router = useRouter();
  const [disputes, setDisputes] = useState<DisputeListItem[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, [filterStatus, filterRisk]);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterRisk !== 'all') params.append('riskLevel', filterRisk);

      const response = await fetch(`/api/disputes/list?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDisputes(data.disputes);
        if (data.disputes.length > 0 && !selectedDispute) {
          setSelectedDispute(data.disputes[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      dispute.caseNumber.toLowerCase().includes(query) ||
      `${dispute.customer.firstName} ${dispute.customer.lastName}`.toLowerCase().includes(query) ||
      dispute.transaction.merchantName?.toLowerCase().includes(query) ||
      dispute.transaction.rawMerchantDescriptor.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: disputes.length,
    underReview: disputes.filter(d => d.status === 'under_review').length,
    highRisk: disputes.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length,
    urgent: disputes.filter(d => {
      const deadline = new Date(d.regEDeadline);
      const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 3;
    }).length,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dispute Review Queue</h1>
            <p className="text-sm text-gray-500 mt-1">Varo Card Dispute Management</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.underReview}</div>
              <div className="text-xs text-gray-500">Under Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
              <div className="text-xs text-gray-500">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
              <div className="text-xs text-gray-500">Urgent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Case Queue */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Filters and Search */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4AA]"
              >
                <option value="all">All Status</option>
                <option value="under_review">Under Review</option>
                <option value="investigating">Investigating</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4AA]"
              >
                <option value="all">All Risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Case List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D4AA] mx-auto" />
                <p className="mt-4 text-sm text-gray-600">Loading cases...</p>
              </div>
            ) : filteredDisputes.length === 0 ? (
              <div className="p-8 text-center">
                <FaChartLine className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No cases found</p>
              </div>
            ) : (
              <div>
                {filteredDisputes.map((dispute) => {
                  const deadline = new Date(dispute.regEDeadline);
                  const daysLeft = Math.ceil(
                    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysLeft <= 3;

                  return (
                    <div
                      key={dispute.id}
                      onClick={() => {
                        setSelectedDispute(dispute.id);
                        router.push(`/analyst/case/${dispute.id}`);
                      }}
                      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedDispute === dispute.id ? 'bg-blue-50 border-l-4 border-l-[#00D4AA]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {dispute.customer.firstName} {dispute.customer.lastName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {dispute.caseNumber}
                          </div>
                        </div>
                        <RiskBadge level={dispute.riskLevel} size="sm" />
                      </div>

                      <div className="text-sm text-gray-700 mb-2 truncate">
                        {dispute.transaction.merchantName || dispute.transaction.rawMerchantDescriptor}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${dispute.transaction.amount.toFixed(2)}
                        </span>
                        <StatusBadge status={dispute.status as any} size="sm" />
                      </div>

                      {isUrgent && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                          <FaClock />
                          <span className="font-medium">{daysLeft} days left</span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>Fraud: {dispute.fraudLikelihoodScore}%</span>
                        <span>Friendly: {dispute.friendlyFraudProbability}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Case Preview (shown when no case is fully opened) */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FaExclamationCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select a case to review
            </h3>
            <p className="text-gray-500">
              Click on any case from the queue to view details and make a decision
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
