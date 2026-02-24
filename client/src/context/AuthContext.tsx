import { createContext, useContext, useState, useEffect } from "react";
import { me } from'../features/auth/api/auth';
import React from "react";

interface User{
    userId: number,
    email: string,
    password: string
}

interface AuthContextType{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void
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

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser }}>
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