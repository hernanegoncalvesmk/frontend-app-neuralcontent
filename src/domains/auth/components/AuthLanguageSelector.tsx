"use client";

import React from 'react';
import { LanguageSelector } from '@/domains/translations/components/LanguageSelector';

const AuthLanguageSelector: React.FC = () => {
  return (
    <div className="absolute top-6 right-6 z-10">
      <LanguageSelector 
        variant="dropdown"
        size="sm"
        showFlags={true}
        showNativeNames={true}
        className="bg-white dark:bg-gray-800 shadow-lg"
      />
    </div>
  );
};
export default AuthLanguageSelector;
