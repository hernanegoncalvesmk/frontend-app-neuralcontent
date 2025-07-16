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
  
  // Perfil (páginas construídas)
  PROFILE: {
    MAIN: '/dashboard/profile',
  },
  
  // Financeiro (páginas construídas)
  BILLING: {
    PLANS: '/billing/plans',
    CREDITS: '/billing/credits',
  },
  
  // Administração (páginas construídas)
  ADMIN: {
    MAIN: '/admin',
    DASHBOARD: '/admin/dashboard',
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
  
  // Grupo: Perfil (páginas construídas)
  {
    id: 'profile',
    label: 'Perfil',
    icon: 'person',
    href: ROUTES.PROFILE.MAIN,
    group: 'profile',
    requiresAuth: true,
  },
  
  // Grupo: Financeiro (páginas construídas)
  {
    id: 'plans',
    label: 'Planos',
    icon: 'workspace_premium',
    href: ROUTES.BILLING.PLANS,
    group: 'billing',
    requiresAuth: true,
  },
  {
    id: 'credits',
    label: 'Créditos',
    icon: 'account_balance_wallet',
    href: ROUTES.BILLING.CREDITS,
    group: 'billing',
    requiresAuth: true,
  },
  
  // Grupo: Administração (páginas construídas)
  {
    id: 'admin-dashboard',
    label: 'Dashboard Admin',
    icon: 'admin_panel_settings',
    href: ROUTES.ADMIN.DASHBOARD,
    group: 'admin',
    requiresAuth: true,
    requiresAdmin: true,
  },
];

// Grupos do menu para organização visual
export const MENU_GROUPS = {
  principal: 'Principal',
  profile: 'Perfil',
  billing: 'Financeiro',
  admin: 'Administração',
} as const;
