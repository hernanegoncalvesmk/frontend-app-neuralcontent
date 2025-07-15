import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Neural Content',
  description: 'Entre na sua conta Neural Content',
};

export default function LoginPage() {
  return <LoginForm />;
}
