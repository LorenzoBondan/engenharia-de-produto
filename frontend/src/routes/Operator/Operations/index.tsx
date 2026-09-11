import { Link } from 'react-router-dom';
import { Package, Layers, Database } from 'lucide-react';
import './styles.css';

const Operations = () => {
    const sections = [
        {
            id: 1,
            title: 'Estruturas',
            description: 'Gere automaticamente cadastros, estruturas e roteiros dos itens de MDP, MDF, Modulação, Alumínios e Embalagem',
            icon: Package,
            path: '/homestructs',
            gradient: 'from-blue-600 to-purple-600',
            bgImage: 'background1.jpg'
        },
        {
            id: 2,
            title: 'Itens e Materiais',
            description: 'Crie e altere manualmente itens, materiais e roteiros utilizados nas estruturas de MDP, MDF, Modulação, Alumínios e Embalagem',
            icon: Layers,
            path: '/homeitems',
            gradient: 'from-purple-600 to-pink-600',
            bgImage: 'background3.jpg'
        },
        {
            id: 3,
            title: 'Materiais Base',
            description: 'Busque e altere os materiais base de MDP, MDF, Modulação, Alumínios e Embalagem, além de Máquinas e Cores',
            icon: Database,
            path: '/homebasematerials',
            gradient: 'from-pink-600 to-red-600',
            bgImage: 'background4.jpg'
        }
    ];

    return (
        <div className='operations-container'>
            <div className='operations-header'>
                <h1 className='operations-title'>Operações</h1>
                <p className='operations-subtitle'>Escolha a área que deseja gerenciar</p>
            </div>

            <div className='operations-grid'>
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.id}
                            to={section.path}
                            className='operation-card-link'
                        >
                            <div className={`operation-card operation-card-${section.id}`}>
                                <div className='operation-card-overlay'></div>
                                <div className='operation-card-content'>
                                    <div className='operation-card-icon-wrapper'>
                                        <Icon className='operation-card-icon' size={40} />
                                    </div>
                                    <h2 className='operation-card-title'>{section.title}</h2>
                                    <p className='operation-card-description'>{section.description}</p>
                                    <div className='operation-card-button'>
                                        <span>Acessar</span>
                                        <svg
                                            width="20"
                                            height="20"
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

export default Operations;
