"use client";

import React from 'react';
import { 
  SupportedLanguage, 
  TranslationNamespace, 
  TranslationKey,
  TranslationVariables,
  TranslatedTextProps 
} from '../types/translation.types';
import { useTranslation } from '../hooks/useTranslation';

/**
 * TranslatedText Component
 * 
 * Component for rendering translated text with support for variables and fallbacks.
 * Provides a declarative way to display translations in JSX.
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
  tKey,
  namespace = TranslationNamespace.COMMON,
  variables,
  fallback,
  className,
  as = 'span',
  ...props
}) => {
  const { tns, isReady } = useTranslation();

  // Show fallback or key while loading
  if (!isReady) {
    return React.createElement(as as any, { className, ...props }, fallback || tKey);
  }

  const translatedText = tns(namespace, tKey, variables);
  const displayText = translatedText === tKey && fallback ? fallback : translatedText;

  return React.createElement(as as any, { className, ...props }, displayText);
};

// Simple component wrapper for common use cases
export const T: React.FC<{
  children: TranslationKey;
  ns?: TranslationNamespace;
  vars?: TranslationVariables;
  fallback?: string;
}> = ({ children, ns, vars, fallback }) => {
  return (
    <TranslatedText 
      tKey={children} 
      namespace={ns} 
      variables={vars} 
      fallback={fallback} 
    />
  );
};

export default TranslatedText;
