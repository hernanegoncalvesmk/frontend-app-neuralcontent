"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES, NAVIGATION_MENU, MenuItem } from '@/constants/routes';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname();

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Sempre adicionar "Início" se não estiver na raiz
    if (pathname !== '/' && pathname !== ROUTES.DASHBOARD) {
      breadcrumbs.push({
        label: 'Início',
        href: ROUTES.DASHBOARD,
      });
    }

    // Função para encontrar o caminho no menu
    const findMenuPath = (items: MenuItem[], targetPath: string): MenuItem[] => {
      for (const item of items) {
        if (item.href === targetPath) {
          return [item];
        }
        if (item.children) {
          const childPath = findMenuPath(item.children, targetPath);
          if (childPath.length > 0) {
            return [item, ...childPath];
          }
        }
      }
      return [];
    };

    // Encontrar o caminho atual no menu
    const menuPath = findMenuPath(NAVIGATION_MENU, pathname);
    
    if (menuPath.length > 0) {
      // Adicionar items do menu encontrado (exceto o último que será marcado como ativo)
      menuPath.forEach((item, index) => {
        const isLast = index === menuPath.length - 1;
        breadcrumbs.push({
          label: item.label,
          href: isLast ? undefined : item.href,
          isActive: isLast,
        });
      });
    } else {
      // Fallback: gerar breadcrumbs baseado na URL
      const segments = pathname.split('/').filter(Boolean);
      
      segments.forEach((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = '/' + segments.slice(0, index + 1).join('/');
        
        // Capitalizar e formatar o segmento
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          label,
          href: isLast ? undefined : href,
          isActive: isLast,
        });
      });
    }

    return breadcrumbs;
  }, [pathname]);
};
