import { useAuth } from "../context/AuthContext";
import { logout } from "../features/auth/api/auth";
import './navbar.css';


export const Navbar = () => {
    const {user, isAuthenticated} = useAuth();
    if (!isAuthenticated || !user){
        return;
    }
    return (
        <div className="navbar">
            <div className="logo">
        Logo
            </div>
            <div className="nav-buttons">
            <button>
                Income
            </button>
            <button>
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