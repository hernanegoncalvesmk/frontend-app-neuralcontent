"use client";

import React from "react";

const CreditUsage: React.FC = () => {
  const currentCredits = 1250;
  const totalCredits = 2000;
  const usagePercentage = Math.round((currentCredits / totalCredits) * 100);

  const usageByType = [
    {
      type: "Artigos",
      used: 450,
      percentage: 36,
      color: "bg-blue-600"
    },
    {
      type: "Posts Sociais",
      used: 280,
      percentage: 22.4,
      color: "bg-green-600"
    },
    {
      type: "E-mails",
      used: 120,
      percentage: 9.6,
      color: "bg-orange-600"
    },
    {
      type: "Outros",
      used: 150,
      percentage: 12,
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-[20px] md:p-[25px] rounded-md">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Uso de Créditos
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Este mês
        </span>
      </div>

      {/* Círculo de progresso */}
      <div className="flex items-center justify-center mb-[25px]">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - usagePercentage / 100)}`}
              className="text-blue-600"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentCredits}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                de {totalCredits}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de uso por tipo */}
      <div className="space-y-[12px]">
        {usageByType.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-[8px]">
              <div className={`w-[8px] h-[8px] rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.type}
              </span>
            </div>
            <div className="flex items-center space-x-[8px]">
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {item.used}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Botão de upgrade */}
      <div className="mt-[20px] pt-[15px] border-t border-gray-200 dark:border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-[8px] px-[16px] rounded-md text-sm font-medium transition-colors">
          Upgrade do Plano
        </button>
      </div>
    </div>
  );
};

export default CreditUsage;
