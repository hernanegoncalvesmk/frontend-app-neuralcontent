"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Dados estáticos para demonstração
  const userName = "Neural User";

  return (
    <div className="bg-blue-600 mb-[25px] p-[20px] md:p-[25px] rounded-md">
      <div className="relative ltr:md:pr-[230px] rtl:md:pl-[230px]">
        <div className="md:pt-[5px] md:pb-[5px]">
          <h5 className="!mb-[5px] md:!mb-[2px] !font-semibold !text-white">
            {getGreeting()}, <span className="text-orange-200">{userName}!</span>
          </h5>

          <p className="text-blue-100">
            Aqui está o que está acontecendo com sua conta Neural Content hoje.
          </p>

          <div className="border-t border-blue-500 mt-[15px] mb-[15px] md:mt-[30px] md:mb-[33px]"></div>

          <div className="sm:flex items-center">
            <div className="flex items-center ltr:sm:mr-[20px] ltr:2xl:mr-[40px] rtl:sm:ml-[20px] rtl:2xl:ml-[40px]">
              <div className="w-[42px] h-[42px] rtl:ml-[12px] ltr:mr-[12px] bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
                <i className="material-symbols-outlined">auto_awesome</i>
              </div>
              <div>
                <span className="text-[15px] md:text-base text-white block font-semibold mb-[1px] md:mb-0">
                  1,250 Créditos
                </span>
                <span className="block text-gray-200">
                  Disponíveis este mês
                </span>
              </div>
            </div>

            <div className="flex items-center mt-[15px] sm:mt-0">
              <div className="w-[42px] h-[42px] rtl:ml-[12px] ltr:mr-[12px] bg-yellow-50 text-yellow-600 rounded-md flex items-center justify-center">
                <i className="material-symbols-outlined">article</i>
              </div>
              <div>
                <span className="text-[15px] md:text-base text-white block font-semibold mb-[1px] md:mb-0">
                  25 Conteúdos
                </span>
                <span className="block text-gray-200">Gerados esta semana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center md:absolute ltr:right-0 rtl:left-0 md:max-w-[208.04px] md:top-1/2 md:-translate-y-1/2 mt-[20px] md:mt-0">
          <Image
            src="/images/welcome-neural.svg"
            className="inline-block"
            alt="welcome-image"
            width={418}
            height={336}
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
