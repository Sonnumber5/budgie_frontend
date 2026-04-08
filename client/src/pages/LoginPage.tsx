// LoginPage.tsx - User login page.
// On successful login the user is redirected to /dashboard.
// Error messages are displayed inline below the form title.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';
import { useDateContext } from '../context/DateContext';
import { toast } from 'react-toastify';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { resetMonth } = useDateContext();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(email, password);
            resetMonth();
            toast.success('Login successful');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <div className='login-page-content'>
                <p className="login-title">Login</p>
                <div className="container standard-container">

                    <div className='login-card'>

                        {error && <p className="login-error">{error}</p>}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-field-standard">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field-standard"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="form-field-standard">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field-standard"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" disabled={isLoading} className="btn-primary">
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            <button type="button" onClick={() => navigate('/register')} className="btn-secondary">
                                Register New User
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};