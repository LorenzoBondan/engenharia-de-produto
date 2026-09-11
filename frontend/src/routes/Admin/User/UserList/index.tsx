import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserList } from '../../../../hooks/admin/useUserList';
import ButtonInverse from '../../../../components/ButtonInverse';
import SearchBar from '../../../../components/SearchBar';
import ButtonNextPage from '../../../../components/ButtonNextPage';
import DialogInfo from '../../../../components/DialogInfo';
import DialogConfirmation from '../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../components/GenericTable';
import { DUser } from '../../../../models/user';
import { Spinner, SkeletonTable } from '../../../../components/Loading';

export default function UserList() {

    const navigate = useNavigate();

    const {
        data: users,
        loading,
        error,
        isLastPage,
        handleSearch,
        handleNextPage,
        handleDelete,
        handleInactivate
    } = useUserList();

    const [dialogInfoData, setDialogInfoData] = useState({
        visible: false,
        message: "Sucesso!"
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/admin/users/create");
    }

    function handleDialogInfoClose() {
        setDialogInfoData({ ...dialogInfoData, visible: false });
    }

    function handleUpdateClick(user: DUser) {
        navigate(`/admin/users/${user.id}`);
    }

    function handleDeleteClick(user: DUser) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: user.id, visible: true });
    }

    async function handleDialogConfirmationAnswer(answer: boolean, userId: number | number[]) {
        if (answer) {
            try {
                await handleDelete(Array.isArray(userId) ? userId : [userId]);
            } catch (error: any) {
                setDialogInfoData({
                    visible: true,
                    message: error.response?.data?.error || 'Erro ao excluir usuário'
                });
            }
        }

        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    async function handleUserInactivate(user: DUser) {
        try {
            await handleInactivate([user.id]);
        } catch (error: any) {
            setDialogInfoData({
                visible: true,
                message: error.response?.data?.error || 'Erro ao inativar usuário'
            });
        }
    }

    const columns: TableColumn<DUser>[] = [
        {
            key: 'id',
            header: 'Código',
            accessor: (user) => user.id,
            className: 'col-codigo tb576'
        },
        {
            key: 'name',
            header: 'Nome',
            accessor: (user) => user.name,
            className: 'txt-left'
        },
        {
            key: 'email',
            header: 'Email',
            accessor: (user) => user.email,
            className: 'txt-left'
        },
        {
            key: 'roles',
            header: 'Papéis',
            accessor: (user) => user.roles.map(role => role.authority).join(", "),
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Usuários</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {error && (
                    <div className="form-global-error mt20">
                        {error}
                    </div>
                )}

                {loading && users.length === 0 ? (
                    <SkeletonTable columns={4} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={users}
                            columns={columns}
                            keyExtractor={(user) => user.id}
                            rowClassName={(user) => `situacao-${user.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleUserInactivate}
                        />

                        {loading && users.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="medium" aria-label="Carregando mais itens" />
                            </div>
                        )}

                        {!isLastPage && !loading && <ButtonNextPage onNextPage={handleNextPage} />}
                    </>
                )}
            </section>

            {
                dialogInfoData.visible &&
                <DialogInfo
                    message={dialogInfoData.message}
                    onDialogClose={handleDialogInfoClose}
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