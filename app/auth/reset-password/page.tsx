import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordForm from '@/domains/auth/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Redefinir Senha - Neural Content',
  description: 'Crie uma nova senha para sua conta',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
