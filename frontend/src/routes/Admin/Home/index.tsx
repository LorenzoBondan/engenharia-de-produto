import { Link } from "react-router-dom";
import { Shield, Users, Trash2, BarChart3 } from 'lucide-react';
import './styles.css';

export default function AdminHome() {
    const adminCards = [
        {
            id: 1,
            title: 'Usuários',
            description: 'Gerencie usuários, permissões e acessos do sistema',
            icon: Users,
            path: '/admin/users',
            color: 'primary',
        },
        {
            id: 2,
            title: 'Lixeira',
            description: 'Visualize e restaure itens removidos do sistema',
            icon: Trash2,
            path: '/admin/trash',
            color: 'secondary',
        },
        {
            id: 3,
            title: 'Relatórios',
            description: 'Acesse relatórios do sistema',
            icon: BarChart3,
            path: '/reports',
            color: 'tertiary',
        },
    ];

    return (
        <div className='admin-home-main'>
            <div className='admin-home-container'>
                <div className='admin-home-header-card'>
                    <div className='admin-home-header-content'>
                        <div className='admin-home-icon-wrapper'>
                            <Shield size={32} />
                        </div>
                        <div className='admin-home-header-info'>
                            <h1 className='admin-home-title'>Painel Administrativo</h1>
                            <p className='admin-home-subtitle'>Gerencie e configure o sistema</p>
                        </div>
                    </div>
                </div>

                <div className='admin-home-grid'>
                    {adminCards.map((card) => (
                        <Link key={card.id} to={card.path} className='admin-home-card-link'>
                            <div className='admin-home-card'>
                                <div className='admin-home-card-content'>
                                    <div className={`admin-home-card-icon-wrapper admin-home-card-icon-${card.color}`}>
                                        <card.icon size={28} />
                                    </div>
                                    <h2 className='admin-home-card-title'>{card.title}</h2>
                                    <p className='admin-home-card-description'>{card.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}