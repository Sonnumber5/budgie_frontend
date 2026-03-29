// Global navigation bar rendered on every page.
// The navbar is hidden when the user is not authenticated so it doesn't
// appear on the Login or Register pages.
import { useAuth } from "../context/AuthContext";
import './Navbar.css';
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const {user, isAuthenticated, logout} = useAuth();

    const navigate = useNavigate();
    const { pathname } = useLocation();

    // onLogout clears auth state then redirects the user to the login page.
    const onLogout = () => {
        logout();
        navigate('/login');
    }

    if (!isAuthenticated || !user){
        return null;
    }
    return (
        <div className="navbar">
            <div className="logo">
        Logo
            </div>
            <div className="nav-buttons">
            <button className={pathname === '/dashboard' ? 'btn-primary' : 'btn-secondary'} onClick={() => {navigate('/dashboard')}}>
                Dashboard
            </button>
            <button className={pathname === '/income' ? 'btn-primary' : 'btn-secondary'} onClick={() => {navigate('/income')}}>
                Income
            </button>
            <button className={pathname === '/expenses' ? 'btn-primary' : 'btn-secondary'} onClick={() => {navigate('/expenses')}}>
                Expenses
            </button>
            <button className={pathname === '/savings-funds' ? 'btn-primary' : 'btn-secondary'} onClick={() => {navigate('/savings-funds')}}>
                Funds
            </button>
            </div>
            <div className="auth-buttons">
            <button className="btn-danger" onClick={onLogout}>
                Logout
            </button>
            </div>
        </div>
    )
}