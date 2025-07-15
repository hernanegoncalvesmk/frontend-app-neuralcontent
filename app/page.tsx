import RedirectHandler from '@/components/RedirectHandler';

// Desabilitar static rendering para esta página
export const dynamic = 'force-dynamic';

export default function Home() {
  return <RedirectHandler />;
}
