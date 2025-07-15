// Constantes de rotas da aplicação Neural Content
export const ROUTES = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // Dashboard Principal
  DASHBOARD: '/dashboard',
  
  // Funcionalidades principais (para implementação futura)
  CONTENT: {
    GENERATE: '/content/generate',
    HISTORY: '/content/history',
    TEMPLATES: '/content/templates',
  },
  
  REPORTS: {
    ANALYTICS: '/reports/analytics',
    USAGE: '/reports/usage',
  },
  
  BILLING: {
    PLANS: '/billing/plans',
    CREDITS: '/billing/credits',
    INVOICES: '/billing/invoices',
  },
  
  PROFILE: {
    SETTINGS: '/profile/settings',
    SECURITY: '/profile/security',
  },
  
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SYSTEM: '/admin/system',
  },
} as const;

// Estrutura do menu de navegação
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: MenuItem[];
  group?: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

export const NAVIGATION_MENU: MenuItem[] = [
  // Grupo: Principal
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    href: ROUTES.DASHBOARD,
    group: 'principal',
    requiresAuth: true,
  },
  
  // Grupo: Geração de Conteúdo (para implementação futura)
  {
    id: 'content',
    label: 'Conteúdo',
    icon: 'edit_note',
    group: 'content',
    requiresAuth: true,
    children: [
      {
        id: 'generate',
        label: 'Gerar Conteúdo',
        icon: 'auto_awesome',
        href: ROUTES.CONTENT.GENERATE,
      },
      {
        id: 'history',
        label: 'Histórico',
        icon: 'history',
        href: ROUTES.CONTENT.HISTORY,
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: 'template_list',
        href: ROUTES.CONTENT.TEMPLATES,
      },
    ],
  },
  
  // Grupo: Relatórios (para implementação futura)
  {
    id: 'reports',
    label: 'Relatórios',
    icon: 'analytics',
    group: 'analytics',
    requiresAuth: true,
    children: [
      {
        id: 'analytics',
        label: 'Análises',
        icon: 'trending_up',
        href: ROUTES.REPORTS.ANALYTICS,
      },
      {
        id: 'usage',
        label: 'Uso da Plataforma',
        icon: 'bar_chart',
        href: ROUTES.REPORTS.USAGE,
      },
    ],
  },
  
  // Grupo: Financeiro
  {
    id: 'billing',
    label: 'Financeiro',
    icon: 'payments',
    group: 'billing',
    requiresAuth: true,
    children: [
      {
        id: 'plans',
        label: 'Planos',
        icon: 'workspace_premium',
        href: ROUTES.BILLING.PLANS,
      },
      {
        id: 'credits',
        label: 'Créditos',
        icon: 'account_balance_wallet',
        href: ROUTES.BILLING.CREDITS,
      },
      {
        id: 'invoices',
        label: 'Faturas',
        icon: 'receipt_long',
        href: ROUTES.BILLING.INVOICES,
      },
    ],
  },
  
  // Grupo: Configurações
  {
    id: 'profile',
    label: 'Perfil',
    icon: 'person',
    group: 'settings',
    requiresAuth: true,
    children: [
      {
        id: 'settings',
        label: 'Configurações',
        icon: 'settings',
        href: ROUTES.PROFILE.SETTINGS,
      },
      {
        id: 'security',
        label: 'Segurança',
        icon: 'security',
        href: ROUTES.PROFILE.SECURITY,
      },
    ],
  },
  
  // Grupo: Administração
  {
    id: 'admin',
    label: 'Administração',
    icon: 'admin_panel_settings',
    group: 'admin',
    requiresAuth: true,
    requiresAdmin: true,
    children: [
      {
        id: 'admin-dashboard',
        label: 'Dashboard Admin',
        icon: 'dashboard',
        href: ROUTES.ADMIN.DASHBOARD,
      },
      {
        id: 'users',
        label: 'Usuários',
        icon: 'group',
        href: ROUTES.ADMIN.USERS,
      },
      {
        id: 'system',
        label: 'Sistema',
        icon: 'settings_system_daydream',
        href: ROUTES.ADMIN.SYSTEM,
      },
    ],
  },
];

// Grupos do menu para organização visual
export const MENU_GROUPS = {
  principal: 'Principal',
  content: 'Geração de Conteúdo',
  analytics: 'Relatórios',
  billing: 'Financeiro',
  settings: 'Configurações',
  admin: 'Administração',
} as const;
