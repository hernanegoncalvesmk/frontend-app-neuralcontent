import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Esqueci a Senha - Neural Content',
  description: 'Recupere sua senha do Neural Content',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
