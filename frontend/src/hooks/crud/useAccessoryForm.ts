import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as acessorioService from '../../services/acessorioService';
import * as corService from '../../services/corService';
import * as medidasService from '../../services/medidasService';
import { DAcessorio } from '../../models/acessorio';
import { DCor } from '../../models/cor';
import { DMedidas } from '../../models/medidas';
import { toast } from 'react-toastify';

/**
 * Custom hook for Accessory (Acessório - Aluminium) form management
 * Wraps useEntityForm with acessorioService configuration
 * Loads color options and handles date state for Flatpickr
 * Handles special logic for dimensions (medidas) entity relationship
 */
export function useAccessoryForm() {
  const params = useParams();
  const navigate = useNavigate();
  const accessoryId = params.accessoryId !== 'create' ? Number(params.accessoryId) : undefined;

  const [cores, setCores] = useState<DCor[]>([]);
  const [dateTimeStart, setDateTimeStart] = useState('');

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
  } = useEntityForm<DAcessorio>({
    entityId: accessoryId,
    fetchFunction: accessoryId ? (id: string | number) => acessorioService.pesquisarPorId(Number(id)) : undefined,
    createFunction: acessorioService.criar,
    updateFunction: acessorioService.atualizar,
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
      altura: {
        value: null,
        id: 'altura',
        name: 'altura',
        type: 'number',
        placeholder: 'Altura',
        validation: function (value: unknown) {
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
        validation: function (value: unknown) {
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
        validation: function (value: unknown) {
          return value !== null && Number(value) >= 0;
        },
        message: 'Espessura não pode ser negativa',
      },
      cor: {
        value: null,
        id: 'cor',
        name: 'cor',
        type: 'select',
        placeholder: 'Cor',
      },
    },
    toEntityMapper: async (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
        implantacao: dateTimeStart === '' ? null : dateTimeStart,
        cor: values.cor === '' || values.cor === null ? null : values.cor,
      };

      // Handle medidas (dimensions) - find or create
      if (values.altura && values.largura && values.espessura) {
        const medidas = await buscarOuCriarMedidas(
          Number(values.altura),
          Number(values.largura),
          Number(values.espessura)
        );
        entity.medidas = { codigo: medidas.codigo };
      }

      if (accessoryId) {
        entity.codigo = accessoryId;
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

  // Transform date values after entity is loaded (edit mode)
  useEffect(() => {
    if (isEditing && accessoryId && formData.implantacao.value) {
      const implantacaoValue = formData.implantacao.value;
      const updatedFormData = { ...formData };

      if (implantacaoValue) {
        setDateTimeStart(new Date(implantacaoValue as string).toISOString().split('T')[0]);
      }
    }
  }, [accessoryId, isEditing, formData]);

  // Extract dimensions from medidas entity when loading (edit mode)
  useEffect(() => {
    if (isEditing && accessoryId && formData.descricao.value) {
      // Check if we need to load dimensions from medidas
      acessorioService.pesquisarPorId(Number(accessoryId))
        .then(response => {
          if (response.data.medidas) {
            const updatedFormData = { ...formData };
            updatedFormData.altura = { ...formData.altura, value: response.data.medidas.altura };
            updatedFormData.largura = { ...formData.largura, value: response.data.medidas.largura };
            updatedFormData.espessura = { ...formData.espessura, value: response.data.medidas.espessura };
            setFormData(updatedFormData);
          }
        })
        .catch(error => {
          console.error('Error loading medidas:', error);
        });
    }
  }, [accessoryId, isEditing]);

  async function buscarOuCriarMedidas(altura: number, largura: number, espessura: number) {
    // Try to find existing medidas in database
    const response = await medidasService.pesquisarPorMedidas(altura, largura, espessura);

    if (response.data) {
      return response.data; // Return found medidas
    }

    // If not found, create new medidas
    const novaMedida: DMedidas = {
      codigo: 0, // Will be generated by backend
      altura,
      largura,
      espessura,
      situacao: 'ATIVO'
    };

    const novaResponse = await medidasService.criar(novaMedida);
    return novaResponse.data; // Return newly created medida
  }

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
      const successMessage = isEditing ? 'Acessório editado!' : 'Acessório Inserido!';
      toast.success(successMessage);
      navigate('/accessories');
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
    dateTimeStart,
    handleDateTimeStartChange,
  };
}
