// AuthContext.tsx - Global authentication state management.
// Provides the current user object, authentication status, and auth actions (login/logout)
// to any component in the tree wrapped by AuthProvider.
import { createContext, useContext, useState, useEffect } from "react";
import { loginAPI, me } from'../features/auth/api/auth';
import React from "react";
import { logoutAPI } from "../features/auth/api/auth";

interface User{
    userId: number,
    email: string,
    password: string,
    name: string
}

interface AuthContextType{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    login: (email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // On mount, call /auth/me to restore the session from an existing HTTP-only cookie.
    // This keeps the user logged in across page refreshes without storing tokens in localStorage.
    useEffect(() => {
        const checkAuth = async () => {
            try{
                const response = await me();
                setUser(response.data.user);
            } catch{
                // Cookie is absent or expired; user is not authenticated.
                setUser(null);
            } finally{
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    // logout clears the server session and resets local user state regardless of API success.
    const logout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
        }
    };

    // login calls the API, stores the returned user in state, and re-throws errors
    // so the caller (LoginPage) can display an appropriate error message.
    const login = async (email: string, password: string) => {
        try{
            const response = await loginAPI(email, password);
            const userResponse = response.data.user;
            setUser(userResponse);
        } catch(error){
            console.error('Login failed', error);
            setUser(null);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser, logout, login }}>
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