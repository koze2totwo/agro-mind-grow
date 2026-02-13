import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials
const VALID_CREDENTIALS = {
    email: 'farmer@mail.com',
    password: '1234',
    username: 'Farmer'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('agromind_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('agromind_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
            const userData = {
                username: VALID_CREDENTIALS.username,
                email: VALID_CREDENTIALS.email
            };
            setUser(userData);
            localStorage.setItem('agromind_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('agromind_user');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
