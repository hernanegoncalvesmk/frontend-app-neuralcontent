export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  badge?: string;
  isActive?: boolean;
  permission?: string;
  group?: string; // Add group property
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

// Navigation Menu Configuration
export const NAVIGATION_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'home',
    group: 'main'
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: 'user',
    group: 'user'
  },
  {
    id: 'billing',
    label: 'Billing',
    href: '/billing',
    icon: 'credit-card',
    group: 'user'
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: 'settings',
    permission: 'admin',
    group: 'admin',
    children: [
      {
        id: 'admin-users',
        label: 'Users',
        href: '/admin/users',
        icon: 'users',
        group: 'admin'
      },
      {
        id: 'admin-plans',
        label: 'Plans',
        href: '/admin/plans',
        icon: 'package',
        group: 'admin'
      },
      {
        id: 'admin-payments',
        label: 'Payments',
        href: '/admin/payments',
        icon: 'credit-card',
        group: 'admin'
      }
    ]
  }
];

// Menu Groups Configuration
export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'home'
      }
    ]
  },
  {
    id: 'user',
    label: 'User',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        href: '/profile',
        icon: 'user'
      },
      {
        id: 'billing',
        label: 'Billing',
        href: '/billing',
        icon: 'credit-card'
      }
    ]
  },
  {
    id: 'admin',
    label: 'Administration',
    items: [
      {
        id: 'admin-users',
        label: 'Users',
        href: '/admin/users',
        icon: 'users',
        permission: 'admin'
      },
      {
        id: 'admin-plans',
        label: 'Plans',
        href: '/admin/plans',
        icon: 'package',
        permission: 'admin'
      },
      {
        id: 'admin-payments',
        label: 'Payments',
        href: '/admin/payments',
        icon: 'credit-card',
        permission: 'admin'
      }
    ]
  }
];

// Route Configuration
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BILLING: '/billing',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ADMIN: {
    BASE: '/admin',
    USERS: '/admin/users',
    PLANS: '/admin/plans',
    PAYMENTS: '/admin/payments'
  }
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD
];

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.BILLING,
  ROUTES.ADMIN.BASE,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.PLANS,
  ROUTES.ADMIN.PAYMENTS
];

// Admin routes that require admin permission
export const ADMIN_ROUTES = [
  ROUTES.ADMIN.BASE,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.PLANS,
  ROUTES.ADMIN.PAYMENTS
];
