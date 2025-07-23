"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Input } from '@/domains/shared/components/ui/Input';
import { Button } from '@/domains/shared/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { isValidEmail } from '@/lib/utils';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const { t } = useTranslation('auth');
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<LoginErrors>({});

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email) {
      newErrors.email = t('login.validation.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('login.validation.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('login.validation.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.validation.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      
      // Redirecionamento será feito pelo AuthProvider após login bem-sucedido
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Erro no login:', err);
      const errorMessage = err instanceof Error ? err.message : t('login.validation.invalidCredentials');
      setErrors({ general: errorMessage });
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando começar a digitar
    if (errors[field as keyof LoginErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          {/* Imagem lateral */}
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
            <Image
              src="/images/sign-in.jpg"
              alt="Neural Content Login"
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
                {t('login.title')}
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                {t('login.subtitle')}
              </p>
            </div>

            {/* Botões de redes sociais */}
            <div className="flex items-center justify-between mb-[20px] md:mb-[23px] gap-[12px]">
              <Button
                variant="outline"
                className="flex-1 h-[45px]"
                type="button"
              >
                <Image
                  src="/images/icons/google.svg"
                  className="inline-block"
                  alt="Google"
                  width={25}
                  height={25}
                />
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-[45px]"
                type="button"
              >
                <Image
                  src="/images/icons/facebook2.svg"
                  className="inline-block"
                  alt="Facebook"
                  width={25}
                  height={25}
                />
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-[45px]"
                type="button"
              >
                <Image
                  src="/images/icons/apple.svg"
                  className="inline-block"
                  alt="Apple"
                  width={25}
                  height={25}
                />
              </Button>
            </div>

            {/* Separador */}
            <div className="relative mb-[20px]">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-[#172036]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#0a0e19] text-gray-500 dark:text-gray-400">
                  {t('login.divider')}
                </span>
              </div>
            </div>

            {/* Formulário de login */}
            <form onSubmit={handleSubmit}>
              {/* Campo de email */}
              <Input
                label={t('login.fields.email')}
                type="email"
                placeholder={t('login.placeholders.email')}
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
              />

              {/* Campo de senha */}
              <Input
                label={t('login.fields.password')}
                type="password"
                placeholder={t('login.placeholders.password')}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                showPasswordToggle
              />

              {/* Checkbox Lembrar-me e Link Esqueci a senha */}
              <div className="flex items-center justify-between mb-[20px]">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                    className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('login.rememberMe')}
                  </span>
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>

              {/* Erro geral */}
              {(errors.general || error) && (
                <div className="mb-[15px] p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.general || error}
                  </p>
                </div>
              )}

              {/* Botão de login */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">login</i>
                  {isLoading ? t('login.loginButtonLoading') : t('login.loginButton')}
                </span>
              </Button>

              {/* Link para cadastro */}
              <p className="mt-[15px] md:mt-[20px] text-center text-gray-600 dark:text-gray-400">
                {t('login.noAccount')}{" "}
                <Link
                  href="/auth/register"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  {t('login.signUpLink')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
