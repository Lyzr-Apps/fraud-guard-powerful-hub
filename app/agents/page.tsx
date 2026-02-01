'use client';

/**
 * Agents Tab - Workflow Visualization & Agent Management
 *
 * Displays AI agent workflows with visual canvas and agent management interface
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaProjectDiagram,
  FaRobot,
  FaCog,
  FaPlay,
  FaStop,
  FaExpand,
  FaCompress,
  FaPlus,
  FaMinus,
  FaCircle
} from 'react-icons/fa';

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  data?: any;
}

interface WorkflowEdge {
  source: string;
  target: string;
  label?: string;
}

export default function AgentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'plan' | 'agents' | 'app' | 'management'>('agents');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Workflow data from the dispute management system
  const workflowNodes: WorkflowNode[] = [
    { id: 'input', type: 'Input', label: 'Customer Dispute Input', position: { x: 100, y: 200 } },
    { id: 'case_manager', type: 'Agent', label: 'Case Manager Agent', position: { x: 350, y: 200 } },
    { id: 'merchant', type: 'Agent', label: 'Merchant Intelligence', position: { x: 600, y: 100 } },
    { id: 'evidence', type: 'Agent', label: 'Evidence Correlator', position: { x: 600, y: 200 } },
    { id: 'risk', type: 'Agent', label: 'Risk Scoring', position: { x: 600, y: 300 } },
    { id: 'resolution', type: 'Agent', label: 'Resolution Agent', position: { x: 850, y: 200 } },
    { id: 'output', type: 'Output', label: 'Resolution Output', position: { x: 1100, y: 200 } },
  ];

  const workflowEdges: WorkflowEdge[] = [
    { source: 'input', target: 'case_manager' },
    { source: 'case_manager', target: 'merchant' },
    { source: 'case_manager', target: 'evidence' },
    { source: 'case_manager', target: 'risk' },
    { source: 'merchant', target: 'resolution' },
    { source: 'evidence', target: 'resolution' },
    { source: 'risk', target: 'resolution' },
    { source: 'resolution', target: 'output' },
  ];

  const agents = [
    {
      id: 'case_manager',
      name: 'Case Manager Agent',
      status: 'active',
      type: 'Manager',
      description: 'Orchestrates dispute intake and coordinates sub-agents'
    },
    {
      id: 'merchant',
      name: 'Merchant Intelligence Agent',
      status: 'active',
      type: 'Sub-agent',
      description: 'Decodes merchant descriptors and transaction patterns'
    },
    {
      id: 'evidence',
      name: 'Evidence Correlator Agent',
      status: 'active',
      type: 'Sub-agent',
      description: 'Analyzes GPS, device, and behavioral evidence'
    },
    {
      id: 'risk',
      name: 'Risk Scoring Agent',
      status: 'active',
      type: 'Sub-agent',
      description: 'Calculates fraud probability and account health'
    },
    {
      id: 'resolution',
      name: 'Resolution Agent',
      status: 'active',
      type: 'Independent',
      description: 'Executes decisions and processes credits/chargebacks'
    },
  ];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  const handleFitView = () => setZoomLevel(1);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Input':
        return 'bg-blue-100 border-blue-400 text-blue-900';
      case 'Agent':
        return 'bg-green-100 border-green-400 text-green-900';
      case 'Output':
        return 'bg-purple-100 border-purple-400 text-purple-900';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-orange-600 rounded-lg flex items-center justify-center">
                <FaRobot className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Varo Dispute Management - AI Agents</h1>
                <div className="flex items-center gap-2 mt-1">
                  <FaCircle className="text-green-500 text-xs" />
                  <span className="text-sm text-gray-600">5 agents connected</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
                <FaPlay className="text-sm" />
                Test Workflow
              </button>
              <button className="px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                <FaPlus className="text-sm" />
                Create Agent
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'plan'
                  ? 'text-[#F97316] border-b-2 border-[#F97316]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plan
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'agents'
                  ? 'text-[#F97316] border-b-2 border-[#F97316]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setActiveTab('app')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'app'
                  ? 'text-[#F97316] border-b-2 border-[#F97316]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              App
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'management'
                  ? 'text-[#F97316] border-b-2 border-[#F97316]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Agent Management
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Agent List */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Active Agents ({agents.length})
            </h2>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAgent === agent.id
                      ? 'border-[#F97316] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaRobot className="text-[#F97316]" />
                      <span className="font-medium text-gray-900 text-sm">{agent.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <FaCircle className="text-[6px]" />
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">Type: {agent.type}</div>
                  <div className="text-xs text-gray-500">{agent.description}</div>
                </div>
              ))}
            </div>

            {/* Workflow Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Workflow Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Nodes:</span>
                  <span className="font-medium text-gray-900">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connections:</span>
                  <span className="font-medium text-gray-900">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Agents:</span>
                  <span className="font-medium text-green-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture:</span>
                  <span className="font-medium text-gray-900">Hybrid</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Workflow Canvas */}
        <div className="flex-1 relative">
          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              title="Zoom In"
            >
              <FaPlus className="text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              title="Zoom Out"
            >
              <FaMinus className="text-gray-600" />
            </button>
            <button
              onClick={handleFitView}
              className="px-3 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm text-sm font-medium text-gray-700"
              title="Fit View"
            >
              Fit
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <FaCompress className="text-gray-600" /> : <FaExpand className="text-gray-600" />}
            </button>
          </div>

          {/* Workflow Canvas */}
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            <svg
              className="w-full h-full"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            >
              {/* Draw Edges */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#9CA3AF" />
                </marker>
              </defs>

              {workflowEdges.map((edge, idx) => {
                const sourceNode = workflowNodes.find(n => n.id === edge.source);
                const targetNode = workflowNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const x1 = sourceNode.position.x + 100;
                const y1 = sourceNode.position.y + 30;
                const x2 = targetNode.position.x;
                const y2 = targetNode.position.y + 30;

                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}

              {/* Draw Nodes as foreignObject */}
              {workflowNodes.map((node) => (
                <foreignObject
                  key={node.id}
                  x={node.position.x}
                  y={node.position.y}
                  width="200"
                  height="60"
                >
                  <div
                    className={`w-full h-full rounded-lg border-2 px-4 py-2 shadow-lg cursor-pointer transition-transform hover:scale-105 ${getNodeColor(node.type)} ${
                      selectedAgent === node.id ? 'ring-2 ring-[#F97316] ring-offset-2' : ''
                    }`}
                    onClick={() => setSelectedAgent(node.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {node.type === 'Input' && <FaProjectDiagram className="text-sm" />}
                      {node.type === 'Agent' && <FaRobot className="text-sm" />}
                      {node.type === 'Output' && <FaCog className="text-sm" />}
                      <span className="text-xs font-semibold uppercase tracking-wide">{node.type}</span>
                    </div>
                    <div className="text-sm font-medium leading-tight">{node.label}</div>
                  </div>
                </foreignObject>
              ))}
            </svg>

            {/* Workflow Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Manager-Subagent + Independent Agent (Hybrid)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The Case Manager Agent orchestrates three sub-agents (Merchant Intelligence, Evidence Correlator, and Risk Scoring)
                in parallel. The Resolution Agent operates independently after human review to execute decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
