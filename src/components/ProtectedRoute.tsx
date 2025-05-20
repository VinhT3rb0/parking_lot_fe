import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAccessTokenFromCookie } from '../utils/token';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const token = getAccessTokenFromCookie();
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }
    return <>{children}</>;
};

export default ProtectedRoute; 