import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import * as reportService from '../../services/relatorioService';

/**
 * Custom hook for DownloadButton component management
 * Wraps usePdfDownload logic for PDF generation
 * Handles Blob response and file download
 * Supports filename customization
 */
export function useDownloadButton(id: number, onDownload?: (url: string) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = useCallback(
    async (event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
      }

      try {
        setLoading(true);
        setError(null);

        const response = await reportService.gerarRelatorioPdf(id);
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        saveAs(pdfBlob, `relatorio ${id}.pdf`);

        if (onDownload) {
          onDownload(pdfUrl);
        }

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError('Erro ao baixar o arquivo PDF');
        console.error('Erro ao baixar o arquivo PDF', err);
      }
    },
    [id, onDownload]
  );

  return {
    downloadPdf,
    loading,
    error,
  };
}
