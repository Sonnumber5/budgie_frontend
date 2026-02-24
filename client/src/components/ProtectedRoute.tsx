import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
    const {isAuthenticated, isLoading} = useAuth();
    if (isLoading){
        return <p>Loading...</p>
    }
    if (!isAuthenticated){
        return <Navigate to="/login"/>
    }
    return <>{children}</>
}