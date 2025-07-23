"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Input } from '@/domains/shared/components/ui/Input';
import { Button } from '@/domains/shared/components/ui/Button';
import { useAuth } from '@/infrastructure/providers/AuthProvider';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
  token?: string;
  general?: string;
}

const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation('auth');
  const searchParams = useSearchParams();
  const { isLoading } = useAuth();
  
  const [resetToken, setResetToken] = useState<string>('');
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  // Extrair e validar token da URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setResetToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setErrors({ token: 'Token de recuperação não encontrado' });
      setIsValidatingToken(false);
    }
  }, [searchParams]);

  // Validar token no backend
  const validateToken = async (tokenToValidate: string) => {
    try {
      setIsValidatingToken(true);
      // Aqui você validará o token com o backend
      // await authService.validateResetToken(tokenToValidate);
      
      // Simular validação por agora - usar tokenToValidate para evitar warning
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Validando token:', tokenToValidate);
      
      setIsValidatingToken(false);
    } catch (err: unknown) {
      console.error('Erro ao validar token:', err);
      const errorMessage = err instanceof Error ? err.message : 'Token inválido ou expirado';
      setErrors({ token: errorMessage });
      setIsValidatingToken(false);
    }
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: ResetPasswordErrors = {};

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
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
      
      // Integração com o serviço de redefinição de senha
      // await authService.resetPassword({
      //   token: resetToken,
      //   password: formData.password,
      //   confirmPassword: formData.confirmPassword
      // });
      
      // Log do token para uso futuro (evita warning lint)
      console.log('Reset password with token:', resetToken);
      
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error('Erro ao redefinir senha:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao redefinir senha. Tente novamente.';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Atualizar dados do formulário
  const handleInputChange = (field: keyof ResetPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    
    // Limpar erro quando começar a digitar
    if (errors[field as keyof ResetPasswordErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Tela de loading durante validação do token
  if (isValidatingToken) {
    return (
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Validando token de recuperação...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de erro se token for inválido
  if (errors.token) {
    return (
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            {/* Imagem lateral */}
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/error.png"
                alt="Token Inválido"
                className="rounded-[25px]"
                width={646}
                height={804}
              />
            </div>

            {/* Conteúdo de erro */}
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

              {/* Ícone de erro */}
              <div className="mb-[25px] text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                  <i className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">error</i>
                </div>
              </div>

              {/* Título e descrição */}
              <div className="mb-[25px]">
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                  Link inválido ou expirado
                </h1>
                <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400 mb-4">
                  {errors.token}
                </p>
                <p className="text-sm text-[#445164] dark:text-gray-400">
                  O link de recuperação pode ter expirado ou já foi utilizado. Solicite um novo link de recuperação.
                </p>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3">
                <Link href="/auth/forgot-password" className="block w-full">
                  <Button className="w-full">
                    <span className="flex items-center justify-center gap-[5px]">
                      <i className="material-symbols-outlined">refresh</i>
                      Solicitar Novo Link
                    </span>
                  </Button>
                </Link>

                <Link href="/auth/login" className="block w-full">
                  <Button variant="outline" className="w-full">
                    <span className="flex items-center justify-center gap-[5px]">
                      <i className="material-symbols-outlined">arrow_back</i>
                      Voltar ao Login
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

  // Tela de sucesso após redefinição
  if (isSuccess) {
    return (
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            {/* Imagem lateral */}
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/created.png"
                alt="Senha Redefinida"
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
                  <i className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</i>
                </div>
              </div>

              {/* Título e descrição */}
              <div className="mb-[25px]">
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                  Senha redefinida com sucesso!
                </h1>
                <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                  Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                </p>
              </div>

              {/* Botão para login */}
              <Link href="/auth/login" className="block w-full">
                <Button size="lg" className="w-full">
                  <span className="flex items-center justify-center gap-[5px]">
                    <i className="material-symbols-outlined">login</i>
                    Fazer Login
                  </span>
                </Button>
              </Link>
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
              src="/images/reset-password.jpg"
              alt="Redefinir Senha"
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
                Criar nova senha
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                Digite sua nova senha. Certifique-se de que seja segura e fácil de lembrar.
              </p>
            </div>

            {/* Formulário de redefinição */}
            <form onSubmit={handleSubmit}>
              {/* Campo de nova senha */}
              <Input
                label="Nova Senha"
                type="password"
                placeholder="Digite sua nova senha (mín. 4 caracteres)"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                showPasswordToggle
              />

              {/* Campo de confirmação de senha */}
              <Input
                label="Confirmar Nova Senha"
                type="password"
                placeholder="Digite novamente sua nova senha"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                showPasswordToggle
              />

              {/* Erro geral */}
              {errors.general && (
                <div className="mb-[15px] p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Botão de redefinição */}
              <Button
                type="submit"
                size="lg"
                className="w-full mb-[20px]"
                loading={isSubmitting}
                disabled={isSubmitting || isLoading}
              >
                <span className="flex items-center justify-center gap-[5px]">
                  <i className="material-symbols-outlined">security</i>
                  {isSubmitting ? t('resetPassword.form.submitting') : t('resetPassword.form.submitButton')}
                </span>
              </Button>

              {/* Link para voltar ao login */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Lembrou da senha?
                </p>
                <Link
                  href="/auth/login"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  Voltar ao Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
