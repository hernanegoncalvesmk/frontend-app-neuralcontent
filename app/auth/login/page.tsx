import LoginForm from '@/domains/auth/components/LoginForm';
import LoginSuccessHandler from '@/domains/auth/components/LoginSuccessHandler';
import { Metadata } from 'next';

// Metadata será dinâmica via middleware de tradução
export const metadata: Metadata = {
  title: 'Login - Neural Content',
  description: 'Entre na sua conta Neural Content',
};

export default function LoginPage() {
  return (
    <div className="auth-main-content">
      <LoginForm />
      <LoginSuccessHandler />
    </div>
  );
}
