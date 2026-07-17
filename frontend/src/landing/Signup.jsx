import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Stethoscope,
    ArrowRight,
    User,
    Phone,
    UserPlus,
    Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Other',
        password: '',
        role: 'patient',
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            // signup() handles navigation
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex pt-16 transition-colors duration-500">
            <div className="flex w-full">
                {/* Left – Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=900&q=80"
                        alt="Doctor with stethoscope"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/30"></div>
                    <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Join SmartCare</h2>
                        <p className="text-lg text-white/90">
                            Create an account to book appointments, access your records, and more.
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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Start your healthcare journey
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <User className="w-4 h-4 inline mr-1" /> Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Haima"
                                    required
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <User className="w-4 h-4 inline mr-1" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Malyun Hared"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <Mail className="w-4 h-4 inline mr-1" /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <Phone className="w-4 h-4 inline mr-1" /> Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="+254 712 346 567"
                                />
                            </div>

                            {/* Age & Gender (row) */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="Other">Other</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <Lock className="w-4 h-4 inline mr-1" /> Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field pr-10"
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

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Shield className="w-4 h-4 inline mr-1" /> Account Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'patient' })}
                                        className={`p-3 rounded-lg border text-center transition-colors ${formData.role === 'patient'
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                                            }`}
                                    >
                                        <User className="w-5 h-5 mx-auto mb-1" />
                                        <span className="text-sm font-medium">Patient</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                                        className={`p-3 rounded-lg border text-center transition-colors ${formData.role === 'admin'
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/50'
                                            }`}
                                    >
                                        <Shield className="w-5 h-5 mx-auto mb-1" />
                                        <span className="text-sm font-medium">Admin</span>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full justify-center text-base py-3">
                                <UserPlus className="w-5 h-5" />
                                Create Account
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
