import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as roteiroService from '../../services/roteiroService';
import { DRoteiro } from '../../models/roteiro';
import { toast } from 'react-toastify';

/**
 * Custom hook for Guide (Roteiro - Items) form management
 * Wraps useEntityForm with roteiroService configuration
 * Handles date state for Flatpickr (implantacao and dataFinal)
 */
export function useGuideForm() {
  const params = useParams();
  const navigate = useNavigate();
  const guideId = params.guideId !== 'create' ? Number(params.guideId) : undefined;

  const [dateTimeStart, setDateTimeStart] = useState('');
  const [dateTimeEnd, setDateTimeEnd] = useState('');

  const {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DRoteiro>({
    entityId: guideId,
    fetchFunction: guideId ? (id: string | number) => roteiroService.pesquisarPorId(Number(id)) : undefined,
    createFunction: roteiroService.criar,
    updateFunction: roteiroService.atualizar,
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
      implantacao: {
        value: '',
        id: 'implantacao',
        name: 'implantacao',
        type: 'date',
        placeholder: 'Implantação',
        validation: (value: unknown) => value !== null,
        message: 'Implantação é obrigatório',
      },
      dataFinal: {
        value: '',
        id: 'dataFinal',
        name: 'dataFinal',
        type: 'date',
        placeholder: 'Data Final',
      },
      valor: {
        value: null,
        id: 'valor',
        name: 'valor',
        type: 'number',
        placeholder: 'Valor',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Valor não pode ser negativo',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        implantacao: dateTimeStart === '' ? null : dateTimeStart,
        dataFinal: dateTimeEnd === '' ? null : dateTimeEnd,
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
      };

      if (guideId) {
        entity.codigo = guideId;
      }

      return entity;
    },
  });

  // Transform date values after entity is loaded (edit mode)
  useEffect(() => {
    if (isEditing && guideId) {
      const implantacaoValue = formData.implantacao.value;
      const dataFinalValue = formData.dataFinal.value;

      if (implantacaoValue) {
        setDateTimeStart(new Date(implantacaoValue as string).toISOString().split('T')[0]);
      }

      if (dataFinalValue) {
        setDateTimeEnd(new Date(dataFinalValue as string).toISOString().split('T')[0]);
      }
    }
  }, [guideId, isEditing, formData]);

  const handleDateTimeStartChange = (selectedDateTime: string | Date[]) => {
    if (Array.isArray(selectedDateTime) && selectedDateTime.length > 0) {
      const selectedDate = selectedDateTime[0] as Date;
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateTimeStart(formattedDate);
    } else {
      setDateTimeStart('');
    }
  };

  const handleDateTimeEndChange = (selectedDateTime: string | Date[]) => {
    if (Array.isArray(selectedDateTime) && selectedDateTime.length > 0) {
      const selectedDate = selectedDateTime[0] as Date;
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateTimeEnd(formattedDate);
    } else {
      setDateTimeEnd('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Roteiro editado!' : 'Roteiro Inserido!';
      toast.success(successMessage);
      navigate('/guides');
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
    dateTimeStart,
    dateTimeEnd,
    handleDateTimeStartChange,
    handleDateTimeEndChange,
  };
}
