import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '../features/auth/api/auth';
import './RegisterPage.css';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await registerAPI(email, password, name);
            navigate('/login');
        } catch (error: any) {
            setError(error.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1 className="register-title">Register</h1>

                {error && <p className="register-error">{error}</p>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-field">
                        <label className="register-label">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="register-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="register-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="register-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="register-btn">
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <button type="button" onClick={() => navigate('/login')} className="register-login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};