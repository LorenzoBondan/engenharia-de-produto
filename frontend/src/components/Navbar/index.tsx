import { Link, NavLink, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import * as authService from '../../services/authService';
import minilogo from '../../assets/images/todeschini-heart.png';
import { Package, ShoppingCart, Hammer, Trash2, FileText, User, Shield, LogOut } from 'lucide-react';
import './styles.css';
import { ContextToken } from '../../utils/context-token';

export default function Navbar() {

    const location = useLocation();

    const { contextTokenPayload, setContextTokenPayload } = useContext(ContextToken);

    function handleLogoutClick() {
        authService.logout();
        setContextTokenPayload(undefined);
    }

    const [isExpanded, setExpendState] = useState(false);

    return (
        <nav className={isExpanded ? 'admin-nav-container' : 'admin-nav-container-expanded'}>
            <div>
                <div className={isExpanded ? 'navbar-title' : 'navbar-title-expanded'}>
                    <Link to="/">
                        <img src={minilogo} alt="logo" />
                    </Link>
                </div>
                <div className='hambuger-container'>
                    <button className="hamburger" onClick={() => setExpendState(!isExpanded)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <ul className='ul-container'>
                    {authService.isAuthenticated() && (
                        <>
                            <li>
                                <NavLink to="/homestructs" className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/homestructs" ? "active-nav-item" : "")}>
                                    <Package size={isExpanded ? 20 : 28} />
                                    {isExpanded && <p>Estruturas</p>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/homeitems" className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/homeitems" ? "active-nav-item" : "")}>
                                    <ShoppingCart size={isExpanded ? 20 : 28} />
                                    {isExpanded && <p>Itens</p>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/homebasematerials" className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/homebasematerials" ? "active-nav-item" : "")}>
                                    <Hammer size={isExpanded ? 20 : 28} />
                                    {isExpanded && <p>Materiais base</p>}
                                </NavLink>
                            </li>
                            {authService.hasAnyRoles(['ROLE_ANALYST', 'ROLE_ADMIN']) && (
                                <li>
                                    <NavLink to="/admin/trash" className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/trash" ? "active-nav-item" : "")}>
                                        <Trash2 size={isExpanded ? 20 : 28} />
                                        {isExpanded && <p>Lixeira</p>}
                                    </NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink to="/reports" className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/reports" ? "active-nav-item" : "")}>
                                    <FileText size={isExpanded ? 20 : 28} />
                                    {isExpanded && <p>Relatórios</p>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/profile" ? "active-nav-item" : "")}>
                                    <User size={isExpanded ? 20 : 28} />
                                    {isExpanded && <p>Perfil</p>}
                                </NavLink>
                            </li>
                            {authService.hasAnyRoles(['ROLE_ADMIN']) && (
                                <li>
                                    <NavLink to="/admin" end className={isExpanded ? "admin-nav-item" : "admin-nav-item-expanded " + (location.pathname === "/admin" ? "active-nav-item" : "")}>
                                        <Shield size={isExpanded ? 20 : 28} />
                                        {isExpanded && <p>Admin</p>}
                                    </NavLink>
                                </li>
                            )}
                            {contextTokenPayload && authService.isAuthenticated() ? (
                                <li>
                                    <NavLink to="/" className={isExpanded ? "login-nav-item" : "login-nav-item-expanded"} onClick={handleLogoutClick}>
                                        <LogOut size={isExpanded ? 20 : 28} />
                                        {isExpanded && <p>Logout</p>}
                                    </NavLink>
                                </li>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </>
                    )}
                </ul>
            </div>
            {contextTokenPayload && authService.isAuthenticated() && (<h4 className={isExpanded ? "navbar-username" : "navbar-username-expanded"}>{contextTokenPayload?.username}</h4>)}
        </nav>
    );    
}