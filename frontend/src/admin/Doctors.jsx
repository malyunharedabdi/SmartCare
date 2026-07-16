import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, UserPlus, X, Star, Briefcase, DollarSign, GraduationCap, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorAPI } from '../services/api';

const emptyForm = {
    name: '',
    specialization: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    experience: '',
    consultation_fee: '',
};

// Deterministic gradient per doctor so avatars stay visually varied but stable
const avatarGradients = [
    'from-primary to-primary-dark',
    'from-emerald-400 to-teal-600',
    'from-sky-400 to-blue-600',
    'from-amber-400 to-orange-600',
    'from-fuchsia-400 to-purple-600',
    'from-rose-400 to-pink-600',
];

const getInitials = (name = '') =>
    name
        .replace(/^Dr\.?\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase();

const gradientFor = (id) => avatarGradients[id % avatarGradients.length];

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editDoctor, setEditDoctor] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchDoctors = async () => {
        try {
            const res = await doctorAPI.getAll();
            setDoctors(res.data);
        } catch (err) {
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(
        (doc) =>
            doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(search.toLowerCase())
    );

    const openAddModal = () => {
        setEditDoctor(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (doctor) => {
        setEditDoctor(doctor);
        setFormData({
            name: doctor.name || '',
            specialization: doctor.specialization || '',
            email: doctor.email || '',
            phone: doctor.phone || '',
            department: doctor.department || '',
            qualification: doctor.qualification || '',
            experience: doctor.experience ?? '',
            consultation_fee: doctor.consultation_fee ?? '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.specialization.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error('Name, specialization, email and phone are required');
            return;
        }

        const payload = {
            ...formData,
            experience: formData.experience === '' ? undefined : Number(formData.experience),
            consultation_fee: formData.consultation_fee === '' ? undefined : Number(formData.consultation_fee),
        };

        try {
            if (editDoctor) {
                await doctorAPI.update(editDoctor.id, payload);
                toast.success('Doctor updated');
            } else {
                await doctorAPI.create(payload);
                toast.success('Doctor added');
            }
            setShowModal(false);
            fetchDoctors();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save doctor');
        }
    };

    const deleteDoctor = async (id) => {
        if (!window.confirm('Delete this doctor?')) return;
        try {
            await doctorAPI.delete(id);
            toast.success('Doctor deleted');
            fetchDoctors();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete doctor');
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Manage Doctors
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {doctors.length} doctor{doctors.length === 1 ? '' : 's'} on staff
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <button onClick={openAddModal} className="btn-primary whitespace-nowrap">
                        <UserPlus className="w-4 h-4" />
                        Add Doctor
                    </button>
                </div>
            </div>

            {/* Doctors card grid */}
            {filteredDoctors.length === 0 ? (
                <div className="card text-center py-16">
                    <Stethoscope className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No doctors found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDoctors.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="card group"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${gradientFor(idx)} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                                >
                                    {getInitials(doc.name)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{doc.name}</h3>
                                    <p className="text-primary-dark dark:text-primary-light text-sm font-medium">
                                        {doc.specialization}
                                    </p>
                                    {doc.department && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.department}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(doc)}
                                        className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteDoctor(doc.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                                {doc.qualification && (
                                    <p className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                                        {doc.qualification}
                                    </p>
                                )}
                                {(doc.experience ?? null) !== null && (
                                    <p className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                                        {doc.experience} years experience
                                    </p>
                                )}
                                {(doc.consultation_fee ?? null) !== null && (
                                    <p className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                                        ${Number(doc.consultation_fee).toFixed(2)} consultation fee
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                    <Star className="w-4 h-4 fill-primary text-primary" />
                                    4.{7 + (idx % 3)}
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        doc.status === 'inactive'
                                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}
                                >
                                    {doc.status === 'inactive' ? 'Inactive' : 'Active'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card w-full max-w-md max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="Dr. Ayaan Ali"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Specialization
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="input-field"
                                        placeholder="Cardiologist"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Qualification
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.qualification}
                                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Consultation Fee ($)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.consultation_fee}
                                            onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="btn-primary w-full justify-center">
                                        {editDoctor ? 'Save Changes' : 'Add Doctor'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary w-full justify-center"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Doctors;

