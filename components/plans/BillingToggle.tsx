"use client";

import { BillingPeriod } from '@/types/plans.types';

interface BillingToggleProps {
  currentPeriod: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
  discounts: {
    quarterly: number;
    annual: number;
  };
}

export default function BillingToggle({ 
  currentPeriod, 
  onPeriodChange, 
  discounts 
}: BillingToggleProps) {
  const periods = [
    { key: 'monthly' as BillingPeriod, label: 'Mensal' },
    { key: 'quarterly' as BillingPeriod, label: 'Trimestral', discount: discounts.quarterly },
    { key: 'annual' as BillingPeriod, label: 'Anual', discount: discounts.annual }
  ];

  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => onPeriodChange(period.key)}
            className={`
              relative px-6 py-3 text-sm font-medium rounded-md transition-all duration-200
              ${currentPeriod === period.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <span className="relative z-10">{period.label}</span>
            {period.discount && (
              <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                -{period.discount}% OFF
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
