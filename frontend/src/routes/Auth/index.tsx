import './styles.css';
import background from '../../assets/images/background.jpg';
import Login from './Login';

const Auth = () => {
    return(
        <div className="auth-container" style={{backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    }}>
            <div className='auth-form-container'>
                <div className="auth-form-info">
                    
                    <h1>Engenharia de Produto</h1>
                    <h4>Configurador</h4>
                    <p className="separator"></p>
                    <p>Cadastre, gere as estruturas e crie os roteiros dos itens de Alumínio, MDP, MDF e Modulação.</p>
                </div>
                <div className="auth-login-container">
                    <Login />
                </div>
            </div>
        </div>
    );
}

export default Auth;