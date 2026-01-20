import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAccessTokenFromCookie } from '../utils/token';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();
    const token = getAccessTokenFromCookie();

    if (!token) {
        // Not logged in -> Redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!isAuthenticated || !user) {
        // Token exists but not authenticated yet (context sync) usually handled by loading, 
        // but if it fails validation:
        return <div>Loading user data...</div>;
    }

    // Check role
    const userRole = (user as any).role;
    if (!allowedRoles.includes(userRole)) {
        // User is logged in but doesn't have permission -> Redirect to home (customer view) or 403
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
