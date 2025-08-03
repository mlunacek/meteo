import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '@/Auth/useAuth';

export default function RequireAuth({ children }) {
    const user = useAuth();
    console.log("user", user)

    const location = useLocation();

    if (!user?.isAuthenticated) {
        return <Navigate to="/auth" replace state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
