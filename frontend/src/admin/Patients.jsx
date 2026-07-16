import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Trash2,
    UserX,
    Edit2,
    UserPlus,
    X,
    Droplet,
    Phone,
    Mail,
    CalendarClock,
    Receipt,
    ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { patientAPI, appointmentAPI, billingAPI } from '../services/api';

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

const statusStyle = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editPatient, setEditPatient] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    // Billing drawer state
    const [billingPatient, setBillingPatient] = useState(null);
    const [bills, setBills] = useState([]);
    const [billsLoading, setBillsLoading] = useState(false);

    const fetchAll = async () => {
        try {
            const [patientsRes, apptRes] = await Promise.all([
                patientAPI.getAll(),
                appointmentAPI.getAll(),
            ]);
            setPatients(patientsRes.data);
            setAppointments(apptRes.data);
        } catch (err) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Group recent visits per patient, most recent first, capped to 3
    const visitsByPatient = useMemo(() => {
        const map = {};
        [...appointments]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach((apt) => {
                if (!map[apt.patient_id]) map[apt.patient_id] = [];
                if (map[apt.patient_id].length < 3) map[apt.patient_id].push(apt);
            });
        return map;
    }, [appointments]);

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
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save patient');
        }
    };

    const deletePatient = async (id) => {
        if (!window.confirm('Delete this patient? This also removes their appointments and bills.')) return;
        try {
            await patientAPI.delete(id);
            toast.success('Patient deleted');
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete patient');
        }
    };

    const openBilling = async (patient) => {
        setBillingPatient(patient);
        setBillsLoading(true);
        try {
            const res = await billingAPI.getAll({ patient_id: patient.id });
            setBills(res.data);
        } catch (err) {
            toast.error('Failed to load billing history');
        } finally {
            setBillsLoading(false);
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
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Manage Patients
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {patients.length} patient{patients.length === 1 ? '' : 's'} on record
                    </p>
                </div>
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

            {/* Patient chart cards */}
            {filteredPatients.length === 0 ? (
                <div className="card text-center py-16">
                    <UserX className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No patients found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPatients.map((patient, idx) => {
                        const visits = visitsByPatient[patient.id] || [];
                        return (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="card group flex flex-col"
                            >
                                {/* Chart header */}
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/15 flex items-center justify-center text-primary-dark dark:text-primary-light font-bold text-lg">
                                        {getInitials(patient.name)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{patient.name}</h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            <span>{patient.age} yrs</span>
                                            <span>•</span>
                                            <span>{patient.gender}</span>
                                            {patient.blood_group && (
                                                <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-medium">
                                                    <Droplet className="w-3 h-3" /> {patient.blood_group}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(patient)}
                                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deletePatient(patient.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    {patient.phone && (
                                        <p className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {patient.phone}
                                        </p>
                                    )}
                                    {patient.email && (
                                        <p className="flex items-center gap-2 truncate">
                                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {patient.email}
                                        </p>
                                    )}
                                </div>

                                {/* Recent visits mini-timeline */}
                                <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 flex-1">
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                                        <CalendarClock className="w-3.5 h-3.5" /> Recent Visits
                                    </h4>
                                    {visits.length === 0 ? (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">No visits yet</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {visits.map((v) => (
                                                <div key={v.id} className="flex items-center justify-between text-xs">
                                                    <div className="min-w-0">
                                                        <p className="text-gray-900 dark:text-white font-medium truncate">{v.doctor_name}</p>
                                                        <p className="text-gray-400 dark:text-gray-500">{v.date}</p>
                                                    </div>
                                                    <span
                                                        className={`shrink-0 px-2 py-0.5 rounded-full font-medium ${statusStyle[v.status] || statusStyle.scheduled}`}
                                                    >
                                                        {v.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Billing link */}
                                <button
                                    onClick={() => openBilling(patient)}
                                    className="mt-4 w-full inline-flex items-center justify-between text-sm font-medium text-primary-dark dark:text-primary-light border border-primary/30 rounded-xl py-2 px-3 hover:bg-primary/10 transition-colors"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Receipt className="w-4 h-4" /> Billing history
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
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

            {/* Billing history drawer */}
            <AnimatePresence>
                {billingPatient && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setBillingPatient(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card w-full max-w-lg max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Billing History
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{billingPatient.name}</p>
                                </div>
                                <button
                                    onClick={() => setBillingPatient(null)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {billsLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : bills.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-10">No bills for this patient yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {bills.map((bill) => (
                                        <div
                                            key={bill.id}
                                            className="flex items-center justify-between border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-3"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{bill.invoice_number}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {bill.description || 'Consultation'} • ${bill.total_amount?.toFixed(2)}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                    bill.payment_status === 'paid'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}
                                            >
                                                {bill.payment_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Patients;

