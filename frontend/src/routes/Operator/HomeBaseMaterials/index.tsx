import { Route, Routes } from 'react-router-dom';
import './styles.css';
import { PrivateRoute } from '../../../components/PrivateRoute';
import MainComponents from './MainComponents';
import MDPPage from './MainComponents/MDPPage';

export default function HomeBaseMaterials() {
    return(
        <div className='home-page'>
            <MainComponents />
            <div className='home-items-container'>
                <Routes>
                    <Route path="/homebasematerials/mdp" element={
                        <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR']}>
                            <MDPPage />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
}
