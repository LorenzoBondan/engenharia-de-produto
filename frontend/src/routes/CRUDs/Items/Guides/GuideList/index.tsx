import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import eyeIcon from '../../../../../assets/images/eye.svg';
import { useGuideList } from '../../../../../hooks/crud/useGuideList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import { formatDate } from '../../../../../utils/formatters';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { DRoteiro } from '../../../../../models/roteiro';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function GuideList() {

    const navigate = useNavigate();
    const { data: roteiros, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useGuideList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/guides/create");
    }

    function handleUpdateClick(roteiro: DRoteiro) {
        navigate(`/guides/${roteiro.codigo}`);
    }

    function handleDeleteClick(roteiro: DRoteiro) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: roteiro.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, guideId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(guideId) ? guideId : [guideId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(roteiro: DRoteiro) {
        handleInactivate([roteiro.codigo]);
    }

    const columns: TableColumn<DRoteiro>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (roteiro) => roteiro.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (roteiro) => roteiro.descricao,
            className: 'txt-left'
        },
        {
            key: 'implantacao',
            header: 'Implantação',
            accessor: (roteiro) => formatDate(roteiro.implantacao.toString()),
            className: 'txt-left'
        },
        {
            key: 'dataFinal',
            header: 'Data Final',
            accessor: (roteiro) => formatDate(roteiro.dataFinal.toString()),
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Roteiro</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && roteiros.length === 0 ? (
                    <SkeletonTable columns={4} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={roteiros.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(roteiro) => roteiro.codigo}
                            rowClassName={(roteiro) => `situacao-${roteiro.situacao.toLowerCase()}`}
                            customActions={(roteiro) => (
                                <>
                                    <Link to={`/guides/details/${roteiro.codigo}`}>
                                        <img className="visualize-btn" src={eyeIcon} alt="" />
                                    </Link>
                                    <DropdownMenu
                                        onEdit={() => handleUpdateClick(roteiro)}
                                        onInactivate={() => handleInactivateClick(roteiro)}
                                        onDelete={() => handleDeleteClick(roteiro)}
                                    />
                                </>
                            )}
                        />

                        {loading && roteiros.length > 0 && (
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