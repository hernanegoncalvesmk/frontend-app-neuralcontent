"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/domains/translations';
import { TranslationNamespace } from '@/domains/translations/types/translation.types';
import { Input } from '@/domains/shared/components/ui/Input';
import { Button } from '@/domains/shared/components/ui/Button';
import { useAuth } from '@/infrastructure/providers/AuthProvider';
import { isValidEmail } from '@/lib/utils';
import CountrySelector from './CountrySelector';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthDate: string;
  country: string;
  acceptTerms: boolean;
}

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  birthDate?: string;
  country?: string;
  acceptTerms?: string;
  general?: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const { tns } = useTranslation();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    country: 'BR', // Default para Brasil
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState<RegisterErrors>({});

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // Nome completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = tns(TranslationNamespace.VALIDATION, 'form.fullName.required');
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = tns(TranslationNamespace.VALIDATION, 'form.fullName.minLength', { min: 2 });
    }

    // Email
    if (!formData.email) {
      newErrors.email = tns(TranslationNamespace.VALIDATION, 'form.email.required');
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = tns(TranslationNamespace.VALIDATION, 'form.email.invalid');
    }

    // Senha
    if (!formData.password) {
      newErrors.password = tns(TranslationNamespace.VALIDATION, 'form.password.required');
    } else if (formData.password.length < 8) {
      newErrors.password = tns(TranslationNamespace.VALIDATION, 'form.password.minLength', { min: 8 });
    }

    // Confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = tns(TranslationNamespace.VALIDATION, 'form.password.required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = tns(TranslationNamespace.VALIDATION, 'form.password.mismatch');
    }

    // Telefone
    if (!formData.phone.trim()) {
      newErrors.phone = tns(TranslationNamespace.VALIDATION, 'form.phone.required');
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = tns(TranslationNamespace.VALIDATION, 'form.phone.minLength', { min: 8 });
    }

    // Data de nascimento
    if (!formData.birthDate) {
      newErrors.birthDate = tns(TranslationNamespace.VALIDATION, 'form.birthDate.required');
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthDate = tns(TranslationNamespace.VALIDATION, 'form.age.minimum', { min: 13 });
      }
    }

    // País
    if (!formData.country) {
      newErrors.country = tns(TranslationNamespace.VALIDATION, 'form.country.required');
    }

    // Termos de uso
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = tns(TranslationNamespace.VALIDATION, 'form.terms.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.acceptTerms,
        agreeToPrivacy: formData.acceptTerms,  // Usando o mesmo valor por enquanto
        language: 'pt-BR'
      });
      
      // Redirecionamento para página de verificação de email
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
    } catch (err: unknown) {
      console.error('Erro no cadastro:', err);
      const errorMessage = err instanceof Error ? err.message : tns(TranslationNamespace.ERRORS, 'auth.registrationFailed');
      setErrors({ general: errorMessage });
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = field === 'acceptTerms' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando começar a digitar
    if (errors[field as keyof RegisterErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[100px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          {/* Imagem lateral */}
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
            <Image
              src="/images/sign-up.jpg"
              alt="Neural Content Cadastro"
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
                {tns(TranslationNamespace.AUTH, 'register.title')}
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                {tns(TranslationNamespace.AUTH, 'register.subtitle')}
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
                  {tns(TranslationNamespace.AUTH, 'register.divider')}
                </span>
              </div>
            </div>

            {/* Formulário de cadastro */}
            <form onSubmit={handleSubmit}>
              {/* Nome completo */}
              <Input
                label={tns(TranslationNamespace.AUTH, 'register.fullName')}
                type="text"
                placeholder={tns(TranslationNamespace.AUTH, 'register.fullNamePlaceholder')}
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                error={errors.fullName}
              />

              {/* Email */}
              <Input
                label={tns(TranslationNamespace.AUTH, 'register.email')}
                type="email"
                placeholder={tns(TranslationNamespace.AUTH, 'register.emailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
              />

              {/* Senha */}
              <Input
                label={tns(TranslationNamespace.AUTH, 'register.password')}
                type="password"
                placeholder={tns(TranslationNamespace.AUTH, 'register.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                showPasswordToggle
              />

              {/* Confirmação de senha */}
              <Input
                label={tns(TranslationNamespace.AUTH, 'register.confirmPassword')}
                type="password"
                placeholder={tns(TranslationNamespace.AUTH, 'register.confirmPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                showPasswordToggle
              />

              {/* Telefone */}
              <Input
                label={tns(TranslationNamespace.AUTH, 'register.phone')}
                type="tel"
                placeholder={tns(TranslationNamespace.AUTH, 'register.phonePlaceholder')}
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={errors.phone}
              />

              {/* Data de nascimento */}
              <Input
                label={tns(TranslationNamespace.AUTH, 'register.birthDate')}
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange('birthDate')}
                error={errors.birthDate}
              />

              {/* País */}
              <div className="mb-[20px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {tns(TranslationNamespace.AUTH, 'register.country')}
                </label>
                <CountrySelector
                  value={formData.country}
                  onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                  error={errors.country}
                  placeholder={tns(TranslationNamespace.AUTH, 'register.countryPlaceholder')}
                />
              </div>

              {/* Checkbox Termos e Política */}
              <div className="mb-[20px]">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange('acceptTerms')}
                    className="mt-1 mr-3 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tns(TranslationNamespace.AUTH, 'register.acceptTerms')}{" "}
                    <Link
                      href="/terms"
                      className="text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                    >
                      {tns(TranslationNamespace.COMMON, 'legal.termsOfService')}
                    </Link>
                    {" "}{tns(TranslationNamespace.COMMON, 'common.and')}{" "}
                    <Link
                      href="/privacy"
                      className="text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                    >
                      {tns(TranslationNamespace.COMMON, 'legal.privacyPolicy')}
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Erro geral */}
              {(errors.general || error) && (
                <div className="mb-[15px] p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.general || error}
                  </p>
                </div>
              )}

              {/* Botão de cadastro */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">person_add</i>
                  {isLoading ? tns(TranslationNamespace.COMMON, 'status.loading') : tns(TranslationNamespace.AUTH, 'register.submitButton')}
                </span>
              </Button>

              {/* Link para login */}
              <p className="mt-[15px] md:mt-[20px] text-center text-gray-600 dark:text-gray-400">
                {tns(TranslationNamespace.AUTH, 'register.hasAccount')}{" "}
                <Link
                  href="/auth/login"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  {tns(TranslationNamespace.AUTH, 'register.signInLink')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
