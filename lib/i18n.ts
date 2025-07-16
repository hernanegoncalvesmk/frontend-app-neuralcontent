import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18N_CONFIG } from '@/constants/config';

// Recursos de tradução estáticos (fallback)
const resources = {
  'pt-BR': {
    common: {
      "app": {
        "name": "Neural Content",
        "description": "Plataforma de criação de conteúdo com IA",
        "welcome": "Bem-vindo ao Neural Content"
      },
      "navigation": {
        "dashboard": "Painel",
        "billing": "Cobrança",
        "plans": "Planos",
        "credits": "Créditos",
        "profile": "Perfil",
        "admin": "Administração",
        "settings": "Configurações",
        "logout": "Sair"
      },
      "common": {
        "loading": "Carregando...",
        "save": "Salvar",
        "cancel": "Cancelar",
        "edit": "Editar",
        "delete": "Excluir",
        "confirm": "Confirmar"
      },
      "languages": {
        "chooseLang": "Escolher Idioma",
        "pt-BR": "Português (Brasil)",
        "en-US": "English (US)",
        "es-ES": "Español",
        "fr-FR": "Français"
      }
    },
    auth: {
      "login": {
        "title": "Entrar na sua conta",
        "subtitle": "Bem-vindo de volta! Insira seus dados para acessar",
        "email": "Email",
        "password": "Senha",
        "loginButton": "Entrar"
      }
    },
    dashboard: {
      "title": "Painel de Controle",
      "welcome": {
        "title": "Bem-vindo de volta, {{name}}!",
        "subtitle": "Aqui está um resumo das suas atividades hoje"
      }
    }
  },
  'en-US': {
    common: {
      "app": {
        "name": "Neural Content",
        "description": "AI-powered content creation platform",
        "welcome": "Welcome to Neural Content"
      },
      "navigation": {
        "dashboard": "Dashboard",
        "billing": "Billing",
        "plans": "Plans",
        "credits": "Credits",
        "profile": "Profile",
        "admin": "Administration",
        "settings": "Settings",
        "logout": "Logout"
      },
      "common": {
        "loading": "Loading...",
        "save": "Save",
        "cancel": "Cancel",
        "edit": "Edit",
        "delete": "Delete",
        "confirm": "Confirm"
      },
      "languages": {
        "chooseLang": "Choose Language",
        "pt-BR": "Português (Brasil)",
        "en-US": "English (US)",
        "es-ES": "Español",
        "fr-FR": "Français"
      }
    },
    auth: {
      "login": {
        "title": "Sign in to your account",
        "subtitle": "Welcome back! Please enter your details to access",
        "email": "Email",
        "password": "Password",
        "loginButton": "Sign In"
      }
    },
    dashboard: {
      "title": "Dashboard",
      "welcome": {
        "title": "Welcome back, {{name}}!",
        "subtitle": "Here's a summary of your activities today"
      }
    }
  },
  'es-ES': {
    common: {
      "app": {
        "name": "Neural Content",
        "description": "Plataforma de creación de contenido con IA",
        "welcome": "Bienvenido a Neural Content"
      },
      "navigation": {
        "dashboard": "Panel",
        "billing": "Facturación",
        "plans": "Planes",
        "credits": "Créditos",
        "profile": "Perfil",
        "admin": "Administración",
        "settings": "Configuración",
        "logout": "Salir"
      },
      "languages": {
        "chooseLang": "Elegir Idioma",
        "pt-BR": "Português (Brasil)",
        "en-US": "English (US)",
        "es-ES": "Español",
        "fr-FR": "Français"
      }
    },
    auth: {
      "login": {
        "title": "Iniciar sesión",
        "subtitle": "¡Bienvenido de vuelta! Ingresa tus datos para acceder",
        "email": "Email",
        "password": "Contraseña",
        "loginButton": "Iniciar Sesión"
      }
    },
    dashboard: {
      "title": "Panel de Control"
    }
  },
  'fr-FR': {
    common: {
      "app": {
        "name": "Neural Content",
        "description": "Plateforme de création de contenu avec IA",
        "welcome": "Bienvenue sur Neural Content"
      },
      "navigation": {
        "dashboard": "Tableau de bord",
        "billing": "Facturation",
        "plans": "Plans",
        "credits": "Crédits",
        "profile": "Profil",
        "admin": "Administration",
        "settings": "Paramètres",
        "logout": "Déconnexion"
      },
      "languages": {
        "chooseLang": "Choisir la langue",
        "pt-BR": "Português (Brasil)",
        "en-US": "English (US)",
        "es-ES": "Español",
        "fr-FR": "Français"
      }
    },
    auth: {
      "login": {
        "title": "Se connecter",
        "subtitle": "Bon retour ! Entrez vos données pour accéder",
        "email": "Email",
        "password": "Mot de passe",
        "loginButton": "Se connecter"
      }
    },
    dashboard: {
      "title": "Tableau de bord"
    }
  }
};

// Backend integration service
const backendConnector = {
  type: 'backend' as const,
  
  async read(language: string, namespace: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/translations/${language}/${namespace}`, {
        headers: {
          'Authorization': typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token')}` : '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.translations || {};
    } catch (error) {
      console.warn(`Failed to load translations for ${language}/${namespace}:`, error);
      // Fallback para recursos estáticos
      return resources[language as keyof typeof resources]?.[namespace as keyof typeof resources['pt-BR']] || {};
    }
  },
  
  async save(language: string, namespace: string, data: Record<string, unknown>) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/translations/${language}/${namespace}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify({ translations: data }),
      });
    } catch (error) {
      console.error('Failed to save translations:', error);
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(backendConnector)
  .init({
    lng: I18N_CONFIG.DEFAULT_LANGUAGE,
    fallbackLng: I18N_CONFIG.FALLBACK_LANGUAGE,
    
    // Configurações de detecção
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Configurações de backend
    backend: {
      loadPath: '{{lng}}/{{ns}}',
      allowMultiLoading: false,
      crossDomain: false,
    },
    
    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'admin', 'billing', 'profile'],
    
    // Configurações de interpolação
    interpolation: {
      escapeValue: false, // React já faz escape
      formatSeparator: ',',
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
        return value;
      },
    },
    
    // Configurações de desenvolvimento
    debug: process.env.NODE_ENV === 'development',
    
    // Recursos estáticos como fallback
    resources,
    
    // Configurações de carregamento
    load: 'languageOnly',
    preload: I18N_CONFIG.SUPPORTED_LANGUAGES.map(lang => lang.code),
    
    // Configurações de cache
    updateMissing: true,
    saveMissing: true,
    
    // Configurações de formato
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation key: ${key}`);
      return key;
    },
  });

export default i18n;