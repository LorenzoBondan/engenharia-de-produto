import './styles.css';
import { Link } from 'react-router-dom';
import { useProfile } from '../../../hooks/operator/useProfile';
import { User, Mail, Edit } from 'lucide-react';

export default function Profile() {

    const { user } = useProfile();

    return(
        <div className='profile-main'>
            <div className='profile-container'>
                <div className='profile-header-card'>
                    <div className='profile-header-content'>
                        <div className='profile-icon-wrapper'>
                            <User size={32} />
                        </div>
                        <div className='profile-header-info'>
                            <h1 className='profile-title'>Meu Perfil</h1>
                            <p className='profile-subtitle'>Gerencie suas informações pessoais</p>
                        </div>
                    </div>
                </div>

                <div className='profile-card'>
                    {user?.userAnexo &&
                        <div className='profile-avatar-container'>
                            <img
                                src={`data:image/jpeg;base64,${user?.userAnexo.anexo.binario.bytes}`}
                                alt="Avatar"
                                className='profile-avatar'
                            />
                        </div>
                    }

                    <div className='profile-info'>
                        <div className='profile-info-item'>
                            <div className='profile-info-icon'>
                                <User size={20} />
                            </div>
                            <div className='profile-info-content'>
                                <span className='profile-info-label'>Nome</span>
                                <span className='profile-info-value'>{user?.name}</span>
                            </div>
                        </div>

                        <div className='profile-info-item'>
                            <div className='profile-info-icon'>
                                <Mail size={20} />
                            </div>
                            <div className='profile-info-content'>
                                <span className='profile-info-label'>Email</span>
                                <span className='profile-info-value'>{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <Link to={`/profile/${user?.id}/edit`} className='profile-edit-button'>
                        <Edit size={20} />
                        Alterar senha
                    </Link>
                </div>
            </div>
        </div>
    );
}