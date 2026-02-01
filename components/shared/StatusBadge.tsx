/**
 * Status Badge Component
 *
 * Displays dispute status with appropriate styling
 */

import React from 'react';
import { cn } from '@/lib/utils';

type DisputeStatus =
  | 'intake'
  | 'investigating'
  | 'under_review'
  | 'approved'
  | 'denied'
  | 'appealed';

interface StatusBadgeProps {
  status: DisputeStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const colorClasses: Record<DisputeStatus, string> = {
    intake: 'bg-blue-100 text-blue-800 border-blue-200',
    investigating: 'bg-purple-100 text-purple-800 border-purple-200',
    under_review: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    denied: 'bg-red-100 text-red-800 border-red-200',
    appealed: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  const labelMap: Record<DisputeStatus, string> = {
    intake: 'Intake',
    investigating: 'Investigating',
    under_review: 'Under Review',
    approved: 'Approved',
    denied: 'Denied',
    appealed: 'Appealed',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        colorClasses[status],
        sizeClasses[size],
        className
      )}
    >
      {labelMap[status]}
    </span>
  );
}
