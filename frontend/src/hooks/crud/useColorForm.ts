import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as corService from '../../services/corService';
import { DCor } from '../../models/cor';
import { toast } from 'react-toastify';

/**
 * Custom hook for Color (Cor) form management
 * Wraps useEntityForm with corService configuration
 */
export function useColorForm() {
  const params = useParams();
  const navigate = useNavigate();
  const colorId = params.colorId !== 'create' ? Number(params.colorId) : undefined;

  const {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DCor>({
    entityId: colorId,
    fetchFunction: colorId ? (id) => corService.pesquisarPorId(Number(id)) : undefined,
    createFunction: corService.criar,
    updateFunction: corService.atualizar,
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
      hexa: {
        value: '',
        id: 'hexa',
        name: 'hexa',
        type: 'text',
        placeholder: 'Hexa',
        validation: function (value: unknown) {
          return /^.{3,6}$/.test(value as string);
        },
        message: 'Hexa deve ter entre 3 e 6 caracteres',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        hexa: values.hexa === '' ? null : (values.hexa as string),
      };

      if (colorId) {
        entity.codigo = colorId;
      }

      return entity;
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Cor editada!' : 'Cor Inserida!';
      toast.success(successMessage);
      navigate('/colors');
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
