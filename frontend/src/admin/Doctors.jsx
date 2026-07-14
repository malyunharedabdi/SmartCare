import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, UserPlus, X } from 'lucide-react';
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Manage Doctors
                </h1>
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

            {/* Doctors table */}
            <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="py-3 pr-4">Name</th>
                            <th className="py-3 pr-4">Specialization</th>
                            <th className="py-3 pr-4">Email</th>
                            <th className="py-3 pr-4">Phone</th>
                            <th className="py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDoctors.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No doctors found
                                </td>
                            </tr>
                        )}
                        {filteredDoctors.map((doc) => (
                            <tr
                                key={doc.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
                                    {doc.name}
                                </td>
                                <td className="py-3 pr-4">{doc.specialization}</td>
                                <td className="py-3 pr-4">{doc.email}</td>
                                <td className="py-3 pr-4">{doc.phone}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(doc)}
                                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteDoctor(doc.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
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
