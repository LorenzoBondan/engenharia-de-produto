import { Loader2 } from 'lucide-react';
import { useDownloadButton } from '../../../../hooks/operator/useDownloadButton';

type Props = {
    id: number;
    onDownload: (url: string) => void;
    onError: (error: string | null) => void;
}

const DownloadButton = ({ id, onDownload, onError } : Props) => {
    const { downloadPdf, loading, error } = useDownloadButton(id, onDownload);

    // Notifica o componente pai quando houver erro
    if (error && error !== null) {
        onError(error);
    }

    return (
        <button
            onClick={downloadPdf}
            className='btn btn-primary text-white'
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="spinner-icon" />
                    Gerando PDF...
                </>
            ) : (
                'Baixar PDF'
            )}
        </button>
    );
};

export default DownloadButton;
