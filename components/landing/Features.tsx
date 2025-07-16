"use client";

import React from "react";

const FEATURES = [
  {
    icon: "auto_awesome",
    title: "IA Avançada",
    description: "Tecnologia de ponta para geração de conteúdo com qualidade profissional e contexto relevante.",
    color: "text-primary-600"
  },
  {
    icon: "speed",
    title: "Geração Rápida",
    description: "Crie conteúdo em segundos, não em horas. Aumente sua produtividade exponencialmente.",
    color: "text-green-600"
  },
  {
    icon: "language",
    title: "Múltiplos Idiomas",
    description: "Suporte completo para português, inglês, espanhol e diversos outros idiomas.",
    color: "text-blue-600"
  },
  {
    icon: "palette",
    title: "Diversos Formatos",
    description: "Artigos, posts, emails, descrições de produtos, legendas e muito mais.",
    color: "text-purple-600"
  },
  {
    icon: "edit_note",
    title: "Editor Inteligente",
    description: "Refine e personalize seu conteúdo com ferramentas de edição avançadas.",
    color: "text-orange-600"
  },
  {
    icon: "cloud_sync",
    title: "Sincronização",
    description: "Acesse seus conteúdos de qualquer dispositivo com sincronização automática.",
    color: "text-cyan-600"
  }
];

const Features: React.FC = () => {
  return (
    <>
      <div id="features" className="py-[80px] md:py-[100px] lg:py-[120px] bg-gray-50 dark:bg-gray-900/50">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          <div className="text-center mb-[50px] md:mb-[70px] lg:mb-[90px]">
            <h2 className="text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] font-bold mb-[15px] md:mb-[20px] text-gray-900 dark:text-white">
              Recursos 
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Poderosos
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-[600px] mx-auto text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed">
              Descubra as funcionalidades que tornam o Neural Content a melhor escolha para criação de conteúdo automatizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-[35px] lg:gap-[40px]">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-[25px] md:p-[30px] lg:p-[35px] shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
              >
                <div className={`w-[60px] h-[60px] rounded-xl ${feature.color.replace('text-', 'bg-')}/10 flex items-center justify-center mb-[20px] group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`material-symbols-outlined ${feature.color} !text-[28px]`}>
                    {feature.icon}
                  </i>
                </div>
                
                <h3 className="text-[18px] md:text-[20px] font-semibold mb-[12px] text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[14px] md:text-[15px]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-[70px] md:mt-[90px] lg:mt-[110px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[30px] md:gap-[40px]">
              <div className="text-center">
                <div className="text-[32px] md:text-[36px] lg:text-[42px] font-bold text-primary-600 mb-[8px]">
                  10K+
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[14px] md:text-[15px]">
                  Conteúdos Gerados
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-[32px] md:text-[36px] lg:text-[42px] font-bold text-green-600 mb-[8px]">
                  500+
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[14px] md:text-[15px]">
                  Usuários Ativos
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-[32px] md:text-[36px] lg:text-[42px] font-bold text-blue-600 mb-[8px]">
                  98%
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[14px] md:text-[15px]">
                  Satisfação
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-[32px] md:text-[36px] lg:text-[42px] font-bold text-purple-600 mb-[8px]">
                  24/7
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[14px] md:text-[15px]">
                  Disponibilidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
