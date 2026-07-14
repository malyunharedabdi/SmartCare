import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, UserX, Edit2, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { patientAPI } from '../services/api';

const emptyForm = {
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    blood_group: '',
    emergency_contact: '',
};

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editPatient, setEditPatient] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchPatients = async () => {
        try {
            const res = await patientAPI.getAll();
            setPatients(res.data);
        } catch (err) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.phone || '').includes(search)
    );

    const openAddModal = () => {
        setEditPatient(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (patient) => {
        setEditPatient(patient);
        setFormData({
            name: patient.name || '',
            age: patient.age ?? '',
            gender: patient.gender || 'Male',
            phone: patient.phone || '',
            email: patient.email || '',
            address: patient.address || '',
            blood_group: patient.blood_group || '',
            emergency_contact: patient.emergency_contact || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.age || !formData.gender) {
            toast.error('Name, age and gender are required');
            return;
        }

        const payload = { ...formData, age: Number(formData.age) };

        try {
            if (editPatient) {
                await patientAPI.update(editPatient.id, payload);
                toast.success('Patient updated');
            } else {
                await patientAPI.create(payload);
                toast.success('Patient added');
            }
            setShowModal(false);
            fetchPatients();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save patient');
        }
    };

    const deletePatient = async (id) => {
        if (!window.confirm('Delete this patient? This also removes their appointments and bills.')) return;
        try {
            await patientAPI.delete(id);
            toast.success('Patient deleted');
            fetchPatients();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete patient');
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Manage Patients
                </h1>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <button onClick={openAddModal} className="btn-primary whitespace-nowrap">
                        <UserPlus className="w-4 h-4" />
                        Add Patient
                    </button>
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="py-3 pr-4">Name</th>
                            <th className="py-3 pr-4">Age</th>
                            <th className="py-3 pr-4">Gender</th>
                            <th className="py-3 pr-4">Phone</th>
                            <th className="py-3 pr-4">Email</th>
                            <th className="py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    <UserX className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                    No patients found
                                </td>
                            </tr>
                        )}
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">{patient.name}</td>
                                <td className="py-3 pr-4">{patient.age}</td>
                                <td className="py-3 pr-4">{patient.gender}</td>
                                <td className="py-3 pr-4">{patient.phone || '—'}</td>
                                <td className="py-3 pr-4">{patient.email || '—'}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(patient)}
                                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deletePatient(patient.id)}
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
                                    {editPatient ? 'Edit Patient' : 'Add New Patient'}
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
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Gender
                                        </label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Blood Group
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.blood_group}
                                            onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                                            className="input-field"
                                            placeholder="O+"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Emergency Contact
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergency_contact}
                                            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="btn-primary w-full justify-center">
                                        {editPatient ? 'Save Changes' : 'Add Patient'}
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

export default Patients;
