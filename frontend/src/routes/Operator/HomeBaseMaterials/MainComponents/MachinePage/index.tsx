import { Link } from 'react-router-dom';
import { Cog, FolderCog } from 'lucide-react';
import '../shared-styles.css';

const MachinePage = () => {
    const items = [
        {
            id: 1,
            title: 'Máquinas',
            description: 'Gerencie máquinas e equipamentos',
            icon: Cog,
            path: '/machines',
        },
        {
            id: 2,
            title: 'Grupos de Máquinas',
            description: 'Configure grupos e categorias',
            icon: FolderCog,
            path: '/machineGroups',
        }
    ];

    return (
        <div className='material-page-container'>
            <div className='material-page-header'>
                <h1 className='material-page-title'>Máquinas</h1>
                <p className='material-page-subtitle'>Selecione o que deseja gerenciar</p>
            </div>

            <div className='material-page-grid'>
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className='material-card-link'
                        >
                            <div className='material-card'>
                                <div className='material-card-content'>
                                    <div className='material-card-icon-wrapper'>
                                        <Icon className='material-card-icon' size={28} />
                                    </div>
                                    <h2 className='material-card-title'>{item.title}</h2>
                                    <p className='material-card-description'>{item.description}</p>
                                    <div className='material-card-button'>
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
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default MachinePage;
