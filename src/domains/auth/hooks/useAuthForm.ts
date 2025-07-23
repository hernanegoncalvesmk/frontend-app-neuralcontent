/**
 * @fileoverview useAuthForm Hook
 * 
 * Hook especializado para formulários de autenticação.
 * Fornece validação, estado de submissão e handling de erros.
 * 
 * @version 1.0.0
 * @domain auth
 */

'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/infrastructure/providers/AuthProvider';

// ============================================================================
// INTERFACES
// ============================================================================

interface UseAuthFormOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectOnSuccess?: string;
  validateOnChange?: boolean;
}

interface AuthFormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
}

interface UseAuthFormReturn {
  // State
  state: AuthFormState;
  
  // Actions
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched?: boolean) => void;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
  
  // Handlers
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (userData: any) => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
  handleResetPassword: (token: string, password: string) => Promise<void>;
  handleVerifyEmail: (token: string) => Promise<void>;
  
  // Utilities
  isFieldValid: (field: string) => boolean;
  hasErrors: () => boolean;
  getFieldError: (field: string) => string | undefined;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useAuthForm = (options: UseAuthFormOptions = {}): UseAuthFormReturn => {
  const {
    onSuccess,
    onError,
    redirectOnSuccess,
    validateOnChange = true,
  } = options;

  const auth = useAuth();

  const [state, setState] = useState<AuthFormState>({
    isSubmitting: false,
    errors: {},
    touched: {},
    isDirty: false,
  });

  // ================================
  // State Management
  // ================================

  const updateState = useCallback((updates: Partial<AuthFormState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    updateState({
      errors: { ...state.errors, [field]: error },
      isDirty: true,
    });
  }, [state.errors, updateState]);

  const clearFieldError = useCallback((field: string) => {
    const newErrors = { ...state.errors };
    delete newErrors[field];
    updateState({ errors: newErrors });
  }, [state.errors, updateState]);

  const setFieldTouched = useCallback((field: string, touched = true) => {
    updateState({
      touched: { ...state.touched, [field]: touched },
      isDirty: true,
    });
  }, [state.touched, updateState]);

  const clearErrors = useCallback(() => {
    updateState({ errors: {}, touched: {} });
  }, [updateState]);

  // ================================
  // Utilities
  // ================================

  const isFieldValid = useCallback((field: string): boolean => {
    return !state.errors[field];
  }, [state.errors]);

  const hasErrors = useCallback((): boolean => {
    return Object.keys(state.errors).length > 0;
  }, [state.errors]);

  const getFieldError = useCallback((field: string): string | undefined => {
    return state.touched[field] ? state.errors[field] : undefined;
  }, [state.errors, state.touched]);

  // ================================
  // Form Handlers
  // ================================

  const handleSubmit = useCallback(async (
    action: () => Promise<void>,
    successMessage?: string
  ) => {
    try {
      updateState({ isSubmitting: true });
      clearErrors();

      await action();

      if (onSuccess) {
        onSuccess();
      }

      if (redirectOnSuccess) {
        window.location.href = redirectOnSuccess;
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Ocorreu um erro inesperado';
      
      if (onError) {
        onError(errorMessage);
      }

      setFieldError('general', errorMessage);
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [updateState, clearErrors, onSuccess, onError, redirectOnSuccess, setFieldError]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    return handleSubmit(async () => {
      await auth.login(email, password);
    });
  }, [handleSubmit, auth]);

  const handleRegister = useCallback(async (userData: any) => {
    return handleSubmit(async () => {
      await auth.register(userData);
    });
  }, [handleSubmit, auth]);

  const handleForgotPassword = useCallback(async (email: string) => {
    return handleSubmit(async () => {
      await auth.forgotPassword(email);
    });
  }, [handleSubmit, auth]);

  const handleResetPassword = useCallback(async (token: string, password: string) => {
    return handleSubmit(async () => {
      await auth.resetPassword(token, password);
    });
  }, [handleSubmit, auth]);

  const handleVerifyEmail = useCallback(async (token: string) => {
    return handleSubmit(async () => {
      await auth.verifyEmail(token);
    });
  }, [handleSubmit, auth]);

  return {
    // State
    state,
    
    // Actions
    setFieldError,
    setFieldTouched,
    clearErrors,
    clearFieldError,
    
    // Handlers
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    handleVerifyEmail,
    
    // Utilities
    isFieldValid,
    hasErrors,
    getFieldError,
  };
};

export default useAuthForm;
