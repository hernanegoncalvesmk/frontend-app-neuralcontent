"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarMenuProps {
  toggleActive: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleActive }) => {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="sidebar-area fixed top-0 left-0 w-[260px] h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300">
      {/* Burger Menu Icon (only visible on mobile when sidebar is open) */}
      <div className="burger-menu md:hidden">
        <button 
          className="p-3"
          onClick={toggleActive}
        >
          <span className="material-symbols-outlined text-gray-600">
            close
          </span>
        </button>
      </div>

      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Trezo</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-custom-scrollbar h-full overflow-y-auto">
        <nav className="p-4">
          <div className="accordion">
            {/* Dashboard */}
            <div className="accordion-item mb-2">
              <Link 
                href="/dashboard"
                className={`accordion-button flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  isActive("/dashboard") 
                    ? "bg-gray-50 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span className="material-symbols-outlined mr-3">
                  dashboard
                </span>
                <span className="font-medium">Dashboard</span>
              </Link>
            </div>

            {/* Profile */}
            <div className="accordion-item mb-2">
              <Link 
                href="/profile"
                className={`accordion-button flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  isActive("/profile") 
                    ? "bg-gray-50 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span className="material-symbols-outlined mr-3">
                  person
                </span>
                <span className="font-medium">Profile</span>
              </Link>
            </div>

            {/* Settings */}
            <div className="accordion-item mb-2">
              <Link 
                href="/settings"
                className={`accordion-button flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  isActive("/settings") 
                    ? "bg-gray-50 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span className="material-symbols-outlined mr-3">
                  settings
                </span>
                <span className="font-medium">Settings</span>
              </Link>
            </div>

            {/* Apps with Accordion */}
            <div className="accordion-item mb-2">
              <button
                className={`accordion-button toggle flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 relative ${
                  openAccordion === "apps" 
                    ? "open bg-gray-50 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
                onClick={() => toggleAccordion("apps")}
              >
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-3">
                    apps
                  </span>
                  <span className="font-medium">Apps</span>
                </div>
              </button>
              
              {openAccordion === "apps" && (
                <div className="accordion-content ml-4 mt-2">
                  <Link 
                    href="/apps/email"
                    className="flex items-center p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined mr-2 text-lg">
                      email
                    </span>
                    Email
                  </Link>
                  <Link 
                    href="/apps/chat"
                    className="flex items-center p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined mr-2 text-lg">
                      chat
                    </span>
                    Chat
                  </Link>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="accordion-item mb-2">
              <Link 
                href="/auth/logout"
                className="accordion-button flex items-center w-full p-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <span className="material-symbols-outlined mr-3">
                  logout
                </span>
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidebarMenu;
