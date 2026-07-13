import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

/* ---------- Mock users for testing ---------- */
const MOCK_USERS = [
    {
        id: 1,
        email: 'patient@test.com',
        password: 'patient123',
        role: 'patient',
        name: 'Ayaan Ali',
        phone: '+252 61 234 5678',
        address: 'Mogadishu, Somalia',
        dob: '1990-05-15',
    },
    {
        id: 2,
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        name: 'Ahmed Admin',
    },
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Restore user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('smartcare_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('smartcare_user');
            }
        }
        setLoading(false);
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('smartcare_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('smartcare_user');
        }
    }, [user]);

    const login = (email, password) => {
        // Find mock user by email
        const found = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (!found) {
            throw new Error('Invalid email or password');
        }

        const { password: _, ...safeUser } = found; // remove password from state
        setUser(safeUser);

        // Redirect based on role
        if (safeUser.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/patient/dashboard');
        }
    };

    const signup = (userData) => {
        // In a real app, send to API. Here we just simulate.
        const newUser = {
            id: Date.now(),
            email: userData.email,
            password: userData.password,
            role: userData.role,
            name: userData.fullName,
            phone: userData.phone || '',
            address: userData.address || '',
            dob: userData.dob || '',
        };

        // Add to mock users (won't persist across refreshes – that's fine)
        MOCK_USERS.push(newUser);

        const { password: _, ...safeUser } = newUser;
        setUser(safeUser);

        // Redirect new user to their dashboard
        if (safeUser.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/patient/dashboard');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('smartcare_user');
        navigate('/');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isPatient: user?.role === 'patient',
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;