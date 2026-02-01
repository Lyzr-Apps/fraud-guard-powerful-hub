'use client';

/**
 * Customer Resolution Screen (Mobile)
 *
 * Shows dispute outcome with clear explanation
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
} from 'react-icons/fa';

interface ResolutionData {
  status: 'approved' | 'denied' | 'pending';
  provisionalCreditAmount?: number;
  outcomeMessage: string;
  explanation: string;
  timeline: Array<{
    date: string;
    event: string;
    status: string;
  }>;
  nextSteps: string[];
  estimatedResolutionDate?: string;
}

export default function ResolutionPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.id as string;

  const [resolution, setResolution] = useState<ResolutionData | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // Mock resolution data (in production, fetch from API)
    setResolution({
      status: 'approved',
      provisionalCreditAmount: 45.00,
      outcomeMessage: 'Your dispute has been approved',
      explanation: 'After reviewing the evidence, including GPS location data and device fingerprinting, we found strong indicators that this transaction was fraudulent. The transaction location did not match your whereabouts at the time, and the device used was not one of your registered devices.',
      timeline: [
        {
          date: '2026-01-29',
          event: 'Dispute filed',
          status: 'completed',
        },
        {
          date: '2026-01-29',
          event: 'Investigation started',
          status: 'completed',
        },
        {
          date: '2026-01-30',
          event: 'Analyst review completed',
          status: 'completed',
        },
        {
          date: '2026-01-30',
          event: 'Provisional credit issued',
          status: 'completed',
        },
        {
          date: '2026-03-15',
          event: 'Final resolution expected',
          status: 'pending',
        },
      ],
      nextSteps: [
        'Provisional credit of $45.00 will appear in your account within 1 business day',
        'We\'re filing a chargeback with the card network on your behalf',
        'You\'ll receive email updates as the investigation progresses',
        'No further action needed from you at this time',
      ],
      estimatedResolutionDate: '2026-03-15',
    });
  }, [disputeId]);

  if (!resolution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4AA] mx-auto" />
          <p className="mt-4 text-gray-600">Loading resolution...</p>
        </div>
      </div>
    );
  }

  const StatusIcon = resolution.status === 'approved'
    ? FaCheckCircle
    : resolution.status === 'denied'
    ? FaTimesCircle
    : FaClock;

  const statusColor =
    resolution.status === 'approved'
      ? 'text-green-600'
      : resolution.status === 'denied'
      ? 'text-red-600'
      : 'text-amber-600';

  const statusBgColor =
    resolution.status === 'approved'
      ? 'bg-green-50 border-green-200'
      : resolution.status === 'denied'
      ? 'bg-red-50 border-red-200'
      : 'bg-amber-50 border-amber-200';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/customer/disputes')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dispute Resolution</h1>
              <p className="text-sm text-gray-500">Case #{disputeId.slice(0, 12)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Status Card */}
        <div className={`rounded-lg border-2 p-6 ${statusBgColor}`}>
          <div className="flex items-start gap-4">
            <StatusIcon className={`text-4xl ${statusColor} mt-1`} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {resolution.outcomeMessage}
              </h2>
              {resolution.provisionalCreditAmount && (
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-600 mb-1">Provisional Credit</p>
                  <p className="text-3xl font-bold text-[#00D4AA]">
                    ${resolution.provisionalCreditAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Will appear in 1 business day
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-700">
                {resolution.status === 'approved'
                  ? 'We\'ve reviewed your case and approved your dispute claim.'
                  : resolution.status === 'denied'
                  ? 'After careful review, we were unable to approve your dispute.'
                  : 'Your dispute is being reviewed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaInfoCircle className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Why was this decision made?</h3>
            </div>
            {showExplanation ? (
              <FaChevronUp className="text-gray-400" />
            ) : (
              <FaChevronDown className="text-gray-400" />
            )}
          </button>

          {showExplanation && (
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-700 leading-relaxed">
                {resolution.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FaClock className="text-[#00D4AA]" />
            What happens next?
          </h3>
          <div className="space-y-2">
            {resolution.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#00D4AA] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Case Timeline</h3>
            {showTimeline ? (
              <FaChevronUp className="text-gray-400" />
            ) : (
              <FaChevronDown className="text-gray-400" />
            )}
          </button>

          {showTimeline && (
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="space-y-4">
                {resolution.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      {index < resolution.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900">{event.event}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Appeal Option (if denied) */}
        {resolution.status === 'denied' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">
              Don't agree with this decision?
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              If you believe this decision is incorrect, you can appeal this case and provide additional information.
            </p>
            <button className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
              Appeal This Decision
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Have questions about your case?</p>
          <button className="text-[#00D4AA] font-medium text-sm hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
