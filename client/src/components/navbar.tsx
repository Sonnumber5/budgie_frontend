// Global navigation bar rendered on every page.
// The navbar is hidden when the user is not authenticated so it doesn't
// appear on the Login or Register pages.
import { useAuth } from "../context/AuthContext";
import './navbar.css';
import { Navigate, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const {user, isAuthenticated, logout} = useAuth();

    const navigate = useNavigate();

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
            <button onClick={() => {navigate('/dashboard')}}>
                Dashboard
            </button>
            <button onClick={() => {navigate('/income')}}>
                Income
            </button>
            <button onClick={() => {navigate('/expenses')}}>
                Expenses
            </button>
            <button>
                Funds
            </button>
            </div>
            <div className="auth-buttons">
            <button onClick={onLogout}>
                Logout
            </button>
            </div>
        </div>
    )
}