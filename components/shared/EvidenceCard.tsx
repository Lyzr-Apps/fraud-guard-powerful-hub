/**
 * Evidence Card Component
 *
 * Displays investigation evidence in a collapsible card format
 */

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface EvidenceCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  score?: number;
  className?: string;
}

export function EvidenceCard({
  title,
  icon,
  children,
  defaultExpanded = false,
  score,
  className,
}: EvidenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('border border-gray-200 rounded-lg bg-white', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-600">{icon}</span>}
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {score !== undefined && (
            <span
              className={cn(
                'text-sm font-medium px-2 py-1 rounded',
                score >= 80
                  ? 'bg-green-100 text-green-800'
                  : score >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              Score: {score}
            </span>
          )}
          {isExpanded ? (
            <FaChevronUp className="text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}
