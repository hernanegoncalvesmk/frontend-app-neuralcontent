"use client";

import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="footer-area bg-white dark:bg-[#0c1427] text-black dark:text-white border-t border-gray-100 dark:border-[#172036] py-[20px] px-[25px]">
        <div className="flex items-center justify-between">
          <p className="text-[13px] md:text-[14px]">
            © {currentYear} Neural Content. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center space-x-[15px]">
            <a
              href="#"
              className="text-[13px] md:text-[14px] hover:text-primary-500 transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-[13px] md:text-[14px] hover:text-primary-500 transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="#"
              className="text-[13px] md:text-[14px] hover:text-primary-500 transition-colors"
            >
              Suporte
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
