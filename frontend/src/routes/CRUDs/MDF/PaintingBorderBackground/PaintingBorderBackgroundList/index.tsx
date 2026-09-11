import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaintingBorderBackgroundList } from '../../../../../hooks/crud/usePaintingBorderBackgroundList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DPinturaFundoBorda } from '../../../../../models/pinturaFundoBorda';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function PaintingBorderBackgroundList() {

    const navigate = useNavigate();
    const { data: pinturaBordaFundos, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = usePaintingBorderBackgroundList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/paintingborderbackgrounds/create");
    }

    function handleUpdateClick(pintura: DPinturaBordaFundo) {
        navigate(`/paintingborderbackgrounds/${pintura.codigo}`);
    }

    function handleDeleteClick(pintura: DPinturaBordaFundo) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: pintura.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, paintingBorderBackgroundId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(paintingBorderBackgroundId) ? paintingBorderBackgroundId : [paintingBorderBackgroundId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(pintura: DPinturaBordaFundo) {
        handleInactivate([pintura.codigo]);
    }

    const columns: TableColumn<DPinturaBordaFundo>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (pintura) => pintura.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (pintura) => pintura.descricao,
            className: 'txt-left'
        },
        {
            key: 'cor',
            header: 'Cor',
            accessor: (pintura) => pintura.cor ? pintura.cor.descricao : '',
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Pintura de Borda de Fundo</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && pinturaBordaFundos.length === 0 ? (
                    <SkeletonTable columns={3} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={pinturaBordaFundos.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(pintura) => pintura.codigo}
                            rowClassName={(pintura) => `situacao-${pintura.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && pinturaBordaFundos.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="medium" aria-label="Carregando mais itens" />
                            </div>
                        )}

                        {!isLastPage && !loading && <ButtonNextPage onNextPage={handleNextPage} />}
                    </>
                )}
            </section>

            {
                error &&
                <DialogInfo
                    message={error}
                    onDialogClose={() => {}}
                />
            }

            {
                dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }
        </main>
    );
}