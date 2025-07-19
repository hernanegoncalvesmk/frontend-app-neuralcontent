"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface Country {
  value: string;
  label: string;
  flag: string;
}

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

// Countries with flags and translated names
const COUNTRIES: Country[] = [
  { value: 'BR', label: 'Brasil', flag: '🇧🇷' },
  { value: 'US', label: 'Estados Unidos', flag: '🇺🇸' },
  { value: 'PT', label: 'Portugal', flag: '🇵🇹' },
  { value: 'ES', label: 'Espanha', flag: '🇪🇸' },
  { value: 'AR', label: 'Argentina', flag: '🇦🇷' },
  { value: 'MX', label: 'México', flag: '🇲🇽' },
  { value: 'CO', label: 'Colômbia', flag: '🇨🇴' },
  { value: 'CL', label: 'Chile', flag: '🇨🇱' },
  { value: 'PE', label: 'Peru', flag: '🇵🇪' },
  { value: 'UY', label: 'Uruguai', flag: '🇺🇾' },
  { value: 'PY', label: 'Paraguai', flag: '🇵🇾' },
  { value: 'BO', label: 'Bolívia', flag: '🇧🇴' },
  { value: 'EC', label: 'Equador', flag: '🇪🇨' },
  { value: 'VE', label: 'Venezuela', flag: '🇻🇪' },
  { value: 'FR', label: 'França', flag: '🇫🇷' },
  { value: 'DE', label: 'Alemanha', flag: '🇩🇪' },
  { value: 'IT', label: 'Itália', flag: '🇮🇹' },
  { value: 'GB', label: 'Reino Unido', flag: '🇬🇧' },
  { value: 'CA', label: 'Canadá', flag: '🇨🇦' },
  { value: 'AU', label: 'Austrália', flag: '🇦🇺' },
].sort((a, b) => a.label.localeCompare(b.label));

// Translation map for country names based on language
const COUNTRY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'en-US': {
    'BR': 'Brazil',
    'US': 'United States',
    'PT': 'Portugal',
    'ES': 'Spain',
    'AR': 'Argentina',
    'MX': 'Mexico',
    'CO': 'Colombia',
    'CL': 'Chile',
    'PE': 'Peru',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    'EC': 'Ecuador',
    'VE': 'Venezuela',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
  },
  'es-ES': {
    'BR': 'Brasil',
    'US': 'Estados Unidos',
    'PT': 'Portugal',
    'ES': 'España',
    'AR': 'Argentina',
    'MX': 'México',
    'CO': 'Colombia',
    'CL': 'Chile',
    'PE': 'Perú',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivia',
    'EC': 'Ecuador',
    'VE': 'Venezuela',
    'FR': 'Francia',
    'DE': 'Alemania',
    'IT': 'Italia',
    'GB': 'Reino Unido',
    'CA': 'Canadá',
    'AU': 'Australia',
  },
  'fr-FR': {
    'BR': 'Brésil',
    'US': 'États-Unis',
    'PT': 'Portugal',
    'ES': 'Espagne',
    'AR': 'Argentine',
    'MX': 'Mexique',
    'CO': 'Colombie',
    'CL': 'Chili',
    'PE': 'Pérou',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'BO': 'Bolivie',
    'EC': 'Équateur',
    'VE': 'Venezuela',
    'FR': 'France',
    'DE': 'Allemagne',
    'IT': 'Italie',
    'GB': 'Royaume-Uni',
    'CA': 'Canada',
    'AU': 'Australie',
  },
};

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  error,
  placeholder
}) => {
  const { i18n, t } = useTranslation('auth');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLanguage = i18n.language;

  // Get translated country list
  const getTranslatedCountries = (): Country[] => {
    const translations = COUNTRY_TRANSLATIONS[currentLanguage];
    
    return COUNTRIES.map(country => ({
      ...country,
      label: translations?.[country.value] || country.label
    })).sort((a, b) => a.label.localeCompare(b.label));
  };

  const translatedCountries = getTranslatedCountries();
  
  // Filter countries based on search term
  const filteredCountries = translatedCountries.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = translatedCountries.find(country => country.value === value);

  const handleCountrySelect = (countryValue: string) => {
    onChange(countryValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
    
    // Focus search input when opening
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-[#172036] text-gray-900 dark:text-white transition-all text-left flex items-center justify-between ${
          error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-[#2d3c5b] focus:border-primary-500'
        } focus:outline-none focus:ring-1 focus:ring-primary-500 hover:border-primary-400 dark:hover:border-primary-500`}
        aria-label={t('register.fields.country')}
      >
        <div className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.label}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              {placeholder || t('register.placeholders.country')}
            </span>
          )}
        </div>
        
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            error ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-[#172036] border border-gray-200 dark:border-[#2d3c5b] rounded-md shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-[#2d3c5b]">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('register.placeholders.country')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-[#2d3c5b] rounded-md bg-white dark:bg-[#1a2332] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Countries List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.value}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#1a2332] transition-all duration-200 text-left ${
                    value === country.value 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => handleCountrySelect(country.value)}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.label}</span>
                  {value === country.value && (
                    <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                {t('register.validation.countryRequired')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default CountrySelector;
