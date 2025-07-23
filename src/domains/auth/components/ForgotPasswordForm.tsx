"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Input } from '@/domains/shared/components/ui/Input';
import { Button } from '@/domains/shared/components/ui/Button';
import { useAuth } from '@/infrastructure/providers/AuthProvider';
import { isValidEmail } from '@/lib/utils';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordErrors {
  email?: string;
  general?: string;
}

const ForgotPasswordForm: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation('auth');
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!formData.email) {
      newErrors.email = t('forgotPassword.emailNotFound');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Integração com o serviço de recuperação de senha
      // await authService.forgotPassword({ email: formData.email });
      
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Erro ao solicitar recuperação:', err);
      const errorMessage = err instanceof Error ? err.message : t('errors.serverError');
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (field: keyof ForgotPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Limpar erro quando começar a digitar
    if (errors[field as keyof ForgotPasswordErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Se já foi enviado com sucesso, mostrar tela de confirmação
  if (isSuccess) {
    return (
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            {/* Imagem lateral */}
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/forgot-password.jpg"
                alt="Email Enviado"
                className="rounded-[25px]"
                width={646}
                height={804}
              />
            </div>

            {/* Conteúdo de sucesso */}
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
                  {t('forgotPassword.emailSent')}
                </h1>
                <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400 mb-4">
                  {t('forgotPassword.emailSentSubtitle')}
                </p>
                <p className="font-semibold text-primary-500 mb-4">
                  {formData.email}
                </p>
                <p className="text-sm text-[#445164] dark:text-gray-400">
                  {t('forgotPassword.emailSentDescription')}
                </p>
              </div>

              {/* Instruções */}
              <div className="mb-[25px] p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  {t('forgotPassword.nextSteps')}
                </h3>
                <ol className="list-decimal list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>{t('forgotPassword.step1')}</li>
                  <li>{t('forgotPassword.step2')}</li>
                  <li>{t('forgotPassword.step3')}</li>
                  <li>{t('forgotPassword.step4')}</li>
                </ol>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                  className="w-full"
                >
                  <span className="flex items-center justify-center gap-[5px]">
                    <i className="material-symbols-outlined">refresh</i>
                    {t('forgotPassword.sendAgain')}
                  </span>
                </Button>

                <Link
                  href="/auth/login"
                  className="block w-full"
                >
                  <Button variant="ghost" className="w-full">
                    <span className="flex items-center justify-center gap-[5px]">
                      <i className="material-symbols-outlined">arrow_back</i>
                      {t('forgotPassword.backToLogin')}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          {/* Imagem lateral */}
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
            <Image
              src="/images/forgot-password.jpg"
              alt="Recuperar Senha"
              className="rounded-[25px]"
              width={646}
              height={804}
            />
          </div>

          {/* Formulário */}
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

            {/* Título e descrição */}
            <div className="mb-[17px] md:mb-[25px]">
              <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                {t('forgotPassword.title')}
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                {t('forgotPassword.subtitle')}
              </p>
            </div>

            {/* Formulário de recuperação */}
            <form onSubmit={handleSubmit}>
              {/* Campo de email */}
              <Input
                label={t('forgotPassword.email')}
                type="email"
                placeholder={t('forgotPassword.emailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
              />

              {/* Erro geral */}
              {errors.general && (
                <div className="mb-[15px] p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Botão de envio */}
              <Button
                type="submit"
                size="lg"
                className="w-full mb-[20px]"
                loading={isSubmitting}
                disabled={isSubmitting || isLoading}
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">send</i>
                  {isSubmitting ? t('forgotPassword.sendButtonLoading') : t('forgotPassword.sendButton')}
                </span>
              </Button>

              {/* Link para voltar ao login */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {t('forgotPassword.rememberedPassword')}
                </p>
                <Link
                  href="/auth/login"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  {t('forgotPassword.backToLogin')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
