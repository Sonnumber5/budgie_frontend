// Global navigation bar rendered on every page.
// The navbar is hidden when the user is not authenticated so it doesn't
// appear on the Login or Register pages.
import { useAuth } from "../context/AuthContext";
import { NavbarDashboardIcon, NavbarExpenseIcon, NavbarIncomeIcon, NavbarSavingsFundIcon } from "../images/NavbarIcons";
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
                        <button className={pathname === '/dashboard' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/dashboard') }}>
                            <NavbarDashboardIcon/>
                            <p>Dashboard</p>
                        </button>
                        <button className={pathname === '/income' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/income') }}>
                            <NavbarIncomeIcon/>
                            <p>Income</p>
                        </button>
                        <button className={pathname === '/expenses' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/expenses') }}>
                            <NavbarExpenseIcon/>
                            <p>Expenses</p>
                        </button>
                        <button className={pathname === '/savings-funds' ? 'nav-active' : 'btn-inactive-nav'} onClick={() => { navigate('/savings-funds') }}>
                            <NavbarSavingsFundIcon/>
                            <p>Funds</p>
                        </button>
                </div>
                <div className="auth-buttons">
                    <DropdownMenu onLogout={onLogout} />
                </div>
            </div>
        </div>
    )
}