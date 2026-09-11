import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as modeloService from '../../services/modeloService';
import { DModelo } from '../../models/modelo';
import { toast } from 'react-toastify';

/**
 * Custom hook for Model (Modelo) form management
 * Wraps useEntityForm with modeloService configuration
 */
export function useModelForm() {
  const params = useParams();
  const navigate = useNavigate();
  const modelId = params.modelId !== 'create' ? Number(params.modelId) : undefined;

  const {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DModelo>({
    entityId: modelId,
    fetchFunction: modelId ? (id) => modeloService.pesquisarPorId(typeof id === 'string' ? Number(id) : id) : undefined,
    createFunction: modeloService.criar,
    updateFunction: modeloService.atualizar,
    initialFormData: {
      descricao: {
        value: '',
        id: 'descricao',
        name: 'descricao',
        type: 'text',
        placeholder: 'Descrição',
        validation: function (value: unknown) {
          return /^.{3,50}$/.test(value as string);
        },
        message: 'Descrição deve ter entre 3 e 50 caracteres',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        descricao: values.descricao as string,
      };

      if (modelId) {
        entity.codigo = modelId;
      }

      return entity;
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Modelo editado!' : 'Modelo Inserido!';
      toast.success(successMessage);
      navigate('/models');
    }
  }, [submitSuccess, isEditing, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit,
    isEditing,
    loading,
  };
}
