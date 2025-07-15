"use client";

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;

    return (
      <div className="mb-[15px] relative">
        {label && (
          <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              "h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              className="absolute text-lg ltr:right-[20px] rtl:left-[20px] bottom-[12px] transition-all hover:text-primary-500"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
