import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as maquinaService from '../../services/maquinaService';
import * as grupoMaquinaService from '../../services/grupoMaquinaService';
import { DMaquina } from '../../models/maquina';
import { DGrupoMaquina } from '../../models/grupoMaquina';
import { toast } from 'react-toastify';

/**
 * Custom hook for Machine (Máquina - Guides) form management
 * Wraps useEntityForm with maquinaService configuration
 * Loads machine groups (grupoMaquinas) for dropdown
 */
export function useMachineForm() {
  const params = useParams();
  const navigate = useNavigate();
  const machineId = params.machineId !== 'create' ? Number(params.machineId) : undefined;

  const [grupoMaquinas, setGrupoMaquinas] = useState<DGrupoMaquina[]>([]);

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
  } = useEntityForm<DMaquina>({
    entityId: machineId,
    fetchFunction: machineId ? (id: string | number) => maquinaService.pesquisarPorId(Number(id)) : undefined,
    createFunction: maquinaService.criar,
    updateFunction: maquinaService.atualizar,
    initialFormData: {
      nome: {
        value: '',
        id: 'nome',
        name: 'nome',
        type: 'text',
        placeholder: 'Nome',
        validation: function (value: unknown) {
          return /^.{3,50}$/.test(value as string);
        },
        message: 'Nome deve ter entre 3 e 50 caracteres',
      },
      formula: {
        value: '',
        id: 'formula',
        name: 'formula',
        type: 'text',
        placeholder: 'Fórmula',
        validation: function (value: unknown) {
          return /^.{3,100}$/.test(value as string);
        },
        message: 'Fórmula deve ter entre 3 e 100 caracteres',
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
      grupoMaquina: {
        value: null,
        id: 'grupoMaquina',
        name: 'grupoMaquina',
        type: 'select',
        placeholder: 'Grupo Máquina',
        validation: (value: unknown) => value !== null,
        message: 'Grupo de Máquina é obrigatório',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        nome: values.nome as string,
        formula: values.formula as string,
        valor: values.valor === '' || values.valor === null ? null : Number(values.valor),
        grupoMaquina: values.grupoMaquina,
      };

      if (machineId) {
        entity.codigo = machineId;
      }

      return entity;
    },
  });

  // Load grupoMaquinas for dropdown
  useEffect(() => {
    const loadGrupoMaquinas = async () => {
      try {
        const response = await grupoMaquinaService.pesquisarTodos('', '', '');
        setGrupoMaquinas(response.data.content);
      } catch (error) {
        console.error('Error loading grupoMaquinas:', error);
      }
    };

    loadGrupoMaquinas();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Máquina editada!' : 'Máquina Inserida!';
      toast.success(successMessage);
      navigate('/machines');
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
    grupoMaquinas,
  };
}
