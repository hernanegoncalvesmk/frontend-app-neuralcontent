"use client";

import { useTranslation } from 'react-i18next';
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
  const { t: tBilling } = useTranslation('billing');
  
  const periods = [
    { key: 'monthly' as BillingPeriod, label: tBilling('periods.monthly'), icon: 'calendar_today' },
    { key: 'quarterly' as BillingPeriod, label: tBilling('periods.quarterly'), icon: 'calendar_view_month', discount: discounts.quarterly },
    { key: 'annual' as BillingPeriod, label: tBilling('periods.annual'), icon: 'calendar_view_year', discount: discounts.annual }
  ];

  return (
    <div className="flex justify-center mb-12 sm:mb-16 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => onPeriodChange(period.key)}
              className={`
                relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex-1 min-h-[60px] sm:min-w-[140px]
                ${currentPeriod === period.key
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex flex-col items-center">
                <span className="material-icons mb-1 text-lg">{period.icon}</span>
                <span>{period.label}</span>
                {period.discount && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    -{period.discount}%
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* Texto explicativo */}
        <div className="text-center mt-3 sm:mt-4 px-2 sm:px-4">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            💡 <strong>Dica:</strong> Planos trimestrais e anuais incluem desconto automático
          </p>
        </div>
      </div>
    </div>
  );
}
