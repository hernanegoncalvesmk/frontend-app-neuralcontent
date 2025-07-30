import { Metadata } from 'next';
import ForgotPasswordForm from '@/domains/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Esqueci a Senha - Neural Content',
  description: 'Recupere sua senha do Neural Content',
};

export default function ForgotPasswordPage() {
  return (
    <div className="auth-main-content">
      <ForgotPasswordForm />
    </div>
  );
}
