/**
 * Risk Badge Component
 *
 * Displays risk level with appropriate color coding
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RiskBadge({ level, size = 'md', className }: RiskBadgeProps) {
  const colorClasses = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
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
        colorClasses[level],
        sizeClasses[size],
        className
      )}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  );
}
