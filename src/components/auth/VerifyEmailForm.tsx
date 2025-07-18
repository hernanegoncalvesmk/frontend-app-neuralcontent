"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

const VerifyEmailForm: React.FC = () => {
  const { t } = useTranslation('auth');
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      // Aqui você implementará a chamada para reenviar o email
      // await authService.resendVerificationEmail(email);
      
      setResendMessage(t('verifyEmail.resend.success'));
    } catch (err) {
      console.error('Erro ao reenviar email:', err);
      setResendMessage(t('verifyEmail.resend.error'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          {/* Imagem lateral */}
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
            <Image
              src="/images/confirm-email.jpg"
              alt="Verificar Email"
              className="rounded-[25px]"
              width={646}
              height={804}
            />
          </div>

          {/* Conteúdo */}
          <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2">
            {/* Logo */}
            <div className="mb-[25px] text-center lg:text-left">
              <Image
                src="/images/logo-big.svg"
                alt="Neural Content"
                className="inline-block dark:hidden"
                width={142}
                height={38}
              />
              <Image
                src="/images/white-logo-big.svg"
                alt="Neural Content"
                className="hidden dark:inline-block"
                width={142}
                height={38}
              />
            </div>

            {/* Ícone de sucesso */}
            <div className="mb-[25px] text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">mark_email_read</i>
              </div>
            </div>

            {/* Título e descrição */}
            <div className="mb-[25px]">
              <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                {t('verifyEmail.title')}
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400 mb-4">
                {t('verifyEmail.subtitle')}
              </p>
              {email && (
                <p className="font-semibold text-primary-500 mb-4">
                  {email}
                </p>
              )}
              <p className="text-sm text-[#445164] dark:text-gray-400">
                {t('verifyEmail.description')}
              </p>
            </div>

            {/* Instruções */}
            <div className="mb-[25px] p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                {t('verifyEmail.steps.title')}
              </h3>
              <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>{t('verifyEmail.steps.step1')}</li>
                <li>{t('verifyEmail.steps.step2')}</li>
                <li>{t('verifyEmail.steps.step3')}</li>
                <li>{t('verifyEmail.steps.step4')}</li>
              </ol>
            </div>

            {/* Mensagem de reenvio */}
            {resendMessage && (
              <div className={`mb-[15px] p-3 border rounded-md ${
                resendMessage.includes('sucesso') 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
              }`}>
                <p className="text-sm">{resendMessage}</p>
              </div>
            )}

            {/* Botão para reenviar email */}
            <div className="mb-[20px]">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t('verifyEmail.resend.question')}
              </p>
              <Button
                variant="outline"
                onClick={handleResendEmail}
                loading={isResending}
                disabled={isResending || !email}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">refresh</i>
                  {isResending ? t('verifyEmail.resend.sending') : t('verifyEmail.resend.button')}
                </span>
              </Button>
            </div>

            {/* Link para login */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {t('verifyEmail.login.question')}
              </p>
              <Link
                href="/auth/login"
                className="text-primary-500 transition-all font-semibold hover:underline"
              >
                {t('verifyEmail.login.link')}
              </Link>
            </div>

            {/* Link para suporte */}
            <div className="mt-[20px] text-center">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t('verifyEmail.support.question')}{" "}
                <Link
                  href="/support"
                  className="text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                >
                  {t('verifyEmail.support.link')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
