import { Metadata } from 'next';
import { Suspense } from 'react';
import ConfirmEmailForm from '@/domains/auth/components/ConfirmEmailForm';

export const metadata: Metadata = {
  title: 'Confirm Email - Neural Content',
  description: 'Confirm your email to activate your account',
};

export default function ConfirmEmailPage() {
  return (
    <div className="auth-main-content">
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmEmailForm />
      </Suspense>
    </div>
  );
}
