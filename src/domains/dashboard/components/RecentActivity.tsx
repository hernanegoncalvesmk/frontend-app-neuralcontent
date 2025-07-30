"use client";

import React from "react";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "article",
      title: "Artigo sobre IA",
      description: "Novo artigo gerado sobre inteligência artificial",
      time: "há 2 horas",
      icon: "article",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600"
    },
    {
      id: "2",
      type: "social",
      title: "Post LinkedIn",
      description: "Post para LinkedIn sobre marketing digital",
      time: "há 4 horas",
      icon: "share",
      iconBg: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600"
    },
    {
      id: "3",
      type: "email",
      title: "E-mail promocional",
      description: "E-mail de promoção para Black Friday",
      time: "há 6 horas",
      icon: "mail",
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600"
    },
    {
      id: "4",
      type: "product",
      title: "Descrição de produto",
      description: "Descrição para smartphone Galaxy S24",
      time: "ontem",
      icon: "inventory",
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600"
    },
    {
      id: "5",
      type: "blog",
      title: "Post de blog",
      description: "Post sobre tendências de e-commerce 2024",
      time: "ontem",
      icon: "edit_note",
      iconBg: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-[20px] md:p-[25px] rounded-md">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Atividade Recente
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Ver tudo
        </button>
      </div>

      <div className="space-y-[15px]">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-[12px]">
            <div className={`w-[36px] h-[36px] ${activity.iconBg} ${activity.iconColor} rounded-md flex items-center justify-center flex-shrink-0`}>
              <i className="material-symbols-outlined text-[18px]">{activity.icon}</i>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-[2px]">
                {activity.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-[2px]">
                {activity.description}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {activity.time}
              </span>
            </div>

            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <i className="material-symbols-outlined text-[16px]">more_vert</i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
