'use client';

/**
 * Customer Dispute Intake Screen (Mobile-optimized)
 *
 * Conversational dispute filing interface
 */

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCreditCard, FaMapMarkerAlt, FaCalendar, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

interface ChatMessage {
  role: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

export default function DisputeIntakePage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'Let\'s help you understand this charge. I\'ll need to ask you a few questions.',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState<any>(null);

  // Mock transaction data
  const transaction = {
    id: transactionId,
    rawMerchantDescriptor: 'SQ *JOES COFFEE',
    amount: 6.50,
    date: '2026-01-30',
    time: '08:45 AM',
    location: '123 Main St, San Francisco, CA',
    status: 'completed',
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'customer',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate agent response
    setTimeout(() => {
      // Check if we should show merchant intelligence
      if (messages.length === 1) {
        // First response - decode merchant name
        const agentResponse: ChatMessage = {
          role: 'agent',
          content: 'I can help you with that. This appears to be Joe\'s Coffee Shop on Main Street. Have you visited this location before?',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentResponse]);
        setMerchantInfo({
          decodedName: 'Joe\'s Coffee Shop',
          location: '123 Main St, San Francisco',
          type: 'Coffee Shop',
          visits: 12,
        });
        setShowEvidence(true);
      } else if (inputMessage.toLowerCase().includes('no') || inputMessage.toLowerCase().includes('don\'t recognize')) {
        // Customer doesn't recognize - proceed with dispute
        const agentResponse: ChatMessage = {
          role: 'agent',
          content: 'I understand. Let me gather some information to help investigate this charge. I\'ll check your location history and device records for this transaction.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentResponse]);

        // Simulate investigation
        setTimeout(() => {
          handleCreateDispute();
        }, 2000);
      } else {
        // Customer recognizes charge
        const agentResponse: ChatMessage = {
          role: 'agent',
          content: 'Great! It looks like this is a charge you recognize. Is there anything else I can help you with?',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentResponse]);
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleCreateDispute = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/disputes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transaction.id,
          customerId: 'customer-1',
          customerMessage: messages.find(m => m.role === 'customer')?.content || 'I don\'t recognize this charge',
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/customer/dispute/${data.dispute.id}/resolution`);
      }
    } catch (error) {
      console.error('Failed to create dispute:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dispute Charge</h1>
              <p className="text-sm text-gray-500">Case assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Card - Pinned */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-[#00D4AA] to-teal-500 rounded-lg p-4 text-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <FaCreditCard className="text-xl" />
                <span className="font-medium">Transaction Details</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${transaction.amount.toFixed(2)}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="opacity-90">{transaction.rawMerchantDescriptor}</span>
              </div>
              {merchantInfo && (
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="font-medium">{merchantInfo.decodedName}</span>
                </div>
              )}
              <div className="flex items-center gap-3 opacity-90">
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-xs" />
                  {transaction.date}
                </span>
                <span>{transaction.time}</span>
              </div>
              <div className="flex items-center gap-1 opacity-90">
                <FaMapMarkerAlt className="text-xs" />
                <span>{transaction.location}</span>
              </div>
            </div>
          </div>

          {showEvidence && merchantInfo && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Our records show:</p>
                  <p className="text-blue-700 mt-1">
                    You've visited this location {merchantInfo.visits} times in the past 6 months
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'customer' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'customer'
                    ? 'bg-[#00D4AA] text-white'
                    : message.role === 'system'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'customer'
                      ? 'text-white/70'
                      : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reply Buttons */}
      {!isLoading && messages.length > 1 && messages.length < 4 && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickReply('Yes, I recognize this charge')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors"
              >
                Yes, I recognize this
              </button>
              <button
                onClick={() => handleQuickReply('No, I don\'t recognize this charge')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors"
              >
                No, I don't recognize this
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-[#00D4AA] text-white rounded-full font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
