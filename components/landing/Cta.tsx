"use client";

import React from "react";
import Link from "next/link";

const Cta: React.FC = () => {
  return (
    <>
      <div className="py-[80px] md:py-[100px] lg:py-[120px] bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
          <div className="text-center max-w-[800px] mx-auto">
            <h2 className="text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] font-bold mb-[15px] md:mb-[20px] text-white">
              Pronto para Revolucionar sua Criação de Conteúdo?
            </h2>
            
            <p className="text-primary-100 mb-[25px] md:mb-[35px] text-[15px] md:text-[16px] lg:text-[17px] leading-relaxed max-w-[600px] mx-auto">
              Junte-se a milhares de criadores de conteúdo que já estão usando nossa IA para acelerar sua produtividade e criar conteúdo de alta qualidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-[15px] justify-center items-center">
              <Link
                href="/auth/register"
                className="inline-block py-[14px] px-[30px] bg-white text-primary-600 rounded-md transition-all font-semibold hover:bg-gray-50 shadow-lg hover:shadow-xl text-[15px] md:text-[16px]"
              >
                <span className="inline-block relative ltr:pl-[30px] rtl:pr-[30px]">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px]">
                    rocket_launch
                  </i>
                  Começar Gratuitamente
                </span>
              </Link>
              
              <Link
                href="/billing/plans"
                className="inline-block py-[14px] px-[30px] border-2 border-white text-white rounded-md transition-all font-semibold hover:bg-white hover:text-primary-600 text-[15px] md:text-[16px]"
              >
                <span className="inline-block relative ltr:pl-[30px] rtl:pr-[30px]">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px]">
                    workspace_premium
                  </i>
                  Ver Todos os Planos
                </span>
              </Link>
            </div>

            <div className="mt-[30px] md:mt-[40px]">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-[15px] sm:gap-[30px] text-primary-100 text-sm">
                <div className="flex items-center gap-[8px]">
                  <i className="material-symbols-outlined !text-[18px] text-green-300">verified</i>
                  <span>Teste grátis por 7 dias</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <i className="material-symbols-outlined !text-[18px] text-green-300">verified</i>
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <i className="material-symbols-outlined !text-[18px] text-green-300">verified</i>
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[100px] -right-[100px] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[30%] left-[15%] w-[250px] h-[250px] bg-white/5 rounded-full blur-2xl"></div>
      </div>
    </>
  );
};

export default Cta;
