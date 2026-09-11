import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as pinturaBordaFundoService from '../../services/pinturaBordaFundoService';
import * as corService from '../../services/corService';
import { DPinturaBordaFundo } from '../../models/pinturaBordaFundo';
import { DCor } from '../../models/cor';
import { toast } from 'react-toastify';
import { DTipoMaterialEnum } from '../../models/enums/tipoMaterial';

/**
 * Custom hook for Painting Border Background (Pintura Borda Fundo - MDF) form management
 * Wraps useEntityForm with pinturaBordaFundoService configuration
 * Loads color options and handles date state for Flatpickr
 */
export function usePaintingBorderBackgroundForm() {
  const params = useParams();
  const navigate = useNavigate();
  const paintingBorderBackgroundId = params.paintingBorderBackgroundId !== 'create' ? Number(params.paintingBorderBackgroundId) : undefined;

  const [cores, setCores] = useState<DCor[]>([]);
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
  } = useEntityForm<DPinturaBordaFundo>({
    entityId: paintingBorderBackgroundId,
    fetchFunction: paintingBorderBackgroundId ? (id: string | number) => pinturaBordaFundoService.pesquisarPorId(Number(id)) : undefined,
    createFunction: pinturaBordaFundoService.criar,
    updateFunction: pinturaBordaFundoService.atualizar,
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
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        porcentagemPerda: values.porcentagemPerda === '' || values.porcentagemPerda === null ? null : Number(values.porcentagemPerda),
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
        implantacao: dateTimeStart === '' ? null : dateTimeStart,
        tipoMaterial: (values.tipoMaterial as any)?.value,
        cor: values.cor === '' ? null : values.cor,
      };

      if (paintingBorderBackgroundId) {
        entity.codigo = paintingBorderBackgroundId;
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
    if (isEditing && paintingBorderBackgroundId && formData.tipoMaterial.value) {
      const tipoMaterialValue = formData.tipoMaterial.value;
      const implantacaoValue = formData.implantacao.value;

      let needsUpdate = false;
      const updatedFormData = { ...formData };

      // Transform tipoMaterial enum string to option object
      if (typeof tipoMaterialValue === 'string') {
        updatedFormData.tipoMaterial = { ...formData.tipoMaterial };
        updatedFormData.tipoMaterial.value = tipoMaterialOptions.find(option => option.value === tipoMaterialValue) || null;
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
  }, [paintingBorderBackgroundId, isEditing, formData, tipoMaterialOptions, setFormData]);

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
      const successMessage = isEditing ? 'Pintura de borda de fundo editada!' : 'Pintura de borda de fundo Inserida!';
      toast.success(successMessage);
      navigate('/paintingborderbackgrounds');
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
    dateTimeStart,
    handleDateTimeStartChange,
  };
}
