import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useEditProfile } from '../../../../hooks/operator/useEditProfile';
import './styles.css';

export default function EditProfile() {
    const navigate = useNavigate();
    const { updatePassword, loading, error, success, clearMessages } = useEditProfile();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/profile');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const validateForm = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setValidationError('Todos os campos são obrigatórios');
            return false;
        }

        if (newPassword.length < 6) {
            setValidationError('A nova senha deve ter no mínimo 6 caracteres');
            return false;
        }

        if (newPassword !== confirmPassword) {
            setValidationError('As senhas não coincidem');
            return false;
        }

        if (oldPassword === newPassword) {
            setValidationError('A nova senha deve ser diferente da senha atual');
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await updatePassword(oldPassword, newPassword);

        if (result) {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleInputChange = () => {
        if (validationError) {
            setValidationError(null);
        }
        if (error) {
            clearMessages();
        }
    };

    return (
        <div className='edit-profile-main'>
            <div className='edit-profile-container'>
                {/* Header Card */}
                <div className='edit-profile-header-card'>
                    <div className='edit-profile-header-content'>
                        <div className='edit-profile-icon-wrapper'>
                            <Lock size={32} />
                        </div>
                        <div className='edit-profile-header-info'>
                            <h1 className='edit-profile-title'>Alterar Senha</h1>
                            <p className='edit-profile-subtitle'>Mantenha sua conta segura com uma senha forte</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className='edit-profile-success-card'>
                        <div className='edit-profile-success-icon'>
                            <CheckCircle size={24} />
                        </div>
                        <div className='edit-profile-success-info'>
                            <h3 className='edit-profile-success-title'>Senha atualizada com sucesso!</h3>
                            <p className='edit-profile-success-message'>
                                Você será redirecionado para o perfil...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {(error || validationError) && (
                    <div className='edit-profile-error-card'>
                        <div className='edit-profile-error-icon'>
                            <AlertCircle size={24} />
                        </div>
                        <div className='edit-profile-error-info'>
                            <h3 className='edit-profile-error-title'>Erro</h3>
                            <p className='edit-profile-error-message'>
                                {error || validationError}
                            </p>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <div className='edit-profile-form-card'>
                    <form className='edit-profile-form' onSubmit={handleSubmit}>
                        {/* Old Password */}
                        <div className='edit-profile-form-field'>
                            <label className='edit-profile-form-label'>
                                Senha Atual
                            </label>
                            <div className='edit-profile-password-field'>
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => {
                                        setOldPassword(e.target.value);
                                        handleInputChange();
                                    }}
                                    className='edit-profile-form-input'
                                    placeholder='Digite sua senha atual'
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    className='edit-profile-toggle-password'
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    disabled={loading}
                                >
                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className='edit-profile-form-field'>
                            <label className='edit-profile-form-label'>
                                Nova Senha
                            </label>
                            <div className='edit-profile-password-field'>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        handleInputChange();
                                    }}
                                    className='edit-profile-form-input'
                                    placeholder='Digite sua nova senha'
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    className='edit-profile-toggle-password'
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={loading}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <small className='edit-profile-form-hint'>Mínimo de 6 caracteres</small>
                        </div>

                        {/* Confirm Password */}
                        <div className='edit-profile-form-field'>
                            <label className='edit-profile-form-label'>
                                Confirmar Nova Senha
                            </label>
                            <div className='edit-profile-password-field'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        handleInputChange();
                                    }}
                                    className='edit-profile-form-input'
                                    placeholder='Confirme sua nova senha'
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    className='edit-profile-toggle-password'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='edit-profile-form-actions'>
                            <button
                                type='button'
                                className='edit-profile-cancel-button'
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                <ArrowLeft size={20} />
                                Cancelar
                            </button>
                            <button
                                type='submit'
                                className='edit-profile-save-button'
                                disabled={loading}
                            >
                                <Save size={20} />
                                {loading ? 'Salvando...' : 'Salvar Senha'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
