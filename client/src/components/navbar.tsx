import { useAuth } from "../context/AuthContext";
import { logout } from "../features/auth/api/auth";
import './navbar.css';
import { Navigate, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const {user, isAuthenticated} = useAuth();

    const navigate = useNavigate();

    if (!isAuthenticated || !user){
        return;
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
            <button>
                Logout
            </button>
            </div>
        </div>
    )
}