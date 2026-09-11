import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityDetail } from '../common/useEntityDetail';
import * as filhoService from '../../services/filhoService';
import * as acessorioUsadoService from '../../services/acessorioUsadoService';
import * as materialUsadoService from '../../services/materialUsadoService';
import { DFilho } from '../../models/filho';

/**
 * Custom hook for Son (Filho) details page management
 * Wraps useEntityDetail with filhoService configuration
 * Manages acessoriosUsados and materiaisUsados with delete/inactivate operations
 */
export function useSonDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const sonId = params.sonId ? Number(params.sonId) : undefined;

  const fetchSon = useCallback(
    (id: string | number) => filhoService.pesquisarPorId(Number(id)),
    []
  );

  const {
    entity: filho,
    loading,
    error,
    refresh,
  } = useEntityDetail<DFilho, any>({
    entityId: sonId,
    fetchFunction: fetchSon,
  });

  const [dialogInfoData, setDialogInfoData] = useState({
    visible: false,
    message: 'Sucesso!',
  });

  const [dialogConfirmationData, setDialogConfirmationData] = useState({
    visible: false,
    id: 0,
    message: 'Você tem certeza?',
    type: '',
  });

  const handleDialogInfoClose = useCallback(() => {
    setDialogInfoData((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleAccessoryInactivate = useCallback(
    async (id: number[]) => {
      try {
        await acessorioUsadoService.inativar(id);
        refresh();
      } catch (error: any) {
        setDialogInfoData({
          visible: true,
          message: error.response?.data?.error || 'Erro ao inativar acessório',
        });
      }
    },
    [refresh]
  );

  const handleMaterialInactivate = useCallback(
    async (id: number[]) => {
      try {
        await materialUsadoService.inativar(id);
        refresh();
      } catch (error: any) {
        setDialogInfoData({
          visible: true,
          message: error.response?.data?.error || 'Erro ao inativar material',
        });
      }
    },
    [refresh]
  );

  const handleSonInactivate = useCallback(
    async (id: number[]) => {
      try {
        await filhoService.inativar(id);
        refresh();
      } catch (error: any) {
        setDialogInfoData({
          visible: true,
          message: error.response?.data?.error || 'Erro ao inativar filho',
        });
      }
    },
    [refresh]
  );

  const handleAccessoryDeleteClick = useCallback((accessoryId: number) => {
    setDialogConfirmationData({
      visible: true,
      id: accessoryId,
      message: 'Você tem certeza?',
      type: 'accessory',
    });
  }, []);

  const handleMaterialDeleteClick = useCallback((materialId: number) => {
    setDialogConfirmationData({
      visible: true,
      id: materialId,
      message: 'Você tem certeza?',
      type: 'material',
    });
  }, []);

  const handleSonDeleteClick = useCallback((sonId: number) => {
    setDialogConfirmationData({
      visible: true,
      id: sonId,
      message: 'Você tem certeza?',
      type: 'son',
    });
  }, []);

  const handleDialogConfirmationAnswer = useCallback(
    async (answer: boolean, id: number | number[]) => {
      if (answer) {
        try {
          const ids = Array.isArray(id) ? id : [id];
          if (dialogConfirmationData.type === 'accessory') {
            await acessorioUsadoService.remover(ids);
          } else if (dialogConfirmationData.type === 'material') {
            await materialUsadoService.remover(ids);
          } else if (dialogConfirmationData.type === 'son') {
            await filhoService.remover(ids);
          }
          refresh();
        } catch (error: any) {
          setDialogInfoData({
            visible: true,
            message: error.response?.data?.error || 'Erro ao remover item',
          });
        }
      }
      setDialogConfirmationData((prev) => ({ ...prev, visible: false }));
    },
    [dialogConfirmationData.type, refresh]
  );

  return {
    filho,
    loading,
    error,
    refresh,
    dialogInfoData,
    setDialogInfoData,
    dialogConfirmationData,
    setDialogConfirmationData,
    handleDialogInfoClose,
    handleAccessoryInactivate,
    handleMaterialInactivate,
    handleSonInactivate,
    handleAccessoryDeleteClick,
    handleMaterialDeleteClick,
    handleSonDeleteClick,
    handleDialogConfirmationAnswer,
  };
}
