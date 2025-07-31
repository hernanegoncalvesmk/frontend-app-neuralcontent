"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/domains/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

interface HeaderProps {
  toggleActive: () => void;
}

// Notifications data
const notifications = [
  {
    id: "1",
    icon: "sms",
    color: "text-primary-500",
    message: "You have requested to <strong>withdrawal</strong>",
    time: "2 hrs ago",
    link: "/notifications",
  },
  {
    id: "2",
    icon: "person",
    color: "text-blue-500",
    message: "<strong>A new user</strong> added in Trezo",
    time: "3 hrs ago",
    link: "/notifications",
    isNew: true,
  },
  {
    id: "3",
    icon: "mark_email_unread",
    color: "text-green-500",
    message: "You have received a new <strong>message</strong>",
    time: "1 day ago",
    link: "/notifications",
  },
];

// Apps menu data
const appsMenu = [
  { icon: "mail", name: "Gmail", description: "Email Service", link: "https://gmail.com" },
  { icon: "chat", name: "Slack", description: "Team Chat", link: "https://slack.com" },
  { icon: "code", name: "GitHub", description: "Code Repository", link: "https://github.com" },
  { icon: "analytics", name: "Analytics", description: "Data Analysis", link: "/analytics" },
];

const Header: React.FC<HeaderProps> = ({ toggleActive }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // States for dropdowns
  const [profileMenuActive, setProfileMenuActive] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [appsMenuActive, setAppsMenuActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for dropdowns
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);

  // Dark mode initialization
  useEffect(() => {
    const storedPreference = localStorage.getItem("theme");
    if (storedPreference === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      if (isDarkMode) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  // Header scroll effect
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuActive(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsActive(false);
      }
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) {
        setAppsMenuActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fullscreen toggle
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <div
        id="header"
        className="header-area bg-white dark:bg-[#0c1427] py-[13px] px-[20px] md:px-[25px] fixed top-0 z-[6] rounded-b-md transition-all"
      >
        <div className="md:flex md:items-center md:justify-between">
          {/* Left side */}
          <div className="flex items-center justify-center md:justify-normal">
            {/* Sidebar toggle */}
            <div className="relative leading-none top-px ltr:mr-[13px] ltr:md:mr-[18px] ltr:lg:mr-[23px] rtl:ml-[13px] rtl:md:ml-[18px] rtl:lg:ml-[23px]">
              <button
                type="button"
                className="hide-sidebar-toggle transition-all inline-block hover:text-primary-500"
                onClick={toggleActive}
              >
                <i className="material-symbols-outlined !text-[20px]">menu</i>
              </button>
            </div>

            {/* Search form */}
            <form className="relative w-[250px] lg:w-[260px]">
              <input
                type="text"
                placeholder="Search here....."
                className="bg-gray-50 border border-gray-50 h-[44px] rounded-md w-full block text-black pt-[11px] pb-[12px] px-[13px] md:px-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
              <button
                type="button"
                className="absolute text-primary-500 mt-[2px] ltr:right-[13px] ltr:md:right-[15px] rtl:left-[13px] rtl:md:left-[15px] top-1/2 -translate-y-1/2"
              >
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </button>
            </form>

            {/* Apps menu */}
            <div
              className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
              ref={appsRef}
            >
              <button
                type="button"
                onClick={() => setAppsMenuActive(!appsMenuActive)}
                className="leading-none inline-block transition-all relative top-[2px] hover:text-primary-500"
              >
                <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">apps</i>
              </button>

              {appsMenuActive && (
                <div className="bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none py-[22px] absolute mt-[17px] md:mt-[20px] w-[280px] z-[1] top-full ltr:-left-[120px] ltr:md:left-0 rtl:-right-[120px] rtl:md:right-0 rounded-md">
                  <h4 className="text-black dark:text-white font-semibold text-lg px-[20px] mb-[15px]">
                    Apps
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 px-[20px]">
                    {appsMenu.map((app, index) => (
                      <Link
                        key={index}
                        href={app.link}
                        className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all text-center"
                        target={app.link.startsWith('http') ? '_blank' : '_self'}
                      >
                        <i className="material-symbols-outlined text-[28px] text-primary-500 mb-2">
                          {app.icon}
                        </i>
                        <span className="text-sm font-medium text-black dark:text-white">
                          {app.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {app.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-center md:justify-normal mt-[13px] md:mt-0">
            {/* Dark mode toggle */}
            <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                className="light-dark-toggle leading-none inline-block transition-all relative top-[2px] text-[#fe7a36] hover:text-primary-500"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">
                  {isDarkMode ? "dark_mode" : "light_mode"}
                </i>
              </button>
            </div>

            {/* Fullscreen toggle */}
            <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
              <button
                type="button"
                className="leading-none inline-block transition-all relative top-[2px] hover:text-primary-500"
                onClick={handleToggleFullscreen}
                aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
              >
                <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </i>
              </button>
            </div>

            {/* Notifications */}
            <div
              className="relative notifications-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
              ref={notificationsRef}
            >
              <button
                type="button"
                onClick={() => setNotificationsActive(!notificationsActive)}
                className={`leading-none inline-block transition-all relative top-[2px] hover:text-primary-500 ${
                  notificationsActive ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined !text-[22px] md:!text-[24px]">
                  notifications
                </i>
                <span className="top-[3px] ltr:right-[4px] rtl:left-[4px] w-[6px] h-[6px] rounded-full absolute bg-orange-500"></span>
              </button>

              {notificationsActive && (
                <div className="notifications-menu-dropdown bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none py-[17px] absolute mt-[17px] md:mt-[20px] w-[290px] md:w-[350px] z-[1] top-full ltr:-right-[120px] ltr:md:right-0 rtl:-left-[120px] rtl:md:left-0 rounded-md">
                  <div className="flex items-center justify-between px-[20px] pb-[17px]">
                    <h4 className="text-black dark:text-white font-semibold text-lg">
                      Notifications
                    </h4>
                    <button
                      type="button"
                      className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                      onClick={() => console.log("Clear all notifications")}
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.link}
                        className="flex items-start px-[20px] py-[12px] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all"
                      >
                        <div className="flex-shrink-0 ltr:mr-[12px] rtl:ml-[12px]">
                          <i className={`material-symbols-outlined !text-[20px] ${notification.color}`}>
                            {notification.icon}
                          </i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm text-black dark:text-white mb-1"
                            dangerouslySetInnerHTML={{ __html: notification.message }}
                          />
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                        {notification.isNew && (
                          <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-[#172036] mt-[15px] pt-[15px] px-[20px]">
                    <Link
                      href="/notifications"
                      className="block text-center text-primary-500 hover:text-primary-600 font-medium text-sm"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div
              className="relative profile-menu mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
              ref={profileRef}
            >
              <button
                type="button"
                onClick={() => setProfileMenuActive(!profileMenuActive)}
                className={`flex items-center -mx-[5px] relative ltr:pr-[14px] rtl:pl-[14px] text-black dark:text-white ${
                  profileMenuActive ? "active" : ""
                }`}
              >
                <img
                  src="/images/admin.png"
                  className="w-[35px] h-[35px] md:w-[42px] md:h-[42px] rounded-full ltr:md:mr-[2px] ltr:lg:mr-[8px] rtl:md:ml-[2px] rtl:lg:ml-[8px] border-[2px] border-primary-200 inline-block"
                  alt="admin-image"
                  width={35}
                  height={35}
                />
                <span className="block font-semibold text-[0px] lg:text-base">
                  {user?.name || "User"}
                </span>
                <i className="ri-arrow-down-s-line text-[15px] absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2 mt-px"></i>
              </button>

              {profileMenuActive && (
                <div className="profile-menu-dropdown bg-white dark:bg-[#0c1427] transition-all shadow-3xl dark:shadow-none py-[22px] absolute mt-[13px] md:mt-[14px] w-[195px] z-[1] top-full ltr:right-0 rtl:left-0 rounded-md">
                  <div className="flex items-center border-b border-gray-100 dark:border-[#172036] pb-[12px] mx-[20px] mb-[10px]">
                    <img
                      src="/images/admin.png"
                      className="rounded-full w-[31px] h-[31px] ltr:mr-[9px] rtl:ml-[9px] border-2 border-primary-200 inline-block"
                      alt="admin-image"
                      width={31}
                      height={31}
                    />
                    <div>
                      <span className="block text-black dark:text-white font-medium">
                        {user?.name || "User Name"}
                      </span>
                      <span className="block text-xs">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                  </div>

                  <ul>
                    <li>
                      <Link
                        href="/my-profile/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/my-profile/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          account_circle
                        </i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/apps/chat/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/apps/chat/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          chat
                        </i>
                        Messages
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/apps/to-do-list/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/apps/to-do-list/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          format_list_bulleted
                        </i>
                        My Task
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ecommerce/checkout/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/ecommerce/checkout/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          credit_card
                        </i>
                        Billing
                      </Link>
                    </li>
                  </ul>

                  <div className="border-t border-gray-100 dark:border-[#172036] mx-[20px] my-[9px]"></div>

                  <ul>
                    <li>
                      <Link
                        href="/settings/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/settings/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          settings
                        </i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/faq/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          support
                        </i>
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/authentication/lock-screen/"
                        className={`block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 ${
                          pathname === "/authentication/lock-screen/" ? "text-primary-500" : ""
                        }`}
                      >
                        <i className="material-symbols-oriented top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          lock
                        </i>
                        Lock Screen
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block relative py-[7px] ltr:pl-[50px] ltr:pr-[20px] rtl:pr-[50px] rtl:pl-[20px] text-black dark:text-white transition-all hover:text-primary-500 w-full text-left"
                      >
                        <i className="material-symbols-outlined top-1/2 -translate-y-1/2 !text-[22px] absolute ltr:left-[20px] rtl:right-[20px]">
                          logout
                        </i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
