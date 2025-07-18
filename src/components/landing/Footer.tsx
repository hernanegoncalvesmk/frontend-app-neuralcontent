"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/providers/TranslationProvider";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const t = useT();

  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          {/* Main Footer Content */}
          <div className="py-[60px] md:py-[80px] border-b border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] md:gap-[50px]">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <Link href="/" className="inline-block mb-[20px]">
                  <div className="flex items-center">
                    <Image
                      src="/images/logo-icon.svg"
                      alt="Neural Content Logo"
                      width={32}
                      height={32}
                      className="ltr:mr-2 rtl:ml-2"
                    />
                    <span className="text-xl font-bold text-white">
                      Neural Content
                    </span>
                  </div>
                </Link>
                <p className="text-gray-400 leading-relaxed mb-[20px] text-[14px] md:text-[15px]">
                  {t('landing.footer.description')}
                </p>
                <div className="flex gap-[15px]">
                  <a
                    href="#"
                    className="w-[40px] h-[40px] bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all"
                  >
                    <i className="material-symbols-outlined !text-[18px]">facebook</i>
                  </a>
                  <a
                    href="#"
                    className="w-[40px] h-[40px] bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all"
                  >
                    <span className="text-[14px] font-bold">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className="w-[40px] h-[40px] bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all"
                  >
                    <i className="material-symbols-outlined !text-[18px]">link</i>
                  </a>
                  <a
                    href="#"
                    className="w-[40px] h-[40px] bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all"
                  >
                    <i className="material-symbols-outlined !text-[18px]">mail</i>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-white font-semibold mb-[20px] text-[16px] md:text-[17px]">
                  {t('landing.footer.product')}
                </h3>
                <ul className="space-y-[12px]">
                  <li>
                    <Link href="/billing/plans" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.plansAndPricing')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#features" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.features')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.freeTrial')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.integrations')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-white font-semibold mb-[20px] text-[16px] md:text-[17px]">
                  {t('landing.footer.company')}
                </h3>
                <ul className="space-y-[12px]">
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.aboutUs')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.blog')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.careers')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#contact" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-white font-semibold mb-[20px] text-[16px] md:text-[17px]">
                  {t('landing.footer.support')}
                </h3>
                <ul className="space-y-[12px]">
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.helpCenter')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.documentation')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.systemStatus')}
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary-400 transition-all text-[14px] md:text-[15px]">
                      {t('landing.footer.community')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-[25px] md:py-[30px]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-[15px]">
              <p className="text-gray-400 text-[13px] md:text-[14px] text-center md:text-left">
                © {currentYear} Neural Content. {t('landing.footer.allRightsReserved')}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-[20px] md:gap-[30px]">
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-all text-[13px] md:text-[14px]">
                  {t('landing.footer.privacyPolicy')}
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-all text-[13px] md:text-[14px]">
                  {t('landing.footer.termsOfUse')}
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary-400 transition-all text-[13px] md:text-[14px]">
                  {t('landing.footer.cookies')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
