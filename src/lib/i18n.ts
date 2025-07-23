/**
 * @fileoverview Internationalization Configuration
 * 
 * i18next configuration for multi-language support.
 * 
 * @version 1.0.0
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
const resources = {
  en: {
    translation: {
      // Authentication
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.logout': 'Logout',
      'auth.forgotPassword': 'Forgot Password',
      'auth.resetPassword': 'Reset Password',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.rememberMe': 'Remember me',
      'auth.signIn': 'Sign in',
      'auth.signUp': 'Sign up',
      'auth.alreadyHaveAccount': 'Already have an account?',
      'auth.dontHaveAccount': "Don't have an account?",
      
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.profile': 'Profile',
      'nav.settings': 'Settings',
      'nav.home': 'Home',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.create': 'Create',
      'common.update': 'Update',
      'common.submit': 'Submit',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.close': 'Close',
      
      // Validation
      'validation.required': 'This field is required',
      'validation.email': 'Please enter a valid email',
      'validation.password': 'Password must be at least 8 characters',
      'validation.passwordMatch': 'Passwords do not match',
      'validation.minLength': 'Must be at least {{min}} characters',
      'validation.maxLength': 'Must be at most {{max}} characters',
    }
  },
  pt: {
    translation: {
      // Authentication
      'auth.login': 'Entrar',
      'auth.register': 'Registrar',
      'auth.logout': 'Sair',
      'auth.forgotPassword': 'Esqueceu a senha',
      'auth.resetPassword': 'Redefinir senha',
      'auth.email': 'E-mail',
      'auth.password': 'Senha',
      'auth.confirmPassword': 'Confirmar senha',
      'auth.rememberMe': 'Lembrar de mim',
      'auth.signIn': 'Entrar',
      'auth.signUp': 'Registrar',
      'auth.alreadyHaveAccount': 'Já tem uma conta?',
      'auth.dontHaveAccount': 'Não tem uma conta?',
      
      // Navigation
      'nav.dashboard': 'Painel',
      'nav.profile': 'Perfil',
      'nav.settings': 'Configurações',
      'nav.home': 'Início',
      
      // Common
      'common.loading': 'Carregando...',
      'common.error': 'Erro',
      'common.success': 'Sucesso',
      'common.cancel': 'Cancelar',
      'common.save': 'Salvar',
      'common.delete': 'Excluir',
      'common.edit': 'Editar',
      'common.create': 'Criar',
      'common.update': 'Atualizar',
      'common.submit': 'Enviar',
      'common.back': 'Voltar',
      'common.next': 'Próximo',
      'common.previous': 'Anterior',
      'common.close': 'Fechar',
      
      // Validation
      'validation.required': 'Este campo é obrigatório',
      'validation.email': 'Por favor, insira um e-mail válido',
      'validation.password': 'A senha deve ter pelo menos 8 caracteres',
      'validation.passwordMatch': 'As senhas não coincidem',
      'validation.minLength': 'Deve ter pelo menos {{min}} caracteres',
      'validation.maxLength': 'Deve ter no máximo {{max}} caracteres',
    }
  },
  es: {
    translation: {
      // Authentication
      'auth.login': 'Iniciar sesión',
      'auth.register': 'Registrarse',
      'auth.logout': 'Cerrar sesión',
      'auth.forgotPassword': 'Olvidé la contraseña',
      'auth.resetPassword': 'Restablecer contraseña',
      'auth.email': 'Correo electrónico',
      'auth.password': 'Contraseña',
      'auth.confirmPassword': 'Confirmar contraseña',
      'auth.rememberMe': 'Recordarme',
      'auth.signIn': 'Iniciar sesión',
      'auth.signUp': 'Registrarse',
      'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
      'auth.dontHaveAccount': '¿No tienes una cuenta?',
      
      // Navigation
      'nav.dashboard': 'Panel',
      'nav.profile': 'Perfil',
      'nav.settings': 'Configuración',
      'nav.home': 'Inicio',
      
      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.cancel': 'Cancelar',
      'common.save': 'Guardar',
      'common.delete': 'Eliminar',
      'common.edit': 'Editar',
      'common.create': 'Crear',
      'common.update': 'Actualizar',
      'common.submit': 'Enviar',
      'common.back': 'Atrás',
      'common.next': 'Siguiente',
      'common.previous': 'Anterior',
      'common.close': 'Cerrar',
      
      // Validation
      'validation.required': 'Este campo es obligatorio',
      'validation.email': 'Por favor, ingrese un correo válido',
      'validation.password': 'La contraseña debe tener al menos 8 caracteres',
      'validation.passwordMatch': 'Las contraseñas no coinciden',
      'validation.minLength': 'Debe tener al menos {{min}} caracteres',
      'validation.maxLength': 'Debe tener máximo {{max}} caracteres',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    
    debug: process?.env?.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'language',
      caches: ['localStorage', 'cookie'],
    },

    react: {
      useSuspense: false,
    }
  });

export default i18n;
