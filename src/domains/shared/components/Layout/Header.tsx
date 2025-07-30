"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

interface HeaderProps {
  toggleActive: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleActive }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    const elementId = document.getElementById("header");
    const handleScroll = () => {
      if (window.scrollY > 100) {
        elementId?.classList.add("shadow-sm");
      } else {
        elementId?.classList.remove("shadow-sm");
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        id="header"
        className="header-area bg-white dark:bg-[#0c1427] py-[13px] px-[20px] md:px-[25px] fixed top-0 z-[6] rounded-b-md transition-all"
      >
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-center md:justify-normal">
            <div className="relative leading-none top-px ltr:mr-[13px] ltr:md:mr-[18px] ltr:lg:mr-[23px] rtl:ml-[13px] rtl:md:ml-[18px] rtl:lg:ml-[23px]">
              <button
                type="button"
                className="hide-sidebar-toggle transition-all inline-block hover:text-primary-500"
                onClick={toggleActive}
              >
                <i className="material-symbols-outlined !text-[20px]">menu</i>
              </button>
            </div>

            <form className="relative w-[250px] lg:w-[260px]">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-gray-50 border border-gray-50 h-[44px] rounded-md w-full block text-black pt-[11px] pb-[12px] px-[13px] md:px-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
              <button
                type="button"
                className="absolute text-primary-500 mt-[2px] ltr:right-[13px] ltr:md:right-[15px] rtl:left-[13px] rtl:md:left-[15px] top-1/2 -translate-y-1/2"
              >
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center md:justify-normal mt-[13px] md:mt-0">
            <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                className="light-dark-toggle leading-none inline-block transition-all relative top-[2px] text-[#fe7a36]"
              >
                <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">
                  light_mode
                </i>
              </button>
            </div>

            <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                className="leading-none inline-block transition-all relative top-[2px] hover:text-primary-500"
                aria-label="Tela cheia"
              >
                <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
                  fullscreen
                </i>
              </button>
            </div>

            <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                className="leading-none inline-block transition-all relative top-[2px] hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
                  notifications
                </i>
                <span className="top-[3px] ltr:right-[4px] rtl:left-[4px] w-[6px] h-[6px] rounded-full absolute bg-orange-500"></span>
              </button>
            </div>

            <div className="relative profile-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <div className="flex items-center -mx-[5px] relative ltr:pr-[14px] rtl:pl-[14px] text-black dark:text-white">
                <img
                  alt="admin-image"
                  width={35}
                  height={35}
                  className="w-[35px] h-[35px] md:w-[42px] md:h-[42px] rounded-full ltr:md:mr-[2px] ltr:lg:mr-[8px] rtl:md:ml-[2px] rtl:lg:ml-[8px] border-[2px] border-primary-200 inline-block"
                  src="/images/admin.png"
                />
                <span className="block font-semibold text-[0px] lg:text-base">
                  {user?.name || 'Usuário'}
                </span>
              </div>
            </div>

            <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                onClick={handleLogout}
                className="leading-none inline-block transition-all relative top-[2px] hover:text-red-500 text-red-400"
                title="Sair"
              >
                <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
                  logout
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
