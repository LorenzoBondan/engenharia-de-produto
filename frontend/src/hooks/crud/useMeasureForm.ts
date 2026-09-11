import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as medidasService from '../../services/medidasService';
import { DMedidas } from '../../models/medidas';
import { toast } from 'react-toastify';

/**
 * Custom hook for Measure (Medidas) form management
 * Wraps useEntityForm with medidasService configuration
 */
export function useMeasureForm() {
  const params = useParams();
  const navigate = useNavigate();
  const measureId = params.measureId !== 'create' ? Number(params.measureId) : undefined;

  const {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DMedidas>({
    entityId: measureId,
    fetchFunction: measureId ? (id: string | number) => medidasService.pesquisarPorId(Number(id)) : undefined,
    createFunction: medidasService.criar,
    updateFunction: medidasService.atualizar,
    initialFormData: {
      altura: {
        value: null,
        id: 'altura',
        name: 'altura',
        type: 'number',
        placeholder: 'Altura',
        validation: function (value: any) {
          return value !== null && Number(value) >= 0;
        },
        message: 'Altura não pode ser negativa',
      },
      largura: {
        value: null,
        id: 'largura',
        name: 'largura',
        type: 'number',
        placeholder: 'Largura',
        validation: function (value: any) {
          return value !== null && Number(value) >= 0;
        },
        message: 'Largura não pode ser negativa',
      },
      espessura: {
        value: null,
        id: 'espessura',
        name: 'espessura',
        type: 'number',
        placeholder: 'Espessura',
        validation: function (value: any) {
          return value !== null && Number(value) >= 0;
        },
        message: 'Espessura não pode ser negativa',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        altura: Number(values.altura),
        largura: Number(values.largura),
        espessura: Number(values.espessura),
      };

      if (measureId) {
        entity.codigo = measureId;
      }

      return entity;
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Medidas editadas!' : 'Medidas Inseridas!';
      toast.success(successMessage);
      navigate('/measures');
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
