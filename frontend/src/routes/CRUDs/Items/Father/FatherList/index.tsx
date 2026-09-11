import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import eyeIcon from '../../../../../assets/images/eye.svg';
import { useFatherList } from '../../../../../hooks/crud/useFatherList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { DPai } from '../../../../../models/pai';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function FatherList() {

    const navigate = useNavigate();
    const { data: pais, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useFatherList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/fathers/create");
    }

    function handleUpdateClick(pai: DPai) {
        navigate(`/fathers/${pai.codigo}`);
    }

    function handleDeleteClick(pai: DPai) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: pai.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, fatherId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(fatherId) ? fatherId : [fatherId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(pai: DPai) {
        handleInactivate([pai.codigo]);
    }

    const columns: TableColumn<DPai>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (pai) => pai.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (pai) => pai.descricao,
            className: 'txt-left'
        },
        {
            key: 'categoria',
            header: 'Categoria',
            accessor: (pai) => pai.categoriaComponente.descricao,
            className: 'txt-left'
        },
        {
            key: 'modelo',
            header: 'Modelo',
            accessor: (pai) => pai.modelo.descricao,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Pais</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && pais.length === 0 ? (
                    <SkeletonTable columns={4} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={pais.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(pai) => pai.codigo}
                            rowClassName={(pai) => `situacao-${pai.situacao.toLowerCase()}`}
                            customActions={(pai) => (
                                <>
                                    <Link to={`/fathers/details/${pai.codigo}`}>
                                        <img className="visualize-btn" src={eyeIcon} alt="" />
                                    </Link>
                                    <DropdownMenu
                                        onEdit={() => handleUpdateClick(pai)}
                                        onInactivate={() => handleInactivateClick(pai)}
                                        onDelete={() => handleDeleteClick(pai)}
                                    />
                                </>
                            )}
                        />

                        {loading && pais.length > 0 && (
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