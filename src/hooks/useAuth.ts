"use client";

import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
