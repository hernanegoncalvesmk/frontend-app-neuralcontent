import { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyEmailForm from '@/components/auth/VerifyEmailForm';

export const metadata: Metadata = {
  title: 'Verificar Email - Neural Content',
  description: 'Verifique seu email para ativar sua conta',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
