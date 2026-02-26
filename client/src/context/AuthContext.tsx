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

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const response = await me();
                setUser(response.data.user);
            } catch{
                setUser(null);
            } finally{
                setIsLoading(false);
            }
        }
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
        }
    };

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error ('useAuth must be used within an AuthProvider');
    }
    return context;
}