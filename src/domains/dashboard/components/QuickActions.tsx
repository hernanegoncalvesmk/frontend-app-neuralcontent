"use client";

import React from "react";
import Link from "next/link";

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Novo Artigo",
      description: "Gere um artigo completo",
      icon: "article",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      href: "/dashboard/generate/article"
    },
    {
      title: "Post Social",
      description: "Crie posts para redes sociais",
      icon: "share",
      iconBg: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
      href: "/dashboard/generate/social"
    },
    {
      title: "E-mail Marketing",
      description: "Escreva e-mails persuasivos",
      icon: "mail",
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
      href: "/dashboard/generate/email"
    },
    {
      title: "Descrição Produto",
      description: "Descreva produtos de forma atrativa",
      icon: "inventory",
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      href: "/dashboard/generate/product"
    },
    {
      title: "Reescrever Texto",
      description: "Melhore textos existentes",
      icon: "edit_note",
      iconBg: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600",
      href: "/dashboard/generate/rewrite"
    },
    {
      title: "Traduzir",
      description: "Traduza para outros idiomas",
      icon: "translate",
      iconBg: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600",
      href: "/dashboard/generate/translate"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-[20px] md:p-[25px] rounded-md">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Ações Rápidas
        </h3>
        <Link 
          href="/dashboard/generate" 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group p-[16px] border border-gray-200 dark:border-gray-700 rounded-md hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200"
          >
            <div className="flex items-start space-x-[12px]">
              <div className={`w-[36px] h-[36px] ${action.iconBg} ${action.iconColor} rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <i className="material-symbols-outlined text-[18px]">{action.icon}</i>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-[2px] group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="material-symbols-outlined text-blue-600 text-[16px]">arrow_forward</i>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
