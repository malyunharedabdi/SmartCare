import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await authAPI.getProfile();
                const { user: userData, patient } = res.data;
                if (patient) {
                    setProfile({
                        name: patient.name || '',
                        email: patient.email || userData.email,
                        phone: patient.phone || '',
                        address: patient.address || '',
                        dob: patient.dob || '',
                    });
                } else {
                    setProfile(prev => ({ ...prev, email: userData.email }));
                }
            } catch (err) {
                toast.error('Failed to load profile');
                setProfile(prev => ({ ...prev, email: user?.email || '' }));
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // The update logic will be added later (requires patient update endpoint)
            toast.success('Profile updated (feature coming soon)');
            setEditing(false);
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>

            <div className="card">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {profile.name || user?.username}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role}</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <User className="w-4 h-4 inline mr-1" /> Full Name
                        </label>
                        {editing ? (
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="input-field"
                            />
                        ) : (
                            <p className="py-2 text-gray-900 dark:text-white">{profile.name || 'Not set'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Mail className="w-4 h-4 inline mr-1" /> Email
                        </label>
                        <p className="py-2 text-gray-900 dark:text-white">{profile.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Phone className="w-4 h-4 inline mr-1" /> Phone
                        </label>
                        {editing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="input-field"
                            />
                        ) : (
                            <p className="py-2 text-gray-900 dark:text-white">{profile.phone || 'Not set'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <MapPin className="w-4 h-4 inline mr-1" /> Address
                        </label>
                        {editing ? (
                            <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                className="input-field"
                            />
                        ) : (
                            <p className="py-2 text-gray-900 dark:text-white">{profile.address || 'Not set'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <Calendar className="w-4 h-4 inline mr-1" /> Date of Birth
                        </label>
                        {editing ? (
                            <input
                                type="date"
                                name="dob"
                                value={profile.dob}
                                onChange={handleChange}
                                className="input-field"
                            />
                        ) : (
                            <p className="py-2 text-gray-900 dark:text-white">{profile.dob || 'Not set'}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {editing ? (
                            <>
                                <button type="submit" className="btn-primary">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="btn-primary"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;