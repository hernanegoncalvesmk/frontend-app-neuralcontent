"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "Início", path: "/" },
  { name: "Recursos", path: "#features" },
  { name: "Planos", path: "/billing/plans" },
  { name: "Contato", path: "#contact" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleToggle = () => setMenuOpen(!isMenuOpen);

  // handleScroll
  useEffect(() => {
    const elementId = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 100) {
        elementId?.classList.add("is-sticky");
      } else {
        elementId?.classList.remove("is-sticky");
      }
    };

    document.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        #navbar.is-sticky {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .dark #navbar.is-sticky {
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      
      <div
        className="fixed top-0 right-0 left-0 transition-all h-auto z-[5] py-[20px]"
        id="navbar"
      >
        <div className="container 2xl:max-w-[1320px] mx-auto px-[12px]">
          <div className="flex items-center relative flex-wrap lg:flex-nowrap justify-between lg:justify-start">
            <Link
              href="/"
              className="inline-block max-w-[180px] ltr:mr-[15px] rtl:ml-[15px]"
            >
              <div className="flex items-center">
                <Image
                  src="/images/logo-icon.svg"
                  alt="Neural Content Logo"
                  width={32}
                  height={32}
                  className="ltr:mr-2 rtl:ml-2"
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Neural Content
                </span>
              </div>
            </Link>

            <button
              type="button"
              className="inline-block relative leading-none lg:hidden"
              onClick={handleToggle}
            >
              <span className="h-[3px] w-[30px] my-[5px] block bg-black dark:bg-white"></span>
              <span className="h-[3px] w-[30px] my-[5px] block bg-black dark:bg-white"></span>
              <span className="h-[3px] w-[30px] my-[5px] block bg-black dark:bg-white"></span>
            </button>

            {/* For Big Devices */}
            <div className="hidden lg:flex items-center grow basis-full">
              <ul className="flex ltr:ml-[30px] rtl:mr-[30px] ltr:xl:ml-[55px] rtl:xl:mr-[55px] flex-row gap-[30px] xl:gap-[50px]">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`font-medium transition-all hover:text-primary-600 text-[15px] xl:text-md dark:text-gray-400 ${
                        pathname === item.path
                          ? "text-primary-600 dark:text-primary-600"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center ltr:ml-auto rtl:mr-auto gap-[15px]">
                <Link
                  href="/auth/login"
                  className="font-medium py-[8px] px-[20px] text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="font-medium py-[8px] px-[20px] bg-primary-600 text-white rounded-md transition-all hover:bg-primary-500"
                >
                  Começar Grátis
                </Link>
              </div>
            </div>

            {/* For Small Devices */}
            <div
              className={`lg:hidden flex items-center absolute top-full bg-white dark:bg-gray-900 left-0 w-full py-[15px] px-[15px] border-t border-gray-200 dark:border-gray-700 ${
                isMenuOpen ? "block" : "hidden"
              }`}
            >
              <ul className="flex flex-col gap-[15px] w-full">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`font-medium transition-all hover:text-primary-600 text-[15px] dark:text-gray-400 block ${
                        pathname === item.path
                          ? "text-primary-600 dark:text-primary-600"
                          : ""
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="flex gap-[10px] mt-[10px]">
                  <Link
                    href="/auth/login"
                    className="font-medium py-[8px] px-[15px] text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-all hover:bg-gray-50 dark:hover:bg-gray-800 text-center flex-1"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/register"
                    className="font-medium py-[8px] px-[15px] bg-primary-600 text-white rounded-md transition-all hover:bg-primary-500 text-center flex-1"
                  >
                    Começar Grátis
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
