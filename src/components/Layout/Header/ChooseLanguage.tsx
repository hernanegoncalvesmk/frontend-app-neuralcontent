"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage, useT } from "@/providers/TranslationProvider";

const ChooseLanguage: React.FC = () => {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const t = useT();
  const [active, setActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = async (code: string) => {
    try {
      await changeLanguage(code);
      setActive(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleDropdownToggle = () => {
    setActive((prevState) => !prevState);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative language-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={handleDropdownToggle}
        className={`leading-none pr-[12px] inline-block transition-all relative top-[2px] hover:text-primary-500 ${
          active ? "active" : ""
        }`}
      >
        <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">
          translate
        </i>
        <i className="ri-arrow-down-s-line text-[15px] absolute -right-[3px] top-1/2 -translate-y-1/2 -mt-[2px]"></i>
      </button>

      {active && (
        <div className="language-menu-dropdown bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none pt-[13px] md:pt-[14px] absolute mt-[18px] md:mt-[21px] w-[200px] md:w-[240px] z-[1] top-full ltr:left-0 ltr:md:left-auto ltr:lg:right-0 rtl:right-0 rtl:md:right-auto rtl:lg:left-0 rounded-md">
          <span className="block text-black dark:text-white font-semibold px-[20px] pb-[14px] text-sm md:text-[15px]">
            {t('languages.chooseLang')}
          </span>

          <ul>
            {languages.filter(lang => lang.isActive).map((language) => (
              <li
                key={language.code}
                className="border-t border-dashed border-gray-100 dark:border-[#172036]"
              >
                <button
                  type="button"
                  className={`text-black dark:text-white px-[20px] py-[12px] d-block w-full font-medium hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all ${
                    currentLanguage === language.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <div className="flex items-center">
                    <span className="text-[20px] ltr:mr-[10px] rtl:ml-[10px]">
                      {language.flag}
                    </span>
                    <span className="flex-1 text-left">
                      {language.name}
                    </span>
                    {currentLanguage === language.code && (
                      <i className="material-symbols-outlined text-primary-500 !text-[16px]">
                        check
                      </i>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChooseLanguage;
