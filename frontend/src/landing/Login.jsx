import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Stethoscope,
    ArrowRight,
    LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.username, formData.password);
            // login() handles navigation based on role
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex pt-16 transition-colors duration-500">
            <div className="flex w-full">
                {/* Left – Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80"
                        alt="Hospital building"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/30"></div>
                    <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-lg text-white/90">
                            Log in to access your patient portal, appointments, and medical records.
                        </p>
                    </div>
                </div>

                {/* Right – Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                                <Stethoscope className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Access your SmartCare account
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="admin or patient1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pl-10 pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full justify-center text-base py-3">
                                <LogIn className="w-5 h-5" />
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don’t have an account?{' '}
                            <Link to="/signup" className="text-primary font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                        <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                            Demo: admin / admin123 &nbsp;|&nbsp; patient1 / patient123
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
