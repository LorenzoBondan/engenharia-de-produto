import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserForm } from '../../../../hooks/admin/useUserForm';
import FormLabel from '../../../../components/FormLabel';
import FormInput from '../../../../components/FormInput';
import FormSelect from '../../../../components/FormSelect';
import { toast } from 'react-toastify';
import { LoadingButton } from '../../../../components/Loading';

export default function UserForm() {

    const params = useParams();
    const navigate = useNavigate();

    const userId = params.userId !== 'create' ? Number(params.userId) : undefined;

    const {
        formData,
        roles,
        rolesLoading,
        handleInputChange,
        handleTurnDirty,
        handleSubmit: handleFormSubmit,
        loading,
        submitSuccess,
        isEditing,
    } = useUserForm(userId);

    // Navigate to list page on successful submission
    useEffect(() => {
        if (submitSuccess) {
            const successMessage = isEditing ? 'Usuário editado!' : 'Usuário Inserido!';
            toast.success(successMessage);
            navigate('/admin/users');
        }
    }, [submitSuccess, isEditing, navigate]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        handleFormSubmit(event);
    }  
    
    return(
        <main>
            <section id="form-section" className="container">
                <div className="form-container">
                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Usuário</h2>
                        <div className="form-controls-container">
                            <div>
                                <FormLabel text="Nome" isRequired />
                                <FormInput
                                    {...formData.name}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.name.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Senha" isRequired />
                                <FormInput
                                    {...formData.password}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.password.message}</div>
                            </div>
                            <div>
                                <FormLabel text="Email" isRequired />
                                <FormInput
                                    {...formData.email}
                                    className="form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="form-error">{formData.email.message}</div>
                            </div>
                            <div>
                                <FormSelect
                                    {...formData.roles}
                                    className="form-control form-select-container"
                                    onChange={(obj: any) => {
                                        handleInputChange({ target: { name: "roles", value: obj } } as any);
                                    }}
                                    onTurnDirty={handleTurnDirty}
                                    isMulti
                                    getOptionLabel={(obj: any) => obj.authority}
                                    getOptionValue={(obj: any) => String(obj.id)}
                                />
                                <div className="form-error">{formData.roles.message}</div>
                            </div>
                        </div>
                        <div className="form-buttons">
                            <Link to="/admin/users">
                                <button type="reset" className="btn btn-white">Cancelar</button>
                            </Link>
                            <LoadingButton
                                loading={loading}
                                text="Salvar"
                                loadingText="Salvando..."
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}