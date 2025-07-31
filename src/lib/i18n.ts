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
      
      // Forgot Password
      'forgotPassword.title': 'Forgot your password?',
      'forgotPassword.subtitle': 'Enter your email and we\'ll send you a link to reset your password',
      'forgotPassword.email': 'Your account email',
      'forgotPassword.emailPlaceholder': 'Enter your email here',
      'forgotPassword.emailNotFound': 'Email is required',
      'forgotPassword.submitButton': 'Send recovery link',
      'forgotPassword.submitting': 'Sending...',
      'forgotPassword.backToLogin': 'Back to login',
      'forgotPassword.success.title': 'Email sent successfully!',
      'forgotPassword.success.subtitle': 'We sent a link to reset your password. Check your inbox and spam folder.',
      'forgotPassword.success.checkEmail': 'Check your email',
      'forgotPassword.success.emailSentTo': 'Email sent to:',
      'forgotPassword.success.linkExpires': 'The link expires in 1 hour.',
      'forgotPassword.success.notReceived': 'Didn\'t receive the email?',
      'forgotPassword.success.resendButton': 'Resend email',
      
      // Reset Password
      'resetPassword.title': 'Create new password',
      'resetPassword.subtitle': 'Enter your new password. Make sure it\'s secure and easy to remember.',
      'resetPassword.form.newPassword': 'New Password',
      'resetPassword.form.newPasswordPlaceholder': 'Enter your new password (min. 4 characters)',
      'resetPassword.form.confirmPassword': 'Confirm New Password',
      'resetPassword.form.confirmPasswordPlaceholder': 'Enter your new password again',
      'resetPassword.form.submitButton': 'Reset Password',
      'resetPassword.form.submitting': 'Resetting...',
      'resetPassword.success.title': 'Password reset successfully!',
      'resetPassword.success.subtitle': 'Your password has been changed successfully. You can now log in with your new password.',
      'resetPassword.success.loginButton': 'Login',
      
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
      
      // Email Confirmation
      'auth.confirmEmail.titles.loading': 'Confirming your Email...',
      'auth.confirmEmail.titles.success': 'Email Confirmed!',
      'auth.confirmEmail.titles.error': 'Confirmation Error',
      'auth.confirmEmail.success.title': 'Account Activated Successfully!',
      'auth.confirmEmail.success.description': 'Your account has been activated and you can now log in to the Neural Content platform.',
      'auth.confirmEmail.success.message': 'Email confirmed successfully! Your account has been activated.',
      'auth.confirmEmail.errors.title': 'Confirmation Problem',
      'auth.confirmEmail.errors.description': 'Unable to confirm your email. Possible causes:',
      'auth.confirmEmail.errors.tokenNotFound': 'Verification token not found.',
      'auth.confirmEmail.errors.generic': 'Error confirming email.',
      'auth.confirmEmail.errors.connection': 'Connection error. Please try again.',
      'auth.confirmEmail.errors.causes.expired': 'Token expired or invalid',
      'auth.confirmEmail.errors.causes.alreadyConfirmed': 'Email already confirmed previously',
      'auth.confirmEmail.errors.causes.usedMultipleTimes': 'Confirmation link used multiple times',
      'auth.confirmEmail.actions.login': 'Login',
      'auth.confirmEmail.actions.createAccount': 'Create New Account',
      'auth.confirmEmail.loading.processing': 'Processing...',
      'auth.confirmEmail.support.question': 'Need help?',
      'auth.confirmEmail.support.contact': 'Contact Us',
      'auth.confirmEmail.resend.question': 'Did not receive the email?',
      'auth.confirmEmail.resend.button': 'Resend Email',
      'auth.confirmEmail.resend.sending': 'Sending...',
      'auth.confirmEmail.resend.success': 'Verification email resent successfully! Check your inbox.',
      'auth.confirmEmail.resend.error': 'Error resending email. Please try again.',
      'auth.confirmEmail.resend.emailRequired': 'Email is required to resend.',
      'auth.confirmEmail.resend.emailLabel': 'Your email:',
      'auth.confirmEmail.resend.emailPlaceholder': 'Enter your email to resend',
      
      // Errors
      'errors.invalidEmail': 'Please enter a valid email address',
      'errors.serverError': 'Server error. Please try again later.',
      'errors.networkError': 'Network error. Check your connection.',
      'errors.tokenExpired': 'Token has expired',
      'errors.tokenInvalid': 'Invalid token',
      'errors.passwordMismatch': 'Passwords do not match',
      'errors.passwordTooShort': 'Password must be at least 8 characters',
      'errors.emailRequired': 'Email is required',
      'errors.passwordRequired': 'Password is required',
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
      
      // Forgot Password
      'forgotPassword.title': 'Esqueceu sua senha?',
      'forgotPassword.subtitle': 'Digite seu e-mail e enviaremos um link para redefinir sua senha',
      'forgotPassword.email': 'E-mail da sua conta',
      'forgotPassword.emailPlaceholder': 'Digite seu e-mail aqui',
      'forgotPassword.emailNotFound': 'E-mail é obrigatório',
      'forgotPassword.submitButton': 'Enviar link de recuperação',
      'forgotPassword.submitting': 'Enviando...',
      'forgotPassword.backToLogin': 'Voltar ao login',
      'forgotPassword.success.title': 'E-mail enviado com sucesso!',
      'forgotPassword.success.subtitle': 'Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada e pasta de spam.',
      'forgotPassword.success.checkEmail': 'Verifique seu e-mail',
      'forgotPassword.success.emailSentTo': 'E-mail enviado para:',
      'forgotPassword.success.linkExpires': 'O link expira em 1 hora.',
      'forgotPassword.success.notReceived': 'Não recebeu o e-mail?',
      'forgotPassword.success.resendButton': 'Reenviar e-mail',
      
      // Reset Password
      'resetPassword.title': 'Criar nova senha',
      'resetPassword.subtitle': 'Digite sua nova senha. Certifique-se de que seja segura e fácil de lembrar.',
      'resetPassword.form.newPassword': 'Nova Senha',
      'resetPassword.form.newPasswordPlaceholder': 'Digite sua nova senha (mín. 4 caracteres)',
      'resetPassword.form.confirmPassword': 'Confirmar Nova Senha',
      'resetPassword.form.confirmPasswordPlaceholder': 'Digite novamente sua nova senha',
      'resetPassword.form.submitButton': 'Redefinir Senha',
      'resetPassword.form.submitting': 'Redefinindo...',
      'resetPassword.success.title': 'Senha redefinida com sucesso!',
      'resetPassword.success.subtitle': 'Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.',
      'resetPassword.success.loginButton': 'Fazer Login',
      
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
      
      // Email Confirmation
      'auth.confirmEmail.titles.loading': 'Confirmando seu Email...',
      'auth.confirmEmail.titles.success': 'Email Confirmado!',
      'auth.confirmEmail.titles.error': 'Erro na Confirmação',
      'auth.confirmEmail.success.title': 'Conta Ativada com Sucesso!',
      'auth.confirmEmail.success.description': 'Sua conta foi ativada e você já pode fazer login na plataforma Neural Content.',
      'auth.confirmEmail.success.message': 'Email confirmado com sucesso! Sua conta foi ativada.',
      'auth.confirmEmail.errors.title': 'Problema na Confirmação',
      'auth.confirmEmail.errors.description': 'Não foi possível confirmar seu email. Possíveis causas:',
      'auth.confirmEmail.errors.tokenNotFound': 'Token de verificação não encontrado.',
      'auth.confirmEmail.errors.generic': 'Erro ao confirmar email.',
      'auth.confirmEmail.errors.connection': 'Erro de conexão. Tente novamente.',
      'auth.confirmEmail.errors.causes.expired': 'Token expirado ou inválido',
      'auth.confirmEmail.errors.causes.alreadyConfirmed': 'Email já foi confirmado anteriormente',
      'auth.confirmEmail.errors.causes.usedMultipleTimes': 'Link de confirmação usado mais de uma vez',
      'auth.confirmEmail.actions.login': 'Fazer Login',
      'auth.confirmEmail.actions.createAccount': 'Criar Nova Conta',
      'auth.confirmEmail.loading.processing': 'Processando...',
      'auth.confirmEmail.support.question': 'Precisa de ajuda?',
      'auth.confirmEmail.support.contact': 'Fale Conosco',
      'auth.confirmEmail.resend.question': 'Não recebeu o email?',
      'auth.confirmEmail.resend.button': 'Reenviar Email',
      'auth.confirmEmail.resend.sending': 'Enviando...',
      'auth.confirmEmail.resend.success': 'Email de verificação reenviado com sucesso! Verifique sua caixa de entrada.',
      'auth.confirmEmail.resend.error': 'Erro ao reenviar email. Tente novamente.',
      'auth.confirmEmail.resend.emailRequired': 'Email é obrigatório para reenviar.',
      'auth.confirmEmail.resend.emailLabel': 'Seu email:',
      'auth.confirmEmail.resend.emailPlaceholder': 'Digite seu email para reenviar',
      
      // Errors
      'errors.invalidEmail': 'Digite um endereço de email válido',
      'errors.serverError': 'Erro no servidor. Tente novamente mais tarde.',
      'errors.networkError': 'Erro de rede. Verifique sua conexão.',
      'errors.tokenExpired': 'Token expirado',
      'errors.tokenInvalid': 'Token inválido',
      'errors.passwordMismatch': 'Senhas não coincidem',
      'errors.passwordTooShort': 'Senha deve ter pelo menos 8 caracteres',
      'errors.emailRequired': 'Email é obrigatório',
      'errors.passwordRequired': 'Senha é obrigatória',
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
