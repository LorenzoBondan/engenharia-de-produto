import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as grupoMaquinaService from '../../services/grupoMaquinaService';
import { DGrupoMaquina } from '../../models/grupoMaquina';
import { toast } from 'react-toastify';

/**
 * Custom hook for Machine Group (Grupo Máquina - Guides) form management
 * Wraps useEntityForm with grupoMaquinaService configuration
 */
export function useMachineGroupForm() {
  const params = useParams();
  const navigate = useNavigate();
  const machineGroupId = params.machineGroupId !== 'create' ? Number(params.machineGroupId) : undefined;

  const {
    formData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit: entityHandleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  } = useEntityForm<DGrupoMaquina>({
    entityId: machineGroupId,
    fetchFunction: machineGroupId ? (id: string | number) => grupoMaquinaService.pesquisarPorId(Number(id)) : undefined,
    createFunction: grupoMaquinaService.criar,
    updateFunction: grupoMaquinaService.atualizar,
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
    },
    toEntityMapper: (values) => {
      const entity: any = {
        nome: values.nome as string,
      };

      if (machineGroupId) {
        entity.codigo = machineGroupId;
      }

      return entity;
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Grupo Máquina editado!' : 'Grupo Máquina Inserido!';
      toast.success(successMessage);
      navigate('/machinegroups');
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
