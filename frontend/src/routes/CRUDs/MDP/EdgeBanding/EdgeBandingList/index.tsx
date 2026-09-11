import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEdgeBandingList } from '../../../../../hooks/crud/useEdgeBandingList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DFitaDeBorda } from '../../../../../models/fitaDeBorda';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function EdgeBandingList() {

    const navigate = useNavigate();
    const { data: fitasBorda, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useEdgeBandingList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/edgebandings/create");
    }

    function handleUpdateClick(fitaBorda: DFitaBorda) {
        navigate(`/edgebandings/${fitaBorda.codigo}`);
    }

    function handleDeleteClick(fitaBorda: DFitaBorda) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: fitaBorda.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, edgeBandingId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(edgeBandingId) ? edgeBandingId : [edgeBandingId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(fitaBorda: DFitaBorda) {
        handleInactivate([fitaBorda.codigo]);
    }

    const columns: TableColumn<DFitaBorda>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (fitaBorda) => fitaBorda.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (fitaBorda) => fitaBorda.descricao,
            className: 'txt-left'
        },
        {
            key: 'cor',
            header: 'Cor',
            accessor: (fitaBorda) => fitaBorda.cor ? fitaBorda.cor.descricao : '',
            className: 'txt-left'
        },
        {
            key: 'espessura',
            header: 'Espessura',
            accessor: (fitaBorda) => fitaBorda.espessura,
            className: 'txt-left'
        },
        {
            key: 'altura',
            header: 'Altura',
            accessor: (fitaBorda) => fitaBorda.altura,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Fita Borda</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && fitasBorda.length === 0 ? (
                    <SkeletonTable columns={5} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={fitasBorda.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(fitaBorda) => fitaBorda.codigo}
                            rowClassName={(fitaBorda) => `situacao-${fitaBorda.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && fitasBorda.length > 0 && (
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