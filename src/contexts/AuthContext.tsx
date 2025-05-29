import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoginMutation, useGetCurrentUserQuery } from '../api/app_home/apiAuth';
import { getAccessTokenFromCookie } from '../utils/token';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loginMutation] = useLoginMutation();
    const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
        skip: !getAccessTokenFromCookie()
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = getAccessTokenFromCookie();
            setIsAuthenticated(!!token);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser.data);
            // Phân quyền dựa vào trường role
            setIsAdmin((currentUser.data as any).role === 'OWNER');
        }
    }, [currentUser]);

    const login = async (username: string, password: string) => {
        try {
            const response = await loginMutation({ username, password }).unwrap();
            document.cookie = `access_token=${response.data.token}; path=/; max-age=${3 * 60 * 60}; SameSite=Strict`;
            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 