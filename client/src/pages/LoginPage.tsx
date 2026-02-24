import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/api/auth';
import './LoginPage.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(email, password);
            navigate('/expenses');
        } catch (error: any) {
            setError(error.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Login</h1>

                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label className="login-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="login-btn">
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" onClick={() => navigate('/register')} className="login-register-btn">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};