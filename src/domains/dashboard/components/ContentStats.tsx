"use client";

import React from "react";

const ContentStats: React.FC = () => {
  const stats = [
    {
      title: "Artigos Gerados",
      value: "156",
      percentage: "+12.5%",
      percentageType: "positive",
      icon: "article",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      period: "este mês"
    },
    {
      title: "Posts de Rede Social",
      value: "84",
      percentage: "+8.2%",
      percentageType: "positive",
      icon: "share",
      iconBg: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
      period: "esta semana"
    },
    {
      title: "E-mails Marketing",
      value: "32",
      percentage: "+15.3%",
      percentageType: "positive",
      icon: "mail",
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
      period: "esta semana"
    },
    {
      title: "Descrições de Produto",
      value: "67",
      percentage: "+5.8%",
      percentageType: "positive",
      icon: "inventory",
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      period: "este mês"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] md:gap-[25px] mb-[25px]">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-center justify-between mb-[15px]">
            <div className={`w-[42px] h-[42px] ${stat.iconBg} ${stat.iconColor} rounded-md flex items-center justify-center`}>
              <i className="material-symbols-outlined">{stat.icon}</i>
            </div>
            
            <span className={`text-sm font-medium ${
              stat.percentageType === "positive" 
                ? "text-green-600" 
                : "text-red-600"
            }`}>
              {stat.percentage}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-[2px]">
              {stat.value}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {stat.title}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {stat.period}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentStats;
