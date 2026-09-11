import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaintingList } from '../../../../../hooks/crud/usePaintingList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DPintura } from '../../../../../models/pintura';
import { getLabel } from '../../../../../models/enums/tipoPintura';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function PaintingList() {

    const navigate = useNavigate();
    const { data: pinturas, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = usePaintingList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/paintings/create");
    }

    function handleUpdateClick(pintura: DPintura) {
        navigate(`/paintings/${pintura.codigo}`);
    }

    function handleDeleteClick(pintura: DPintura) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: pintura.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, paintingId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(paintingId) ? paintingId : [paintingId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(pintura: DPintura) {
        handleInactivate([pintura.codigo]);
    }

    const columns: TableColumn<DPintura>[] = [
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
        },
        {
            key: 'tipo',
            header: 'Tipo',
            accessor: (pintura) => getLabel(pintura.tipoPintura),
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Pinturas</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && pinturas.length === 0 ? (
                    <SkeletonTable columns={4} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={pinturas.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(pintura) => pintura.codigo}
                            rowClassName={(pintura) => `situacao-${pintura.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && pinturas.length > 0 && (
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