import { NavLink, useLocation } from "react-router-dom";
import { Box, Package, Layers, Archive, Cog, Palette } from 'lucide-react';
import './styles.css';

const MainComponents = () => {
    const location = useLocation();

    const sections = [
        {
            id: 1,
            title: 'MDP',
            description: 'Gerencie materiais base de MDP',
            icon: Box,
            path: '/homebasematerials/mdp',
        },
        {
            id: 2,
            title: 'MDF',
            description: 'Configure materiais base de MDF',
            icon: Package,
            path: '/homebasematerials/mdf',
        },
        {
            id: 3,
            title: 'Alumínios',
            description: 'Administre materiais de alumínio',
            icon: Layers,
            path: '/homebasematerials/aluminium',
        },
        {
            id: 4,
            title: 'Embalagem',
            description: 'Gerencie materiais de embalagem',
            icon: Archive,
            path: '/homebasematerials/packaging',
        },
        {
            id: 5,
            title: 'Máquinas',
            description: 'Configure máquinas e equipamentos',
            icon: Cog,
            path: '/homebasematerials/machines',
        },
        {
            id: 6,
            title: 'Cores, Modelos, Categorias e Medidas',
            description: 'Gerencie paletas de cores, Modelos, Categorias e Medidas',
            icon: Palette,
            path: '/homebasematerials/public',
        }
    ];

    return (
        <div className="base-materials-container">
            <div className='base-materials-header'>
                <h1 className='base-materials-title'>Materiais Base</h1>
                <p className='base-materials-subtitle'>Selecione o tipo de material que deseja gerenciar</p>
            </div>

            <div className="base-materials-grid">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = location.pathname === section.path;

                    return (
                        <NavLink
                            key={section.id}
                            to={section.path}
                            className='base-materials-card-link'
                        >
                            <div className={`base-materials-card ${isActive ? 'base-materials-card-active' : ''}`}>
                                <div className='base-materials-card-content'>
                                    <div className='base-materials-card-icon-wrapper'>
                                        <Icon className='base-materials-card-icon' size={32} />
                                    </div>
                                    <h2 className='base-materials-card-title'>{section.title}</h2>
                                    <p className='base-materials-card-description'>{section.description}</p>
                                    <div className='base-materials-card-button'>
                                        <span>Acessar</span>
                                        <svg
                                            width="16"
                                            height="16"
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
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}

export default MainComponents;
