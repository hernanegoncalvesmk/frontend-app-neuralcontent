import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

// Metadata será dinâmica via middleware de tradução
export const metadata: Metadata = {
  title: 'Cadastro - Neural Content',
  description: 'Crie sua conta no Neural Content',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
