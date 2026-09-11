import { Link } from 'react-router-dom';
import { Layers, Box } from 'lucide-react';
import './styles.css';

const HomeStruct = () => {
    const sections = [
        {
            id: 1,
            title: 'Estrutura MDP/MDF',
            description: 'Gerencie estruturas de MDP e MDF com cadastros e roteiros completos',
            icon: Box,
            path: '/singlestruct',
        },
        {
            id: 2,
            title: 'Estrutura Modulação/Alumínios',
            description: 'Configure estruturas de modulação e alumínios com todas as especificações',
            icon: Layers,
            path: '/multistruct',
        }
    ];

    return (
        <div className='home-struct-container'>
            <div className='home-struct-header'>
                <h1 className='home-struct-title'>Estruturas</h1>
                <p className='home-struct-subtitle'>Selecione o tipo de estrutura que deseja gerenciar</p>
            </div>

            <div className='home-struct-grid'>
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.id}
                            to={section.path}
                            className='home-struct-card-link'
                        >
                            <div className='home-struct-card'>
                                <div className='home-struct-card-content'>
                                    <div className='home-struct-card-icon-wrapper'>
                                        <Icon className='home-struct-card-icon' size={36} />
                                    </div>
                                    <h2 className='home-struct-card-title'>{section.title}</h2>
                                    <p className='home-struct-card-description'>{section.description}</p>
                                    <div className='home-struct-card-button'>
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

export default HomeStruct;
