import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as pinturaService from '../../services/pinturaService';
import * as corService from '../../services/corService';
import { DPintura } from '../../models/pintura';
import { DCor } from '../../models/cor';
import { toast } from 'react-toastify';
import { DTipoMaterialEnum } from '../../models/enums/tipoMaterial';
import { DTipoPinturaEnum } from '../../models/enums/tipoPintura';

/**
 * Custom hook for Painting (Pintura - MDF) form management
 * Wraps useEntityForm with pinturaService configuration
 * Loads color options and handles date state for Flatpickr
 */
export function usePaintingForm() {
  const params = useParams();
  const navigate = useNavigate();
  const paintingId = params.paintingId !== 'create' ? Number(params.paintingId) : undefined;

  const [cores, setCores] = useState<DCor[]>([]);
  const [dateTimeStart, setDateTimeStart] = useState('');

  const tipoMaterialOptions = Object.values(DTipoMaterialEnum).map((item) => ({
    value: item.name,
    label: item.label,
  }));

  const tipoPinturaOptions = Object.values(DTipoPinturaEnum).map((item) => ({
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
  } = useEntityForm<DPintura>({
    entityId: paintingId,
    fetchFunction: paintingId ? (id: string | number) => pinturaService.pesquisarPorId(Number(id)) : undefined,
    createFunction: pinturaService.criar,
    updateFunction: pinturaService.atualizar,
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
      cor: {
        value: null,
        id: 'cor',
        name: 'cor',
        type: 'select',
        placeholder: 'Cor',
        validation: (value: unknown) => value !== null,
        message: 'Cor é obrigatória',
      },
      tipoPintura: {
        value: null,
        id: 'tipoPintura',
        name: 'tipoPintura',
        type: 'select',
        placeholder: 'Tipo de Pintura',
        validation: (value: unknown) => value !== null,
        message: 'Tipo de Pintura é obrigatório',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        porcentagemPerda: values.porcentagemPerda === '' || values.porcentagemPerda === null ? null : Number(values.porcentagemPerda),
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
        implantacao: dateTimeStart === '' ? null : dateTimeStart,
        tipoMaterial: (values.tipoMaterial as any)?.value,
        tipoPintura: (values.tipoPintura as any)?.value,
        cor: values.cor,
      };

      if (paintingId) {
        entity.codigo = paintingId;
      }

      return entity;
    },
  });

  // Load cores for dropdown
  useEffect(() => {
    const loadCores = async () => {
      try {
        const response = await corService.pesquisarTodos('', '', '');
        setCores(response.data.content);
      } catch (error) {
        console.error('Error loading cores:', error);
      }
    };

    loadCores();
  }, []);

  // Transform enum and date values after entity is loaded (edit mode)
  useEffect(() => {
    if (isEditing && paintingId && formData.tipoMaterial.value) {
      const tipoMaterialValue = formData.tipoMaterial.value;
      const tipoPinturaValue = formData.tipoPintura.value;
      const implantacaoValue = formData.implantacao.value;

      let needsUpdate = false;
      const updatedFormData = { ...formData };

      // Transform tipoMaterial enum string to option object
      if (typeof tipoMaterialValue === 'string') {
        updatedFormData.tipoMaterial = { ...formData.tipoMaterial };
        updatedFormData.tipoMaterial.value = tipoMaterialOptions.find(option => option.value === tipoMaterialValue) || null;
        needsUpdate = true;
      }

      // Transform tipoPintura enum string to option object
      if (typeof tipoPinturaValue === 'string') {
        updatedFormData.tipoPintura = { ...formData.tipoPintura };
        updatedFormData.tipoPintura.value = tipoPinturaOptions.find(option => option.value === tipoPinturaValue) || null;
        needsUpdate = true;
      }

      // Set date from implantacao field
      if (implantacaoValue) {
        setDateTimeStart(new Date(implantacaoValue as string).toISOString().split('T')[0]);
      }

      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    }
  }, [paintingId, isEditing, formData, tipoMaterialOptions, tipoPinturaOptions, setFormData]);

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
      const successMessage = isEditing ? 'Pintura editada!' : 'Pintura Inserida!';
      toast.success(successMessage);
      navigate('/paintings');
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
    cores,
    tipoMaterialOptions,
    tipoPinturaOptions,
    dateTimeStart,
    handleDateTimeStartChange,
  };
}
