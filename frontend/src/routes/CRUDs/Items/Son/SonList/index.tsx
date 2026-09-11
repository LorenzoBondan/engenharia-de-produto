import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import eyeIcon from '../../../../../assets/images/eye.svg';
import { useSonList } from '../../../../../hooks/crud/useSonList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';
import { DFilho } from '../../../../../models/filho';

export default function SonList() {

    const navigate = useNavigate();
    const { data: filhos, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useSonList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/sons/create");
    }

    function handleUpdateClick(filho: DFilho) {
        navigate(`/sons/${filho.codigo}`);
    }

    function handleDeleteClick(filho: DFilho) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: filho.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, sonId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(sonId) ? sonId : [sonId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(filho: DFilho) {
        handleInactivate([filho.codigo]);
    }

    const columns: TableColumn<DFilho>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (filho) => filho.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (filho) => filho.descricao,
            className: 'txt-left'
        },
        {
            key: 'pai',
            header: 'Pai',
            accessor: (filho) => filho.pai.descricao,
            className: 'txt-left'
        },
        {
            key: 'cor',
            header: 'Cor',
            accessor: (filho) => filho.cor.descricao,
            className: 'txt-left'
        },
        {
            key: 'medidas',
            header: 'Medidas',
            accessor: (filho) => `${filho.medidas.altura}X${filho.medidas.largura}X${filho.medidas.espessura}`,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Filhos</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && filhos.length === 0 ? (
                    <SkeletonTable columns={5} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={filhos.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(filho) => filho.codigo}
                            rowClassName={(filho) => `situacao-${filho.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                            customActions={(filho) => (
                                <>
                                    <Link to={`/sons/details/${filho.codigo}`}>
                                        <img className="visualize-btn" src={eyeIcon} alt="" />
                                    </Link>
                                    <DropdownMenu
                                        onEdit={() => handleUpdateClick(filho)}
                                        onInactivate={() => handleInactivateClick(filho)}
                                        onDelete={() => handleDeleteClick(filho)}
                                    />
                                </>
                            )}
                        />

                        {loading && filhos.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="medium" aria-label="Carregando mais itens" />
                            </div>
                        )}

                        {
                            !isLastPage && !loading &&
                            <ButtonNextPage onNextPage={handleNextPage} />
                        }
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