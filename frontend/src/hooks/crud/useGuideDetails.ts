import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityDetail } from '../common/useEntityDetail';
import * as roteiroService from '../../services/roteiroService';
import * as roteiroMaquinaService from '../../services/roteiroMaquinaService';
import { DRoteiro } from '../../models/roteiro';
import { DRoteiroMaquina } from '../../models/roteiroMaquina';

/**
 * Custom hook for Guide (Roteiro) details page management
 * Wraps useEntityDetail with roteiroService configuration
 * Manages nested roteiroMaquinas (guide machines) list with delete/inactivate operations
 */
export function useGuideDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const guideId = params.guideId ? Number(params.guideId) : undefined;

  const fetchGuide = useCallback(
    (id: string | number) => roteiroService.pesquisarPorId(Number(id)),
    []
  );

  const {
    entity: roteiro,
    loading,
    error,
    refresh,
  } = useEntityDetail<DRoteiro, DRoteiroMaquina>({
    entityId: guideId,
    fetchFunction: fetchGuide,
    nestedListKey: 'roteiroMaquinas',
  });

  const [dialogInfoData, setDialogInfoData] = useState({
    visible: false,
    message: 'Sucesso!',
  });

  const [dialogConfirmationData, setDialogConfirmationData] = useState({
    visible: false,
    id: 0,
    message: 'Você tem certeza?',
  });

  const handleDialogInfoClose = useCallback(() => {
    setDialogInfoData((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleUpdateClick = useCallback(
    (guideMachineId: number) => {
      navigate(`/guideMachines/${guideMachineId}`);
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((guideMachineId: number) => {
    setDialogConfirmationData((prev) => ({ ...prev, id: guideMachineId, visible: true }));
  }, []);

  const handleDialogConfirmationAnswer = useCallback(
    async (answer: boolean, guideMachineId: number | number[]) => {
      if (answer) {
        try {
          const ids = Array.isArray(guideMachineId) ? guideMachineId : [guideMachineId];
          await roteiroMaquinaService.remover(ids);
          refresh();
        } catch (error: any) {
          setDialogInfoData({
            visible: true,
            message: error.response?.data?.error || 'Erro ao remover roteiro máquina',
          });
        }
      }
      setDialogConfirmationData((prev) => ({ ...prev, visible: false }));
    },
    [refresh]
  );

  const handleInactivate = useCallback(
    async (id: number[]) => {
      try {
        await roteiroMaquinaService.inativar(id);
        refresh();
      } catch (error: any) {
        setDialogInfoData({
          visible: true,
          message: error.response?.data?.error || 'Erro ao inativar roteiro máquina',
        });
      }
    },
    [refresh]
  );

  return {
    roteiro,
    loading,
    error,
    refresh,
    dialogInfoData,
    setDialogInfoData,
    dialogConfirmationData,
    setDialogConfirmationData,
    handleDialogInfoClose,
    handleUpdateClick,
    handleDeleteClick,
    handleDialogConfirmationAnswer,
    handleInactivate,
  };
}
