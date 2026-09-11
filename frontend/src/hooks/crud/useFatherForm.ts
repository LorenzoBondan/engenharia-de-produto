import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as paiService from '../../services/paiService';
import * as modeloService from '../../services/modeloService';
import * as categoriaComponenteService from '../../services/categoriaComponenteService';
import { DPai } from '../../models/pai';
import { DModelo } from '../../models/modelo';
import { DCategoriaComponente } from '../../models/categoriaComponente';
import { DTipoPinturaEnum } from '../../models/enums/tipoPintura';
import { toast } from 'react-toastify';

/**
 * Custom hook for Father (Pai - Items) form management
 * Wraps useEntityForm with paiService configuration
 * Loads modelos, categoriaComponentes, and tipoPintura enum options
 */
export function useFatherForm() {
  const params = useParams();
  const navigate = useNavigate();
  const fatherId = params.fatherId !== 'create' ? Number(params.fatherId) : undefined;

  const [modelos, setModelos] = useState<DModelo[]>([]);
  const [categoriaComponentes, setCategoriaComponentes] = useState<DCategoriaComponente[]>([]);

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
  } = useEntityForm<DPai>({
    entityId: fatherId,
    fetchFunction: fatherId ? (id: string | number) => paiService.pesquisarPorId(Number(id)) : undefined,
    createFunction: paiService.criar,
    updateFunction: paiService.atualizar,
    initialFormData: {
      modelo: {
        value: null,
        id: 'modelo',
        name: 'modelo',
        type: 'select',
        placeholder: 'Modelo',
        validation: (value: unknown) => value !== null,
        message: 'modelo é obrigatório',
      },
      categoriaComponente: {
        value: null,
        id: 'categoriaComponente',
        name: 'categoriaComponente',
        type: 'select',
        placeholder: 'Categoria Componente',
        validation: (value: unknown) => value !== null,
        message: 'Categoria Componente é obrigatória',
      },
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
      bordasComprimento: {
        value: null,
        id: 'bordasComprimento',
        name: 'bordasComprimento',
        type: 'number',
        placeholder: 'Bordas no Comprimento',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Bordas no Comprimento não pode ser negativo',
      },
      bordasLargura: {
        value: null,
        id: 'bordasLargura',
        name: 'bordasLargura',
        type: 'number',
        placeholder: 'Bordas na Largura',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Bordas na Largura não pode ser negativo',
      },
      numeroCantoneiras: {
        value: null,
        id: 'numeroCantoneiras',
        name: 'numeroCantoneiras',
        type: 'number',
        placeholder: 'Número de Cantoneiras',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Número de Cantoneiras não pode ser negativo',
      },
      tntUmaFace: {
        value: null,
        id: 'tntUmaFace',
        name: 'tntUmaFace',
        type: 'boolean',
        placeholder: 'Tnt uma Face',
      },
      plasticoAcima: {
        value: null,
        id: 'plasticoAcima',
        name: 'plasticoAcima',
        type: 'boolean',
        placeholder: 'Plástico Acima',
      },
      plasticoAdicional: {
        value: null,
        id: 'plasticoAdicional',
        name: 'plasticoAdicional',
        type: 'number',
        placeholder: 'Plástico Adicional',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Plástico Adicional não pode ser negativo',
      },
      larguraPlastico: {
        value: null,
        id: 'larguraPlastico',
        name: 'larguraPlastico',
        type: 'number',
        placeholder: 'Largura Plástico',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Largura Plástico não pode ser negativo',
      },
      faces: {
        value: null,
        id: 'faces',
        name: 'faces',
        type: 'number',
        placeholder: 'Faces',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Faces não pode ser negativo',
      },
      especial: {
        value: null,
        id: 'especial',
        name: 'especial',
        type: 'boolean',
        placeholder: 'Especial',
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
        modelo: values.modelo,
        categoriaComponente: values.categoriaComponente,
        bordasComprimento: values.bordasComprimento === '' ? null : Number(values.bordasComprimento),
        bordasLargura: values.bordasLargura === '' ? null : Number(values.bordasLargura),
        numeroCantoneiras: values.numeroCantoneiras === '' ? null : Number(values.numeroCantoneiras),
        tntUmaFace: values.tntUmaFace === '' ? null : values.tntUmaFace,
        plasticoAcima: values.plasticoAcima === '' ? null : values.plasticoAcima,
        plasticoAdicional: values.plasticoAdicional === '' ? null : Number(values.plasticoAdicional),
        larguraPlastico: values.larguraPlastico === '' ? null : Number(values.larguraPlastico),
        faces: values.faces === '' ? null : Number(values.faces),
        especial: values.especial === '' ? null : values.especial,
        tipoPintura: (values.tipoPintura as any)?.value,
      };

      if (fatherId) {
        entity.codigo = fatherId;
      }

      return entity;
    },
  });

  // Load modelos for dropdown
  useEffect(() => {
    const loadModelos = async () => {
      try {
        const response = await modeloService.pesquisarTodos('', '', '');
        setModelos(response.data.content);
      } catch (error) {
        console.error('Error loading modelos:', error);
      }
    };

    loadModelos();
  }, []);

  // Load categoriaComponentes for dropdown
  useEffect(() => {
    const loadCategoriaComponentes = async () => {
      try {
        const response = await categoriaComponenteService.pesquisarTodos('', '', '');
        setCategoriaComponentes(response.data.content);
      } catch (error) {
        console.error('Error loading categoriaComponentes:', error);
      }
    };

    loadCategoriaComponentes();
  }, []);

  // Transform enum values after entity is loaded (edit mode)
  useEffect(() => {
    if (isEditing && fatherId && formData.tipoPintura.value) {
      const tipoPinturaValue = formData.tipoPintura.value;

      if (typeof tipoPinturaValue === 'string') {
        const updatedFormData = { ...formData };
        updatedFormData.tipoPintura = { ...formData.tipoPintura };
        updatedFormData.tipoPintura.value = tipoPinturaOptions.find(option => option.value === tipoPinturaValue) || null;
        setFormData(updatedFormData);
      }
    }
  }, [fatherId, isEditing, formData, tipoPinturaOptions, setFormData]);

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Pai editado!' : 'Pai Inserido!';
      toast.success(successMessage);
      navigate('/fathers');
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
    modelos,
    categoriaComponentes,
    tipoPinturaOptions,
  };
}
