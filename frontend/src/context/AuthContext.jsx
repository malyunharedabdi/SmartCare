import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Restore session from a stored token on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('smartcare_user');
        const storedPatient = localStorage.getItem('smartcare_patient');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                if (storedPatient) setPatient(JSON.parse(storedPatient));
            } catch {
                localStorage.removeItem('access_token');
                localStorage.removeItem('smartcare_user');
                localStorage.removeItem('smartcare_patient');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await authAPI.login({ username, password });
        const { access_token, user: loggedInUser } = res.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('smartcare_user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        // Pull the linked patient record (if any) for patient accounts
        if (loggedInUser.role === 'patient') {
            try {
                const profileRes = await authAPI.getProfile();
                if (profileRes.data.patient) {
                    localStorage.setItem('smartcare_patient', JSON.stringify(profileRes.data.patient));
                    setPatient(profileRes.data.patient);
                }
            } catch {
                // non-fatal — dashboard can still refetch as needed
            }
        }

        if (loggedInUser.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/patient/dashboard');
        }
    };

    const signup = async (formData) => {
        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role || 'patient',
            name: formData.name,
            phone: formData.phone,
            age: formData.age ? Number(formData.age) : undefined,
            gender: formData.gender,
        };

        const res = await authAPI.register(payload);
        const { access_token, user: newUser, patient: newPatient } = res.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('smartcare_user', JSON.stringify(newUser));
        setUser(newUser);

        if (newPatient) {
            localStorage.setItem('smartcare_patient', JSON.stringify(newPatient));
            setPatient(newPatient);
        }

        if (newUser.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/patient/dashboard');
        }
    };

    const logout = () => {
        setUser(null);
        setPatient(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('smartcare_user');
        localStorage.removeItem('smartcare_patient');
        navigate('/');
    };

    const value = {
        user,
        patient,
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
