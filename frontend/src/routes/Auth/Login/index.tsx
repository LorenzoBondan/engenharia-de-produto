import './styles.css';
import { useLogin } from '../../../hooks/auth/useLogin';
import FormInput from '../../../components/FormInput';
import { LoadingButton } from '../../../components/Loading';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
    const {
        formData,
        submitResponseFail,
        loading,
        handleSubmit,
        handleInputChange,
        handleTurnDirty,
    } = useLogin();

    return (
        <main>
            <section id="login-section" className="container">
                <div className="login-form-container">
                    <form className="login-card" onSubmit={handleSubmit}>
                        {/* Login Header */}
                        <div className="login-header">
                            <div className="login-icon-wrapper">
                                <Lock size={28} />
                            </div>
                            <h2 className="login-title">Bem-vindo</h2>
                            <p className="login-subtitle">Entre com suas credenciais para acessar o sistema</p>
                        </div>

                        {/* Error Message */}
                        {submitResponseFail && (
                            <div className="login-error-card">
                                <div className="login-error-icon">
                                    <AlertCircle size={20} />
                                </div>
                                <p className="login-error-message">
                                    Usuário ou senha inválidos
                                </p>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="login-form-controls-container">
                            <div className="login-form-field">
                                <label className="login-form-label">
                                    <User size={16} />
                                    Usuário
                                </label>
                                <FormInput
                                    {...formData.username}
                                    className="login-form-input"
                                    autoComplete="email"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                {formData.username.dirty === "true" && formData.username.invalid === "true" && (
                                    <div className="login-field-error">{formData.username.message}</div>
                                )}
                            </div>

                            <div className="login-form-field">
                                <label className="login-form-label">
                                    <Lock size={16} />
                                    Senha
                                </label>
                                <FormInput
                                    {...formData.password}
                                    className="login-form-input"
                                    autoComplete="current-password"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="login-form-buttons">
                            <LoadingButton
                                loading={loading}
                                text="Entrar"
                                loadingText="Entrando..."
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}