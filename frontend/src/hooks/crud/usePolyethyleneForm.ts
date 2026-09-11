import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as polietilenoService from '../../services/polietilenoService';
import { DPolietileno } from '../../models/polietileno';
import { DTipoMaterialEnum } from '../../models/enums/tipoMaterial';
import { toast } from 'react-toastify';

/**
 * Custom hook for Polyethylene (Polietileno - Packaging) form management
 * Wraps useEntityForm with polietilenoService configuration
 * Handles date state for Flatpickr and enum options
 */
export function usePolyethyleneForm() {
  const params = useParams();
  const navigate = useNavigate();
  const polyethyleneId = params.polyethyleneId !== 'create' ? Number(params.polyethyleneId) : undefined;

  const [dateTimeStart, setDateTimeStart] = useState('');

  const tipoMaterialOptions = Object.values(DTipoMaterialEnum).map((item) => ({
    value: item.name,
    label: item.label,
  }));

  const {
    formData,
    setFormData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DPolietileno>({
    entityId: polyethyleneId,
    fetchFunction: polyethyleneId ? (id: string | number) => polietilenoService.pesquisarPorId(Number(id)) : undefined,
    createFunction: polietilenoService.criar,
    updateFunction: polietilenoService.atualizar,
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
      tipoMaterial: {
        value: null,
        id: 'tipoMaterial',
        name: 'tipoMaterial',
        type: 'select',
        placeholder: 'Tipo de Material',
        validation: (value: unknown) => value !== null,
        message: 'Tipo de Material é obrigatório',
      },
      implantacao: {
        value: '',
        id: 'implantacao',
        name: 'implantacao',
        type: 'date',
        placeholder: 'Implantação',
      },
      porcentagemPerda: {
        value: null,
        id: 'porcentagemPerda',
        name: 'porcentagemPerda',
        type: 'number',
        placeholder: 'Porcentagem de perda',
        validation: function (value: unknown) {
          return value === '' || value === null || Number(value) >= 0;
        },
        message: 'Porcentagem de perda não pode ser negativa',
      },
      valor: {
        value: null,
        id: 'valor',
        name: 'valor',
        type: 'number',
        placeholder: 'Valor',
        validation: function (value: unknown) {
          return value === '' || value === null || Number(value) >= 0;
        },
        message: 'Valor não pode ser negativo',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        porcentagemPerda: values.porcentagemPerda === '' || values.porcentagemPerda === null ? null : Number(values.porcentagemPerda),
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
        implantacao: dateTimeStart === '' ? null : dateTimeStart,
        tipoMaterial: (values.tipoMaterial as any)?.value,
      };

      if (polyethyleneId) {
        entity.codigo = polyethyleneId;
      }

      return entity;
    },
  });

  // Transform enum and date values after entity is loaded (edit mode)
  useEffect(() => {
    if (isEditing && polyethyleneId && formData.tipoMaterial.value) {
      const tipoMaterialValue = formData.tipoMaterial.value;
      const implantacaoValue = formData.implantacao.value;

      let needsUpdate = false;
      const updatedFormData = { ...formData };

      if (typeof tipoMaterialValue === 'string') {
        updatedFormData.tipoMaterial = { ...formData.tipoMaterial };
        updatedFormData.tipoMaterial.value = tipoMaterialOptions.find(option => option.value === tipoMaterialValue) || null;
        needsUpdate = true;
      }

      if (implantacaoValue) {
        setDateTimeStart(new Date(implantacaoValue as string).toISOString().split('T')[0]);
      }

      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    }
  }, [polyethyleneId, isEditing, formData, tipoMaterialOptions, setFormData]);

  const handleDateTimeStartChange = (selectedDateTime: string | Date[]) => {
    if (Array.isArray(selectedDateTime) && selectedDateTime.length > 0) {
      const selectedDate = selectedDateTime[0] as Date;
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateTimeStart(formattedDate);
    } else {
      setDateTimeStart('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Polietileno editado!' : 'Polietileno Inserido!';
      toast.success(successMessage);
      navigate('/polyethylenes');
    }
  }, [submitSuccess, isEditing, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return {
    formData,
    setFormData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit,
    isEditing,
    loading,
    tipoMaterialOptions,
    dateTimeStart,
    handleDateTimeStartChange,
  };
}
