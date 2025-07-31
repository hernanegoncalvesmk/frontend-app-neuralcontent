"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/domains/shared/components/ui/Button';
import { authApi } from '@/domains/auth/api/auth.api';

const ConfirmEmailForm: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const emailParam = searchParams.get('email');
      
      if (emailParam) {
        setEmail(emailParam);
      }
      
      if (!token) {
        setStatus('error');
        setMessage(t('auth.confirmEmail.errors.tokenNotFound'));
        return;
      }

      try {
        console.log('🔄 Confirmando email com token:', token);
        
        // Aqui vamos fazer a chamada para confirmar o email usando a API correta
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/confirm-email`;
        console.log('🌐 URL da API:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        console.log('📊 Status da resposta:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Resposta de sucesso:', data);
          setStatus('success');
          setMessage(data.message || t('auth.confirmEmail.success.message'));
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error('❌ Erro ao fazer parse da resposta:', parseError);
            errorData = { message: 'Erro de resposta do servidor' };
          }
          console.error('❌ Erro na resposta:', errorData);
          setStatus('error');
          setMessage(errorData.message || `Erro ${response.status}: ${response.statusText}`);
        }
      } catch (error: any) {
        console.error('❌ Erro de conexão completo:', error);
        console.error('❌ Stack trace:', error.stack);
        setStatus('error');
        setMessage(t('auth.confirmEmail.errors.connection'));
      }
    };

    confirmEmail();
  }, [searchParams, t]);

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage(t('auth.confirmEmail.resend.emailRequired'));
      return;
    }

    setIsResending(true);
    setResendMessage('');

    try {
      console.log('🔄 Reenviando email para:', email);
      
      const response = await authApi.resendVerificationEmail(email);
      
      console.log('✅ Resposta do reenvio:', response);
      
      if (response.success) {
        setResendMessage(t('auth.confirmEmail.resend.success'));
      } else {
        setResendMessage(response.message || t('auth.confirmEmail.resend.error'));
      }
    } catch (err: any) {
      console.error('❌ Erro ao reenviar email:', err);
      setResendMessage(
        err?.response?.data?.message || 
        err?.message || 
        t('auth.confirmEmail.resend.error')
      );
    } finally {
      setIsResending(false);
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return 'hourglass_empty';
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'hourglass_empty';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20';
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
              alt="Confirmar Email"
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

            {/* Ícone de status */}
            <div className="mb-[25px] text-center lg:text-left">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${getBackgroundColor()} rounded-full mb-4`}>
                <i className={`material-symbols-outlined ${getIconColor()} text-2xl`}>
                  {getIcon()}
                </i>
              </div>
            </div>

            {/* Título e descrição */}
            <div className="mb-[25px]">
              <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                {status === 'loading' && t('auth.confirmEmail.titles.loading')}
                {status === 'success' && t('auth.confirmEmail.titles.success')}
                {status === 'error' && t('auth.confirmEmail.titles.error')}
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400 mb-4">
                {message}
              </p>
            </div>

            {/* Instruções baseadas no status */}
            {status === 'success' && (
              <div className="mb-[25px] p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                  {t('auth.confirmEmail.success.title')}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {t('auth.confirmEmail.success.description')}
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-[25px] p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">
                  {t('auth.confirmEmail.errors.title')}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                  {t('auth.confirmEmail.errors.description')}
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                  <li>{t('auth.confirmEmail.errors.causes.expired')}</li>
                  <li>{t('auth.confirmEmail.errors.causes.alreadyConfirmed')}</li>
                  <li>{t('auth.confirmEmail.errors.causes.usedMultipleTimes')}</li>
                </ul>
              </div>
            )}

            {/* Mensagem de reenvio */}
            {resendMessage && (
              <div className={`mb-[15px] p-3 border rounded-md ${
                resendMessage.includes('sucesso') || resendMessage.includes('successfully')
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
              }`}>
                <p className="text-sm">{resendMessage}</p>
              </div>
            )}

            {/* Ações */}
            <div className="space-y-4">
              {status === 'success' && (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-[5px] bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-md transition-all"
                >
                  <i className="material-symbols-outlined">login</i>
                  {t('auth.confirmEmail.actions.login')}
                </Link>
              )}

              {status === 'error' && (
                <div className="space-y-3">
                  {/* Campo de email para reenvio */}
                  {!email && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.confirmEmail.resend.emailLabel')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.confirmEmail.resend.emailPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Botões alinhados */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={handleResendEmail}
                      loading={isResending}
                      disabled={isResending || !email}
                      className="flex-1 sm:flex-initial"
                    >
                      <span className="flex items-center justify-center gap-[5px]">
                        <i className="material-symbols-outlined">refresh</i>
                        {isResending ? t('auth.confirmEmail.resend.sending') : t('auth.confirmEmail.resend.button')}
                      </span>
                    </Button>

                    <Link
                      href="/auth/register"
                      className="inline-flex items-center justify-center gap-[5px] bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-md transition-all flex-1 sm:flex-initial"
                    >
                      <i className="material-symbols-outlined">person_add</i>
                      {t('auth.confirmEmail.actions.createAccount')}
                    </Link>
                  </div>

                  {/* Texto do botão de reenvio */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {t('auth.confirmEmail.resend.question')}
                  </p>
                </div>
              )}

              {status === 'loading' && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">
                    {t('auth.confirmEmail.loading.processing')}
                  </span>
                </div>
              )}
            </div>

            {/* Link para suporte */}
            <div className="mt-[20px] text-center">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {t('auth.confirmEmail.support.question')}{" "}
                <Link
                  href="/support"
                  className="text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                >
                  {t('auth.confirmEmail.support.contact')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailForm;
