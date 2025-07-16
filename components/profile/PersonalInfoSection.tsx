// ============================================================================
// NEURAL CONTENT - SEÇÃO DE INFORMAÇÕES PESSOAIS
// ============================================================================

/**
 * Componente para edição de informações pessoais do usuário
 * 
 * @description Seção do perfil para editar nome, email, telefone, bio e avatar
 * seguindo padrões visuais do Trezo com edição inline
 * 
 * @version 1.0.0
 * @author NeuralContent Team
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { PersonalInfoSectionProps, UpdateProfileData } from '@/types/profile.types';
import { profileService } from '@/services/profile.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface FormState {
  name: string;
  phone: string;
  bio: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  bio?: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PersonalInfoSection({
  profile,
  loading = false,
  onUpdate,
  onAvatarUpload
}: PersonalInfoSectionProps) {

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [formState, setFormState] = useState<FormState>({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = useCallback((field: keyof FormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
    
    // Limpar erro do campo específico
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [validationErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!formState.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formState.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (formState.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formState.phone)) {
      errors.phone = 'Formato: (11) 99999-9999';
    }

    if (formState.bio && formState.bio.length > 500) {
      errors.bio = 'Bio deve ter no máximo 500 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formState]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    const updateData: UpdateProfileData = {
      name: formState.name.trim(),
      phone: formState.phone || undefined,
      bio: formState.bio || undefined,
    };

    try {
      await onUpdate(updateData);
      setIsEditing(false);
      setIsDirty(false);
    } catch (error) {
      console.error('Erro ao salvar informações pessoais:', error);
    }
  }, [validateForm, formState, onUpdate]);

  const handleCancel = useCallback(() => {
    setFormState({
      name: profile?.name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
    });
    setValidationErrors({});
    setIsEditing(false);
    setIsDirty(false);
  }, [profile]);

  const handleAvatarSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    const validation = profileService.validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Gerar preview
    try {
      const preview = await profileService.generateImagePreview(file);
      setAvatarPreview(preview);
      
      // Fazer upload
      await onAvatarUpload(file);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Erro ao processar avatar:', error);
      setAvatarPreview(null);
    }
  }, [onAvatarUpload]);

  const formatPhoneNumber = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  }, [formatPhoneNumber, handleInputChange]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informações Pessoais
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas informações pessoais e foto de perfil
            </p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
            >
              <span className="material-icons mr-2 text-sm">edit</span>
              Editar
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !isDirty}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <span className="material-icons animate-spin text-sm mr-2">refresh</span>
                ) : (
                  <span className="material-icons mr-2 text-sm">save</span>
                )}
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">person</span>
                    </div>
                  )}
                </div>
                
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="material-icons animate-spin text-white text-2xl">refresh</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleAvatarSelect}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
              >
                <span className="material-icons mr-2 text-sm">upload</span>
                Alterar Foto
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPEG, PNG ou WebP. Máximo 5MB.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${validationErrors.name 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      `}
                      placeholder="Seu nome completo"
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {profile?.name || 'Não informado'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <p className="text-gray-900 dark:text-white py-2 flex-1">
                    {profile?.email}
                  </p>
                  <span className="material-icons text-gray-400 ml-2">lock</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  O email não pode ser alterado por motivos de segurança
                </p>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formState.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${validationErrors.phone 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      `}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {profile?.phone || 'Não informado'}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografia
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      value={formState.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                        ${validationErrors.bio 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      `}
                      placeholder="Conte um pouco sobre você..."
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {validationErrors.bio ? (
                        <p className="text-red-500 text-xs">{validationErrors.bio}</p>
                      ) : (
                        <span></span>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formState.bio.length}/500
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white py-2 whitespace-pre-wrap">
                    {profile?.bio || 'Nenhuma biografia informada'}
                  </p>
                )}
              </div>

              {/* Informações da conta */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Membro desde:</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile?.createdAt 
                        ? new Date(profile.createdAt).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Última atualização:</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile?.updatedAt 
                        ? new Date(profile.updatedAt).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
