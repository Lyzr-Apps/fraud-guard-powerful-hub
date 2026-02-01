'use client';

/**
 * Varo Dispute Management System - Homepage
 *
 * Entry point for customer and analyst portals
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaShieldAlt,
  FaCreditCard,
  FaUserTie,
  FaChartLine,
  FaLock,
  FaRobot,
} from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00D4AA] to-teal-600 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Varo Dispute Management</h1>
                <p className="text-sm text-gray-500">AI-Powered Card Dispute Resolution</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Dispute Resolution Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform traditional dispute handling into an evidence-based investigation system
            powered by AI agents
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {/* Customer Portal */}
          <div
            onClick={() => router.push('/customer/dispute/txn-demo-001')}
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#00D4AA] hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#00D4AA] to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaCreditCard className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Portal</h3>
            <p className="text-gray-600 mb-6">
              File a dispute with our conversational AI assistant that helps you understand
              confusing charges and guides you through the process.
            </p>
            <div className="flex items-center text-[#00D4AA] font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Start Dispute</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Analyst Portal */}
          <div
            onClick={() => router.push('/analyst/dashboard')}
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#00D4AA] hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaUserTie className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Analyst Portal</h3>
            <p className="text-gray-600 mb-6">
              Review disputes with AI-gathered evidence, GPS correlation, and risk scoring
              to make faster, better decisions.
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Open Dashboard</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Agents Portal */}
          <div
            onClick={() => router.push('/agents')}
            className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#00D4AA] hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaRobot className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Agents</h3>
            <p className="text-gray-600 mb-6">
              View and manage the AI agent workflow that powers the intelligent dispute
              resolution system.
            </p>
            <div className="flex items-center text-orange-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>View Workflow</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaRobot className="text-blue-600 text-2xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Agent Investigation</h4>
              <p className="text-sm text-gray-600">
                5 specialized agents analyze merchant data, GPS, device fingerprints, and risk
                patterns in parallel
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-green-600 text-2xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Evidence-Based Scoring</h4>
              <p className="text-sm text-gray-600">
                GPS correlation, device matching, and behavioral analysis to detect friendly
                fraud patterns
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-purple-600 text-2xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Reg E Compliance</h4>
              <p className="text-sm text-gray-600">
                Automated deadline tracking and provisional credit processing to meet
                regulatory requirements
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D4AA]">85%</div>
            <div className="text-sm text-gray-600 mt-1">Faster Resolution</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D4AA]">7</div>
            <div className="text-sm text-gray-600 mt-1">Data Sources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D4AA]">92%</div>
            <div className="text-sm text-gray-600 mt-1">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00D4AA]">24/7</div>
            <div className="text-sm text-gray-600 mt-1">AI Availability</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Varo Card Dispute Management System</p>
            <p className="mt-1">Built with Next.js and AI Agent Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}
