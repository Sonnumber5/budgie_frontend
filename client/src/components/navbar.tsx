// Global navigation bar rendered on every page.
// The navbar is hidden when the user is not authenticated so it doesn't
// appear on the Login or Register pages.
import { useAuth } from "../context/AuthContext";
import { NavbarIncomeIcon } from "../images/Icons";
import { DropdownMenu } from "./DropdownMenu";
import './navbar.css';
import { useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();
    const { pathname } = useLocation();

    // onLogout clears auth state then redirects the user to the login page.
    const onLogout = () => {
        logout();
        navigate('/login');
    }

    if (!isAuthenticated || !user) {
        return null;
    }
    return (
        <div className="navbar">
            <div className="navbar-brand">Budgie</div>
            <div className="navbar-content">
                <div className="nav-buttons">
                    <div className="nav-btn-icon-lockup">
                        <button className={pathname === '/dashboard' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/dashboard') }}>
                            Dashboard
                        </button>
                    </div>
                    <div className="nav-btn-icon-lockup">
                        <NavbarIncomeIcon/>
                        <button className={pathname === '/income' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/income') }}>
                            Income
                        </button>
                    </div>
                    <div className="nav-btn-icon-lockup">
                        <button className={pathname === '/expenses' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/expenses') }}>
                            Expenses
                        </button>
                    </div>
                    <div className="nav-btn-icon-lockup">
                        <button className={pathname === '/savings-funds' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/savings-funds') }}>
                            Funds
                        </button>
                    </div>
                </div>
                <div className="auth-buttons">
                    <DropdownMenu onLogout={onLogout} />
                </div>
            </div>
        </div>
    )
}