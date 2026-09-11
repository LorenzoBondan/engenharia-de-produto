import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as categoriaComponenteService from '../../services/categoriaComponenteService';
import { DCategoriaComponente } from '../../models/categoriaComponente';
import { toast } from 'react-toastify';

/**
 * Custom hook for Component Category (Categoria Componente) form management
 * Wraps useEntityForm with categoriaComponenteService configuration
 */
export function useComponentCategoryForm() {
  const params = useParams();
  const navigate = useNavigate();
  const componentCategoryId = params.componentCategoryId !== 'create' ? Number(params.componentCategoryId) : undefined;

  const {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DCategoriaComponente>({
    entityId: componentCategoryId,
    fetchFunction: componentCategoryId ? (id) => categoriaComponenteService.pesquisarPorId(typeof id === 'string' ? Number(id) : id) : undefined,
    createFunction: categoriaComponenteService.criar,
    updateFunction: categoriaComponenteService.atualizar,
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

      if (componentCategoryId) {
        entity.codigo = componentCategoryId;
      }

      return entity;
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Categoria de componente editada!' : 'Categoria de componente Inserida!';
      toast.success(successMessage);
      navigate('/componentcategories');
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
