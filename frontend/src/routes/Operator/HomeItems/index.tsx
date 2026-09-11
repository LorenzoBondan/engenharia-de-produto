import { Link } from 'react-router-dom';
import { Users, FileText, Route } from 'lucide-react';
import './styles.css';

const HomeItems = () => {
    const sections = [
        {
            id: 1,
            title: 'Pais',
            description: 'Gerencie os itens pais do sistema com todas as suas propriedades',
            icon: Users,
            path: '/fathers',
        },
        {
            id: 2,
            title: 'Filhos',
            description: 'Configure e administre os itens filhos vinculados aos itens pais',
            icon: FileText,
            path: '/sons',
        },
        {
            id: 3,
            title: 'Roteiros',
            description: 'Crie e gerencie roteiros de produção para os itens cadastrados',
            icon: Route,
            path: '/guides',
        }
    ];

    return (
        <div className='home-items-container'>
            <div className='home-items-header'>
                <h1 className='home-items-title'>Itens e Materiais</h1>
                <p className='home-items-subtitle'>Selecione a categoria que deseja gerenciar</p>
            </div>

            <div className='home-items-grid'>
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.id}
                            to={section.path}
                            className='home-items-card-link'
                        >
                            <div className='home-items-card'>
                                <div className='home-items-card-content'>
                                    <div className='home-items-card-icon-wrapper'>
                                        <Icon className='home-items-card-icon' size={36} />
                                    </div>
                                    <h2 className='home-items-card-title'>{section.title}</h2>
                                    <p className='home-items-card-description'>{section.description}</p>
                                    <div className='home-items-card-button'>
                                        <span>Acessar</span>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7.5 15L12.5 10L7.5 5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default HomeItems;
