import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { token } = useAuth();

    // is user authenticated
    if (!token) {
        // if not, redirect to login
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};
