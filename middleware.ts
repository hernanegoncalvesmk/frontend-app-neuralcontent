import { NextRequest, NextResponse } from "next/server"
import { AUTH_CONFIG } from '@/constants/config';

// Função para verificar se o token está expirado
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Verificar se o token está expirado (com buffer de 5 minutos)
    return now >= (payload.exp - 300); // 5 minutos de buffer
  } catch {
    return true;
  }
}

// Função para verificar autenticação no middleware
function isAuthenticated(request: NextRequest): boolean {
  // Verificar no cookie primeiro (mais seguro para SSR)
  const tokenFromCookie = request.cookies.get(AUTH_CONFIG.TOKEN_STORAGE_KEY)?.value;
  
  if (tokenFromCookie && !isTokenExpired(tokenFromCookie)) {
    return true;
  }

  // Fallback: verificar no header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return !isTokenExpired(token);
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const authenticated = isAuthenticated(request);
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isPublicPage = request.nextUrl.pathname === '/' || 
                      request.nextUrl.pathname.startsWith('/public') ||
                      request.nextUrl.pathname.startsWith('/api/auth');

  // Se está autenticado e tentando acessar páginas de auth, redirecionar para dashboard
  if (authenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não está autenticado e tentando acessar páginas protegidas, redirecionar para login
  if (!authenticated && !isAuthPage && !isPublicPage) {
    const loginUrl = new URL('/auth/login', request.url);
    // Adicionar parâmetro de redirecionamento
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

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
