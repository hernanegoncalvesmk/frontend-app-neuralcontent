"use client";

import React, { useEffect, useState } from "react";

const LightDarkModeButton: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed bottom-[25px] ltr:right-[25px] rtl:left-[25px] z-[6] w-[50px] h-[50px] bg-primary-600 hover:bg-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Toggle theme"
      >
        <i className="material-symbols-outlined !text-[24px] group-hover:scale-110 transition-transform duration-300">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </i>
      </button>
    </>
  );
};

export default LightDarkModeButton;
