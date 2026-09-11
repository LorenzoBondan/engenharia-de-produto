import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as acessorioUsadoService from '../../services/acessorioUsadoService';
import * as acessorioService from '../../services/acessorioService';
import * as filhoService from '../../services/filhoService';
import { DAcessorioUsado } from '../../models/acessorioUsado';
import { DAcessorio } from '../../models/acessorio';
import { DFilho } from '../../models/filho';
import { toast } from 'react-toastify';

/**
 * Custom hook for Used Accessory (Acessório Usado - Used) form management
 * Wraps useEntityForm with acessorioUsadoService configuration
 * Loads acessorios and filhos for dropdowns
 * Handles previousPath navigation
 */
export function useUsedAccessoryForm() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const usedAccessoryId = params.usedAccessoryId !== 'create' ? Number(params.usedAccessoryId) : undefined;

  const [previousPath] = useState(location.state?.from || "/");
  const [acessorios, setAcessorios] = useState<DAcessorio[]>([]);
  const [filhos, setFilhos] = useState<DFilho[]>([]);

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
  } = useEntityForm<DAcessorioUsado>({
    entityId: usedAccessoryId,
    fetchFunction: usedAccessoryId ? (id: string | number) => acessorioUsadoService.pesquisarPorId(Number(id)) : undefined,
    createFunction: acessorioUsadoService.criar,
    updateFunction: acessorioUsadoService.atualizar,
    initialFormData: {
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
      acessorio: {
        value: null,
        id: 'acessorio',
        name: 'acessorio',
        type: 'select',
        placeholder: 'Acessório',
        validation: (value: unknown) => value !== null,
        message: 'Acessório é obrigatório',
      },
      filho: {
        value: null,
        id: 'filho',
        name: 'filho',
        type: 'select',
        placeholder: 'filho',
        validation: (value: unknown) => value !== null,
        message: 'Filho é obrigatório',
      },
      quantidade: {
        value: null,
        id: 'quantidade',
        name: 'quantidade',
        type: 'number',
        placeholder: 'Quantidade',
        validation: function (value: unknown) {
          return value === '' || value === null || Number(value) >= 0;
        },
        message: 'Quantidade não pode ser nula ou negativa',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        valor: Number(values.valor),
        quantidade: values.quantidade === '' || values.quantidade === null ? null : Number(values.quantidade),
        acessorio: values.acessorio,
        filho: values.filho,
      };

      if (usedAccessoryId) {
        entity.codigo = usedAccessoryId;
      }

      return entity;
    },
  });

  // Load acessorios for dropdown
  useEffect(() => {
    const loadAcessorios = async () => {
      try {
        const response = await acessorioService.pesquisarTodos('', '', '');
        setAcessorios(response.data.content);
      } catch (error) {
        console.error('Error loading acessorios:', error);
      }
    };

    loadAcessorios();
  }, []);

  // Load filhos for dropdown
  useEffect(() => {
    const loadFilhos = async () => {
      try {
        const response = await filhoService.pesquisarTodos('', '', '');
        setFilhos(response.data.content);
      } catch (error) {
        console.error('Error loading filhos:', error);
      }
    };

    loadFilhos();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Acessório Usado editado!' : 'Acessório Usado Inserido!';
      toast.success(successMessage);
      navigate(previousPath);
    }
  }, [submitSuccess, isEditing, navigate, previousPath]);

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
    acessorios,
    filhos,
    previousPath,
  };
}
