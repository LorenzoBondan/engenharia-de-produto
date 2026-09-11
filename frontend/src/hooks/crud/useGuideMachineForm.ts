import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as roteiroMaquinaService from '../../services/roteiroMaquinaService';
import * as roteiroService from '../../services/roteiroService';
import * as maquinaService from '../../services/maquinaService';
import { DRoteiroMaquina } from '../../models/roteiroMaquina';
import { DRoteiro } from '../../models/roteiro';
import { DMaquina } from '../../models/maquina';
import { toast } from 'react-toastify';

/**
 * Custom hook for Guide Machine (Roteiro Máquina - Guides) form management
 * Wraps useEntityForm with roteiroMaquinaService configuration
 * Loads roteiros and maquinas for dropdowns
 * Handles previousPath navigation
 */
export function useGuideMachineForm() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const guideMachineId = params.guideMachineId !== 'create' ? Number(params.guideMachineId) : undefined;

  const [previousPath] = useState(location.state?.from || "/");
  const [roteiros, setRoteiros] = useState<DRoteiro[]>([]);
  const [maquinas, setMaquinas] = useState<DMaquina[]>([]);

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
  } = useEntityForm<DRoteiroMaquina>({
    entityId: guideMachineId,
    fetchFunction: guideMachineId ? (id: string | number) => roteiroMaquinaService.pesquisarPorId(Number(id)) : undefined,
    createFunction: roteiroMaquinaService.criar,
    updateFunction: roteiroMaquinaService.atualizar,
    initialFormData: {
      roteiro: {
        value: null,
        id: 'roteiro',
        name: 'roteiro',
        type: 'select',
        placeholder: 'Roteiro',
        validation: (value: unknown) => value !== null,
        message: 'Roteiro é obrigatório',
      },
      maquina: {
        value: null,
        id: 'maquina',
        name: 'maquina',
        type: 'select',
        placeholder: 'Máquina',
        validation: (value: unknown) => value !== null,
        message: 'Máquina é obrigatória',
      },
      tempoHomem: {
        value: null,
        id: 'tempoHomem',
        name: 'tempoHomem',
        type: 'number',
        placeholder: 'Tempo Homem',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Tempo Homem não pode ser negativo',
      },
      tempoMaquina: {
        value: null,
        id: 'tempoMaquina',
        name: 'tempoMaquina',
        type: 'number',
        placeholder: 'Tempo Máquina',
        validation: function (value: unknown) {
          return Number(value) >= 0;
        },
        message: 'Tempo Máquina não pode ser negativo',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        roteiro: values.roteiro,
        maquina: values.maquina,
        tempoHomem: values.tempoHomem === '' || values.tempoHomem === null ? null : Number(values.tempoHomem),
        tempoMaquina: values.tempoMaquina === '' || values.tempoMaquina === null ? null : Number(values.tempoMaquina),
      };

      if (guideMachineId) {
        entity.codigo = guideMachineId;
      }

      return entity;
    },
  });

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

  // Load maquinas for dropdown
  useEffect(() => {
    const loadMaquinas = async () => {
      try {
        const response = await maquinaService.pesquisarTodos('', '', '');
        setMaquinas(response.data.content);
      } catch (error) {
        console.error('Error loading maquinas:', error);
      }
    };

    loadMaquinas();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    await entityHandleSubmit(event);
  };

  useEffect(() => {
    if (submitSuccess) {
      const successMessage = isEditing ? 'Roteiro Máquina editado!' : 'Roteiro Máquina Inserido!';
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
    roteiros,
    maquinas,
    previousPath,
  };
}
