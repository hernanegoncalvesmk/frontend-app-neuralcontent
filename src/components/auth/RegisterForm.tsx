"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { isValidEmail } from '@/lib/utils';

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

// Lista de países mais comuns
const COUNTRIES = [
  { value: 'BR', label: 'Brasil' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'PT', label: 'Portugal' },
  { value: 'ES', label: 'Espanha' },
  { value: 'AR', label: 'Argentina' },
  { value: 'MX', label: 'México' },
  { value: 'CO', label: 'Colômbia' },
  { value: 'CL', label: 'Chile' },
  { value: 'PE', label: 'Peru' },
  { value: 'UY', label: 'Uruguai' },
  { value: 'PY', label: 'Paraguai' },
  { value: 'BO', label: 'Bolívia' },
  { value: 'EC', label: 'Equador' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'FR', label: 'França' },
  { value: 'DE', label: 'Alemanha' },
  { value: 'IT', label: 'Itália' },
  { value: 'GB', label: 'Reino Unido' },
  { value: 'CA', label: 'Canadá' },
  { value: 'AU', label: 'Austrália' },
].sort((a, b) => a.label.localeCompare(b.label));

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  
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
      newErrors.fullName = 'Nome completo é obrigatório';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }

    // Confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Telefone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Telefone deve ter pelo menos 8 dígitos';
    }

    // Data de nascimento
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthDate = 'Você deve ter pelo menos 13 anos';
      }
    }

    // País
    if (!formData.country) {
      newErrors.country = 'País é obrigatório';
    }

    // Termos de uso
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso e política de privacidade';
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
        fullName: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
        country: formData.country
      });
      
      // Redirecionamento para página de verificação de email
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
    } catch (err: unknown) {
      console.error('Erro no cadastro:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
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
                Crie sua conta no Neural Content!
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                Cadastre-se com suas redes sociais ou preencha os dados abaixo
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
                  ou
                </span>
              </div>
            </div>

            {/* Formulário de cadastro */}
            <form onSubmit={handleSubmit}>
              {/* Nome completo */}
              <Input
                label="Nome Completo"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                error={errors.fullName}
              />

              {/* Email */}
              <Input
                label="Endereço de Email"
                type="email"
                placeholder="exemplo@neuralcontent.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
              />

              {/* Senha */}
              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha (mín. 4 caracteres)"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                showPasswordToggle
              />

              {/* Confirmação de senha */}
              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="Digite novamente sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                showPasswordToggle
              />

              {/* Telefone */}
              <Input
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={errors.phone}
              />

              {/* Data de nascimento */}
              <Input
                label="Data de Nascimento"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange('birthDate')}
                error={errors.birthDate}
              />

              {/* País */}
              <div className="mb-[20px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <select
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-[#172036] text-gray-900 dark:text-white transition-all ${
                    errors.country 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-[#2d3c5b] focus:border-primary-500'
                  } focus:outline-none focus:ring-1 focus:ring-primary-500`}
                >
                  <option value="">Selecione seu país</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.country}
                  </p>
                )}
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
                    Eu aceito os{" "}
                    <Link
                      href="/terms"
                      className="text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                    >
                      Termos de Uso
                    </Link>
                    {" "}e a{" "}
                    <Link
                      href="/privacy"
                      className="text-primary-500 hover:text-primary-400 transition-all font-semibold hover:underline"
                    >
                      Política de Privacidade
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
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </span>
              </Button>

              {/* Link para login */}
              <p className="mt-[15px] md:mt-[20px] text-center text-gray-600 dark:text-gray-400">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  Faça login
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
