import { NextRequest, NextResponse } from "next/server"

// ============================================================================
// CONFIGURATION
// ============================================================================

const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
} as const;

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/billing',
];

// Rotas que só podem ser acessadas por usuários não autenticados
const GUEST_ONLY_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

// Rotas públicas que não requerem verificação
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/api/health',
];

// Rotas de API que não devem ser verificadas
const API_ROUTES_SKIP = [
  '/api/auth',
  '/api/health',
  '/api/public',
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Verificar se o token JWT está expirado
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Token expirado se o tempo atual for maior que exp
    return now >= payload.exp;
  } catch {
    return true;
  }
}

/**
 * Verificar se o usuário está autenticado
 */
function isAuthenticated(request: NextRequest): boolean {
  // Verificar access token
  const accessToken = request.cookies.get(AUTH_CONFIG.TOKEN_STORAGE_KEY)?.value;
  
  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  // Se access token expirou, verificar se há refresh token válido
  const refreshToken = request.cookies.get(AUTH_CONFIG.REFRESH_TOKEN_KEY)?.value;
  
  if (refreshToken && !isTokenExpired(refreshToken)) {
    // Refresh token válido - consideramos como autenticado
    // O cliente fará o refresh automático
    return true;
  }

  return false;
}

/**
 * Verificar se a rota é protegida
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verificar se a rota é somente para guests
 */
function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verificar se é uma rota pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

/**
 * Verificar se é uma rota de API que deve ser ignorada
 */
function isSkippedApiRoute(pathname: string): boolean {
  return API_ROUTES_SKIP.some(route => pathname.startsWith(route));
}

// ============================================================================
// MIDDLEWARE FUNCTION
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar rotas de API específicas
  if (isSkippedApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Ignorar arquivos estáticos
  if (pathname.includes('.') && !pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verificar autenticação
  const authenticated = isAuthenticated(request);

  // ================================
  // LOGIC FOR AUTHENTICATED USERS
  // ================================
  if (authenticated) {
    // Se está autenticado e tentando acessar rota de guest, redirecionar
    if (isGuestOnlyRoute(pathname)) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Usuário autenticado pode acessar qualquer outra rota
    return NextResponse.next();
  }

  // ================================
  // LOGIC FOR UNAUTHENTICATED USERS
  // ================================
  
  // Se não está autenticado e tentando acessar rota protegida
  if (isProtectedRoute(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rotas públicas e de guest podem ser acessadas
  return NextResponse.next();
}

// ============================================================================
// MATCHER CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - public (public files)
     * - .*\\.(?:jpg|jpeg|gif|png|svg|ico|webp) (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|public|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)',
  ],
}
