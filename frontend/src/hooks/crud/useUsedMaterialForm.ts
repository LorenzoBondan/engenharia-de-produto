import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEntityForm } from '../common/useEntityForm';
import * as materialUsadoService from '../../services/materialUsadoService';
import * as materialService from '../../services/materialService';
import * as filhoService from '../../services/filhoService';
import { DMaterialUsado } from '../../models/materialUsado';
import { DMaterial } from '../../models/material';
import { DFilho } from '../../models/filho';
import { toast } from 'react-toastify';

/**
 * Custom hook for Used Material (Material Usado - Used) form management
 * Wraps useEntityForm with materialUsadoService configuration
 * Loads materiais and filhos for dropdowns
 * Handles previousPath navigation
 */
export function useUsedMaterialForm() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const usedMaterialId = params.usedMaterialId !== 'create' ? Number(params.usedMaterialId) : undefined;

  const [previousPath] = useState(location.state?.from || "/");
  const [materiais, setMateriais] = useState<DMaterial[]>([]);
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
  } = useEntityForm<DMaterialUsado>({
    entityId: usedMaterialId,
    fetchFunction: usedMaterialId ? (id: string | number) => materialUsadoService.pesquisarPorId(Number(id)) : undefined,
    createFunction: materialUsadoService.criar,
    updateFunction: materialUsadoService.atualizar,
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
      material: {
        value: null,
        id: 'material',
        name: 'material',
        type: 'select',
        placeholder: 'Material',
        validation: (value: unknown) => value !== null,
        message: 'Material é obrigatório',
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
      quantidadeLiquida: {
        value: null,
        id: 'quantidadeLiquida',
        name: 'quantidadeLiquida',
        type: 'number',
        placeholder: 'Quantidade Líquida',
        validation: function (value: unknown) {
          return value === '' || value === null || Number(value) >= 0;
        },
        message: 'Quantidade Líquida não pode ser nula ou negativa',
      },
      quantidadeBruta: {
        value: null,
        id: 'quantidadeBruta',
        name: 'quantidadeBruta',
        type: 'number',
        placeholder: 'Quantidade Bruta',
        validation: function (value: unknown) {
          return value === '' || value === null || Number(value) >= 0;
        },
        message: 'Quantidade Bruta não pode ser nula ou negativa',
      },
    },
    toEntityMapper: (values) => {
      const entity: any = {
        valor: Number(values.valor),
        quantidadeLiquida: values.quantidadeLiquida === '' || values.quantidadeLiquida === null ? null : Number(values.quantidadeLiquida),
        quantidadeBruta: values.quantidadeBruta === '' || values.quantidadeBruta === null ? null : Number(values.quantidadeBruta),
        material: values.material,
        filho: values.filho,
      };

      if (usedMaterialId) {
        entity.codigo = usedMaterialId;
      }

      return entity;
    },
  });

  // Load materiais for dropdown
  useEffect(() => {
    const loadMateriais = async () => {
      try {
        const response = await materialService.pesquisarTodos('', '', '');
        setMateriais(response.data.content);
      } catch (error) {
        console.error('Error loading materiais:', error);
      }
    };

    loadMateriais();
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
      const successMessage = isEditing ? 'Material Usado editado!' : 'Material Usado Inserido!';
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
    materiais,
    filhos,
    previousPath,
  };
}
