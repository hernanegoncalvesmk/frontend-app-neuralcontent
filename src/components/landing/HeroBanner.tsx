"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const HeroBanner: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="pt-[125px] md:pt-[145px] lg:pt-[185px] pb-[60px] md:pb-[80px] lg:pb-[100px]">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px] relative z-[1]">
          <div className="text-center mx-auto xl:max-w-[935px] mb-[30px] md:mb-[45px] lg:mb-[60px]">
            <h1 className="!text-[32px] md:!text-[40px] lg:!text-[50px] xl:!text-[60px] !mb-[13px] md:!mb-[22px] lg:!mb-[25px] xl:!mb-[30px] -tracking-[.5px] md:-tracking-[1px] xl:-tracking-[1.5px] !leading-[1.2] text-gray-900 dark:text-white">
              {t('landing.hero.title.main')}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {" "}{t('landing.hero.title.highlight')}
              </span>
            </h1>

            <p className="mx-auto leading-[1.6] md:text-[15px] lg:text-[16px] xl:text-[18px] md:max-w-[600px] lg:max-w-[650px] xl:max-w-[740px] xl:tracking-[.2px] text-gray-600 dark:text-gray-300">
              {t('landing.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-[15px] justify-center items-center mt-[25px] md:mt-[35px]">
              <Link
                href="/auth/register"
                className="inline-block lg:text-[15px] xl:text-[16px] py-[12px] px-[25px] bg-primary-600 text-white rounded-md transition-all font-medium hover:bg-primary-500 shadow-lg hover:shadow-xl"
              >
                <span className="inline-block relative ltr:pl-[30px] rtl:pr-[30px]">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px]">
                    auto_awesome
                  </i>
                  {t('landing.hero.buttons.startFree')}
                </span>
              </Link>
              
              <Link
                href="/billing/plans"
                className="inline-block lg:text-[15px] xl:text-[16px] py-[12px] px-[25px] border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-md transition-all font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20"
              >
                <span className="inline-block relative ltr:pl-[30px] rtl:pr-[30px]">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 !text-[20px]">
                    workspace_premium
                  </i>
                  {t('landing.hero.buttons.viewPlans')}
                </span>
              </Link>
            </div>

            <div className="flex justify-center items-center gap-[20px] mt-[20px] text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-[5px]">
                <i className="material-symbols-outlined !text-[16px] text-green-500">check_circle</i>
                <span>{t('landing.hero.benefits.noCredit')}</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <i className="material-symbols-outlined !text-[16px] text-green-500">check_circle</i>
                <span>{t('landing.hero.benefits.instantSetup')}</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <i className="material-symbols-outlined !text-[16px] text-green-500">check_circle</i>
                <span>{t('landing.hero.benefits.cancelAnytime')}</span>
              </div>
            </div>
          </div>

          <div className="text-center relative">
            <div className="inline-block relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-[8px] border border-gray-200 dark:border-gray-700">
              <div className="w-[848px] h-[585px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <i className="material-symbols-outlined text-[80px] text-gray-400 dark:text-gray-500 mb-4">dashboard</i>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('landing.hero.dashboard.title')}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{t('landing.hero.dashboard.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Elementos flutuantes */}
            <div className="absolute top-[10%] left-[5%] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 animate-bounce">
              <div className="flex items-center gap-2">
                <i className="material-symbols-outlined text-primary-600 !text-[20px]">psychology</i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('landing.hero.features.aiAdvanced')}</span>
              </div>
            </div>

            <div className="absolute top-[20%] right-[8%] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 animate-bounce" style={{animationDelay: '1s'}}>
              <div className="flex items-center gap-2">
                <i className="material-symbols-outlined text-green-500 !text-[20px]">speed</i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('landing.hero.features.superFast')}</span>
              </div>
            </div>

            <div className="absolute bottom-[15%] left-[10%] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700 animate-bounce" style={{animationDelay: '2s'}}>
              <div className="flex items-center gap-2">
                <i className="material-symbols-outlined text-purple-600 !text-[20px]">high_quality</i>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('landing.hero.features.highQuality')}</span>
              </div>
            </div>
          </div>

          {/* Background Shapes */}
          <div className="absolute -z-[1] ltr:-right-[30px] rtl:-left-[30px] bottom-[50px] blur-[150px] opacity-50">
            <div className="w-[685px] h-[685px] bg-gradient-to-r from-primary-400 to-purple-400 rounded-full"></div>
          </div>
          <div className="absolute -z-[1] ltr:left-[25px] rtl:right-[25px] -top-[210px] blur-[125px] opacity-30">
            <div className="w-[437px] h-[453px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
          </div>
          <div className="absolute -z-[1] ltr:right-[260px] rtl:left-[260px] -top-[125px] blur-[75px] opacity-40">
            <div className="w-[170px] h-[170px] bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
          </div>
          <div className="absolute -z-[1] ltr:-left-[50px] rtl:-right-[50px] bottom-0 blur-[75px] opacity-30">
            <div className="w-[658px] h-[656px] bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
