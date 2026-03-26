// AuthContext.tsx - Global authentication state management.
// Provides the current user object, authentication status, and auth actions (login/logout)
// to any component in the tree wrapped by AuthProvider.
import { createContext, useContext, useState, useEffect } from "react";
import { loginAPI, me, logoutAPI } from'../features/auth/api/auth';
import React from "react";

interface User{
    userId: number,
    email: string,
    name: string
}

interface AuthContextType{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    login: (email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    // On mount, call /auth/me to restore the session from an existing HTTP-only cookie.
    // This keeps the user logged in across page refreshes without storing tokens in localStorage.
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            setError(null);
            try{
                const response = await me();
                setUser(response.data.user);
            } catch(error: any){
                // Cookie is absent or expired; user is not authenticated.
                setUser(null);
                setError(error.response?.data?.error || error.message || 'Could not verify');
            } finally{
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    // logout clears the server session and resets local user state regardless of API success.
    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await logoutAPI();
        } catch (error: any) {
            setError(error.response?.data?.error || error.message || 'Failed to logout');
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    };

    // login calls the API, stores the returned user in state, and re-throws errors
    // so the caller (LoginPage) can display an appropriate error message.
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await loginAPI(email, password);
            const userResponse = response.data.user;
            setUser(userResponse);
        } catch(error: any){
            setError(error.response?.data?.error || error.message || 'Failed to login');
            setUser(null);
            throw error;
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, setUser, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth is the public hook for consuming auth state and actions.
// Throws if used outside of an AuthProvider.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error ('useAuth must be used within an AuthProvider');
    }
    return context;
}