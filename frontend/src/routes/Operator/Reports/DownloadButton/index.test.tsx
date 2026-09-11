import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DownloadButton from './index';
import * as useDownloadButtonHook from '../../../../hooks/operator/useDownloadButton';

vi.mock('../../../../hooks/operator/useDownloadButton');

describe('DownloadButton', () => {
  const mockDownloadPdf = vi.fn();
  const mockOnDownload = vi.fn();

  const mockUseDownloadButton = {
    downloadPdf: mockDownloadPdf,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDownloadButtonHook.useDownloadButton).mockReturnValue(mockUseDownloadButton);
  });

  it('should render button with correct text', () => {
    render(<DownloadButton id={1} onDownload={mockOnDownload} onError={() => {}}/>);

    expect(screen.getByRole('button', { name: /Baixar PDF/i })).toBeInTheDocument();
  });

  it('should call downloadPdf when button is clicked', () => {
    render(<DownloadButton id={123} onDownload={mockOnDownload} onError={() => {}}/>);

    const button = screen.getByRole('button', { name: /Baixar PDF/i });
    fireEvent.click(button);

    expect(mockDownloadPdf).toHaveBeenCalledTimes(1);
  });

  it('should initialize hook with correct id and onDownload', () => {
    render(<DownloadButton id={456} onDownload={mockOnDownload} onError={() => {}}/>);

    expect(useDownloadButtonHook.useDownloadButton).toHaveBeenCalledWith(456, mockOnDownload);
  });

  it('should handle loading state', () => {
    vi.mocked(useDownloadButtonHook.useDownloadButton).mockReturnValue({
      ...mockUseDownloadButton,
      loading: true,
    });

    render(<DownloadButton id={1} onDownload={mockOnDownload} onError={() => {}}/>);

    const button = screen.getByRole('button', { name: /Gerando PDF/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle error state', () => {
    vi.mocked(useDownloadButtonHook.useDownloadButton).mockReturnValue({
      ...mockUseDownloadButton,
      error: 'Erro ao baixar o arquivo PDF',
    });

    render(<DownloadButton id={1} onDownload={mockOnDownload} onError={() => {}}/>);

    const button = screen.getByRole('button', { name: /Baixar PDF/i });
    expect(button).toBeInTheDocument();
  });

  it('should update when id prop changes', () => {
    const { rerender } = render(<DownloadButton id={1} onDownload={mockOnDownload} onError={() => {}}/>);

    expect(useDownloadButtonHook.useDownloadButton).toHaveBeenCalledWith(1, mockOnDownload);

    rerender(<DownloadButton id={999} onDownload={mockOnDownload} onError={() => {}}/>);

    expect(useDownloadButtonHook.useDownloadButton).toHaveBeenCalledWith(999, mockOnDownload);
  });
});
