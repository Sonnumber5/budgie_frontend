// RegisterPage.tsx - New user registration page.
// Calls the register API directly (not through AuthContext) since registration
// does not automatically log the user in — they are redirected to /login afterward.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '../features/auth/api/auth';
import './RegisterPage.css';
import { toast } from 'react-toastify';

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
            toast.success(`Successfully registered`);
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || error.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <div className='register-page-content'>
                <p className="register-title">Register</p>
                <div className="container standard-container">

                    <div className='register-card'>
                        {error && <p className="register-error">{error}</p>}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-field-standard">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field-standard"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

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
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                            <button type="button" onClick={() => navigate('/login')} className="btn-secondary">
                                Go to Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};