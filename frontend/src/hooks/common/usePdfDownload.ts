import { useState, useCallback } from 'react';
import { UsePdfDownloadReturn } from '../types';
import { AxiosResponse } from 'axios';

/**
 * Custom hook for PDF generation and download
 *
 * Features:
 * - Trigger PDF generation from service
 * - Automatic browser download
 * - Loading state during generation
 * - Error handling
 * - Support for parameterized PDF generation
 *
 * @param generateFunction - Function that generates and returns PDF blob
 * @param filename - Base filename for the downloaded PDF (without .pdf extension)
 * @returns PDF download state and trigger function
 *
 * @example
 * ```tsx
 * function ReportPage() {
 *   const { download, loading, error } = usePdfDownload(
 *     reportService.gerarPdf,
 *     'relatorio-mensal'
 *   );
 *
 *   const handleDownload = () => {
 *     download(2024, 'January'); // Pass params to generate function
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleDownload} disabled={loading}>
 *         {loading ? 'Gerando PDF...' : 'Baixar Relatório'}
 *       </button>
 *       {error && <Alert>{error}</Alert>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePdfDownload(
  generateFunction: (...args: any[]) => Promise<AxiosResponse<Blob>>,
  filename: string
): UsePdfDownloadReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Trigger PDF generation and download
   */
  const download = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);

        // Generate PDF
        const response = await generateFunction(...args);
        const blob = response.data;

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.pdf`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(
          err.response?.data?.error ||
            err.message ||
            'Erro ao gerar PDF. Tente novamente.'
        );
      }
    },
    [generateFunction, filename]
  );

  return {
    download,
    loading,
    error,
  };
}
