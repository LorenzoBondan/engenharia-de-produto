import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as filhoService from '../../services/filhoService';
import * as corService from '../../services/corService';
import * as paiService from '../../services/paiService';
import * as roteiroService from '../../services/roteiroService';
import * as medidasService from '../../services/medidasService';
import { DFilho } from '../../models/filho';
import { DCor } from '../../models/cor';
import { DPai } from '../../models/pai';
import { DRoteiro } from '../../models/roteiro';
import { DMedidas } from '../../models/medidas';
import { DTipoFilhoEnum } from '../../models/enums/tipoFilho';
import { toast } from 'react-toastify';

/**
 * Custom hook for Son (Filho - Items) form management
 * Wraps useEntityForm with filhoService configuration
 * Loads cores, pais, roteiros for dropdowns
 * Handles medidas (dimensions) entity relationship
 * Handles date state for Flatpickr and tipo enum
 */
export function useSonForm() {
  const params = useParams();
  const navigate = useNavigate();
  const sonId = params.sonId !== 'create' ? Number(params.sonId) : undefined;

  const [cores, setCores] = useState<DCor[]>([]);
  const [pais, setPais] = useState<DPai[]>([]);
  const [roteiros, setRoteiros] = useState<DRoteiro[]>([]);
  const [dateTimeStart, setDateTimeStart] = useState('');
  const [medidasLoaded, setMedidasLoaded] = useState(false);

  const tipoFilhoOptions = Object.values(DTipoFilhoEnum).map((item) => ({
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
  } = useEntityForm<DFilho>({
    entityId: sonId,
    fetchFunction: sonId ? (id: string | number) => filhoService.pesquisarPorId(Number(id)) : undefined,
    createFunction: filhoService.criar,
    updateFunction: filhoService.atualizar,
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
          return Number(value) >= 0;
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
        validation: (value: unknown) => value !== null,
        message: 'Cor é obrigatória',
      },
      pai: {
        value: null,
        id: 'pai',
        name: 'pai',
        type: 'select',
        placeholder: 'Pai',
      },
      roteiro: {
        value: null,
        id: 'roteiro',
        name: 'roteiro',
        type: 'select',
        placeholder: 'Roteiro',
      },
      tipo: {
        value: null,
        id: 'tipo',
        name: 'tipo',
        type: 'select',
        placeholder: 'Tipo de Filho',
        validation: (value: unknown) => value !== null,
        message: 'Tipo de Filho é obrigatório',
      },
    },
    toEntityMapper: async (values) => {
      const entity: any = {
        descricao: values.descricao as string,
        implantacao: dateTimeStart === '' ? null : dateTimeStart,
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
        cor: values.cor,
        pai: values.pai,
        roteiro: values.roteiro,
        tipo: (values.tipo as any)?.value,
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

      if (sonId) {
        entity.codigo = sonId;
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

  // Load pais for dropdown
  useEffect(() => {
    const loadPais = async () => {
      try {
        const response = await paiService.pesquisarTodos('', '', '');
        setPais(response.data.content);
      } catch (error) {
        console.error('Error loading pais:', error);
      }
    };

    loadPais();
  }, []);

  // Load roteiros for dropdown
  useEffect(() => {
    const loadRoteiros = async () => {
      try {
        const response = await roteiroService.pesquisarTodos('', '', '');
        setRoteiros(response.data.content);
      } catch (error) {
        console.error('Error loading roteiros:', error);
      }
    };

    loadRoteiros();
  }, []);

  // Transform enum and date values after entity is loaded (edit mode)
  useEffect(() => {
    if (isEditing && sonId && formData.tipo.value) {
      const tipoValue = formData.tipo.value;
      const implantacaoValue = formData.implantacao.value;

      let needsUpdate = false;
      const updatedFormData = { ...formData };

      if (typeof tipoValue === 'string') {
        updatedFormData.tipo = { ...formData.tipo };
        updatedFormData.tipo.value = tipoFilhoOptions.find(option => option.value === tipoValue) || null;
        needsUpdate = true;
      }

      if (implantacaoValue) {
        setDateTimeStart(new Date(implantacaoValue as string).toISOString().split('T')[0]);
      }

      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    }
  }, [sonId, isEditing, formData, tipoFilhoOptions, setFormData]);

  // Reset medidasLoaded when sonId changes
  useEffect(() => {
    setMedidasLoaded(false);
  }, [sonId]);

  // Extract dimensions from medidas entity when entity is loaded (edit mode)
  // This runs after useEntityForm loads the entity
  useEffect(() => {
    // Check if we're in edit mode and entity has been loaded (descricao will have value)
    // but medidas fields are still null (not yet populated)
    if (
      isEditing &&
      sonId &&
      formData.descricao.value &&
      !medidasLoaded
    ) {
      console.log('Carregando medidas para sonId:', sonId);
      console.log('Valores atuais:', {
        altura: formData.altura.value,
        largura: formData.largura.value,
        espessura: formData.espessura.value
      });

      // Fetch the entity to get medidas
      filhoService.pesquisarPorId(Number(sonId))
        .then(response => {
          console.log('Resposta da API:', response.data);
          if (response.data.medidas) {
            console.log('Medidas encontradas:', response.data.medidas);
            setFormData(prevFormData => ({
              ...prevFormData,
              altura: { ...prevFormData.altura, value: response.data.medidas.altura },
              largura: { ...prevFormData.largura, value: response.data.medidas.largura },
              espessura: { ...prevFormData.espessura, value: response.data.medidas.espessura },
            }));
            setMedidasLoaded(true);
          }
        })
        .catch(error => {
          console.error('Error loading medidas:', error);
        });
    }
  }, [isEditing, sonId, formData.descricao.value, medidasLoaded]);

  async function buscarOuCriarMedidas(altura: number, largura: number, espessura: number) {
    const response = await medidasService.pesquisarPorMedidas(altura, largura, espessura);

    if (response.data) {
      return response.data;
    }

    const novaMedida: DMedidas = {
      codigo: 0,
      altura,
      largura,
      espessura,
      situacao: 'ATIVO'
    };

    const novaResponse = await medidasService.criar(novaMedida);
    return novaResponse.data;
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
      const successMessage = isEditing ? 'Filho editado!' : 'Filho Inserido!';
      toast.success(successMessage);
      navigate('/sons');
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
    pais,
    roteiros,
    tipoFilhoOptions,
    dateTimeStart,
    handleDateTimeStartChange,
  };
}
