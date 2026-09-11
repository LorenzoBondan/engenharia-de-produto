import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntityDetail } from '../common/useEntityDetail';
import * as paiService from '../../services/paiService';
import * as filhoService from '../../services/filhoService';
import { DPai } from '../../models/pai';
import { DFilho } from '../../models/filho';

/**
 * Custom hook for Father (Pai) details page management
 * Wraps useEntityDetail with paiService configuration
 * Manages nested filhos (sons) list with delete/inactivate operations
 */
export function useFatherDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const fatherId = params.fatherId ? Number(params.fatherId) : undefined;

  const fetchFather = useCallback(
    (id: string | number) => paiService.pesquisarPorId(Number(id)),
    []
  );

  const {
    entity: pai,
    loading,
    error,
    refresh,
    removeFromNested,
    updateNested,
  } = useEntityDetail<DPai, DFilho>({
    entityId: fatherId,
    fetchFunction: fetchFather,
    nestedListKey: 'filhos',
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
    (sonId: number) => {
      navigate(`/sons/${sonId}`);
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((sonId: number) => {
    setDialogConfirmationData((prev) => ({ ...prev, id: sonId, visible: true }));
  }, []);

  const handleDialogConfirmationAnswer = useCallback(
    async (answer: boolean, sonId: number | number[]) => {
      if (answer) {
        try {
          const ids = Array.isArray(sonId) ? sonId : [sonId];
          await filhoService.remover(ids);
          refresh();
        } catch (error: any) {
          setDialogInfoData({
            visible: true,
            message: error.response?.data?.error || 'Erro ao remover filho',
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

  return {
    pai,
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
