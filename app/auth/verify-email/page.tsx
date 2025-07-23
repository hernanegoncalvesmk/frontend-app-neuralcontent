import { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyEmailForm from '@/domains/auth/components/VerifyEmailForm';

export const metadata: Metadata = {
  title: 'Verify Email - Neural Content',
  description: 'Verify your email to activate your account',
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
