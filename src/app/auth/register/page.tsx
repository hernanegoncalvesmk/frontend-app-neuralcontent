import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Cadastro - Neural Content',
  description: 'Crie sua conta no Neural Content',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
