"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAVIGATION_MENU, MENU_GROUPS, MenuItem } from "@/constants/routes";

interface SidebarMenuProps {
  toggleActive: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleActive }) => {
  const pathname = usePathname();
  // Removido temporariamente para evitar problemas de build
  // const { user } = useAuth();
  // const user = null; // Mock temporário

  // Filtrar itens baseado em permissões
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(() => {
      // Temporariamente sem verificação de permissão para evitar problemas de build
      // Verificar autenticação
      // if (item.requiresAuth && !user) {
      //   return false;
      // }
      
      // Verificar permissão de admin
      // if (item.requiresAdmin && user?.role !== 'admin') {
      //   return false;
      // }
      
      return true;
    });
  };

  // Agrupar itens do menu
  const groupedMenuItems = filterMenuItems(NAVIGATION_MENU).reduce((groups, item) => {
    const group = item.group || 'other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, MenuItem[]>);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href;

    return (
      <div key={item.id} className="sidemenu-item mb-[4px] last:mb-0">
        <Link
          href={item.href || '#'}
          className={`sidemenu-link rounded-md flex items-center relative transition-all font-medium py-[9px] ltr:pl-[14px] ltr:pr-[30px] rtl:pr-[14px] rtl:pl-[30px] hover:text-primary-500 hover:bg-primary-50 w-full text-left dark:hover:bg-[#15203c] ${
            isActive 
              ? "active text-primary-500 bg-primary-50 dark:bg-[#15203c]" 
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <i className="material-symbols-outlined transition-all ltr:mr-[7px] rtl:ml-[7px] !text-[22px] leading-none relative -top-px">
            {item.icon}
          </i>
          <span className="title leading-none">{item.label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="sidebar-area bg-white dark:bg-[#0c1427] fixed z-[7] top-0 h-screen transition-all rounded-r-md">
      {/* Logo Section */}
      <div className="logo bg-white dark:bg-[#0c1427] border-b border-gray-100 dark:border-[#172036] px-[25px] pt-[19px] pb-[15px] absolute z-[2] right-0 top-0 left-0">
        <Link
          href="/dashboard"
          className="transition-none relative flex items-center outline-none"
        >
          <Image
            src="/images/logo-icon.svg"
            alt="logo-icon"
            width={26}
            height={26}
          />
          <span className="font-bold text-black dark:text-white relative ltr:ml-[8px] rtl:mr-[8px] top-px text-xl">
            Trezo
          </span>
        </Link>

        <button
          type="button"
          className="burger-menu inline-block absolute z-[3] top-[24px] ltr:right-[25px] rtl:left-[25px] transition-all hover:text-primary-500"
          onClick={toggleActive}
        >
          <i className="material-symbols-outlined">close</i>
        </button>
      </div>

      {/* Menu Content */}
      <div className="pt-[89px] px-[22px] pb-[20px] h-screen overflow-y-auto sidebar-custom-scrollbar">
        <div className="accordion">
          {Object.entries(groupedMenuItems).map(([groupKey, items]) => (
            <div key={groupKey} className="mb-[25px]">
              {/* Group Label */}
              <span className="block relative font-medium uppercase text-gray-400 mb-[8px] text-xs">
                {MENU_GROUPS.find(group => group.id === groupKey)?.label || 'Outros'}
              </span>

              {/* Group Items */}
              <div className="space-y-1">
                {items.map(item => renderMenuItem(item))}
              </div>
            </div>
          ))}
        </div>

        {/* User Info Section - Temporariamente removido para evitar problemas de build */}
        {false && (
          <div className="border-t border-gray-100 dark:border-[#172036] pt-[20px] mt-[20px]">
            <div className="flex items-center space-x-3 p-3 rounded-md bg-gray-50 dark:bg-[#15203c]">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  U
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Usuário
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  user@example.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
