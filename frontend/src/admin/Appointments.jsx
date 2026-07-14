import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentAPI } from '../services/api';

const statusStyle = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [rescheduleId, setRescheduleId] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const fetchAppointments = async () => {
        try {
            const res = await appointmentAPI.getAll();
            setAppointments(res.data);
        } catch (err) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const pending = appointments.filter((a) => a.status === 'pending');

    const filtered = appointments.filter((apt) => {
        const matchesSearch =
            (apt.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (apt.doctor_name || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id, status, successMsg) => {
        try {
            await appointmentAPI.updateStatus(id, status);
            toast.success(successMsg);
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update status');
        }
    };

    const deleteAppointment = async (id) => {
        if (!window.confirm('Permanently delete this appointment? This cannot be undone.')) return;
        try {
            await appointmentAPI.delete(id);
            toast.success('Appointment deleted');
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete');
        }
    };

    const startReschedule = (apt) => {
        setRescheduleId(apt.id);
        setNewDate(apt.date);
        setNewTime(apt.time);
    };

    const saveReschedule = async () => {
        try {
            await appointmentAPI.reschedule(rescheduleId, { date: newDate, time: newTime });
            toast.success('Rescheduled');
            setRescheduleId(null);
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to reschedule');
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
                    Manage Appointments
                </h1>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patient or doctor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Pending approval queue */}
            {pending.length > 0 && (
                <div className="card border-l-4 border-blue-500">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Awaiting Approval ({pending.length})
                    </h2>
                    <div className="space-y-3">
                        {pending.map((apt) => (
                            <div
                                key={apt.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {apt.patient_name} <span className="text-gray-400">→</span> {apt.doctor_name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {apt.time}
                                        {apt.symptoms ? ` • ${apt.symptoms}` : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateStatus(apt.id, 'scheduled', 'Appointment approved')}
                                        className="btn-primary text-xs py-1.5 px-3"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(apt.id, 'rejected', 'Appointment rejected')}
                                        className="btn-secondary text-xs py-1.5 px-3 text-red-600"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="py-3 pr-4">Patient</th>
                            <th className="py-3 pr-4">Doctor</th>
                            <th className="py-3 pr-4">Date</th>
                            <th className="py-3 pr-4">Time</th>
                            <th className="py-3 pr-4">Status</th>
                            <th className="py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    No appointments found
                                </td>
                            </tr>
                        )}
                        {filtered.map((apt) => (
                            <tr
                                key={apt.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
                                    {apt.patient_name}
                                </td>
                                <td className="py-3 pr-4">{apt.doctor_name}</td>
                                <td className="py-3 pr-4">
                                    {new Date(apt.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="py-3 pr-4">{apt.time}</td>
                                <td className="py-3 pr-4">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status] || statusStyle.pending
                                            }`}
                                    >
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-1">
                                        {apt.status === 'scheduled' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'completed', 'Marked as completed')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Mark completed"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'cancelled', 'Appointment cancelled')}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Cancel"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => startReschedule(apt)}
                                                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                                    title="Reschedule"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => deleteAppointment(apt.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Inline reschedule */}
                                    <AnimatePresence>
                                        {rescheduleId === apt.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                                                    <input
                                                        type="date"
                                                        value={newDate}
                                                        onChange={(e) => setNewDate(e.target.value)}
                                                        className="input-field text-sm"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={newTime}
                                                        onChange={(e) => setNewTime(e.target.value)}
                                                        className="input-field text-sm"
                                                    />
                                                    <button onClick={saveReschedule} className="btn-primary text-sm py-1.5">
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setRescheduleId(null)}
                                                        className="btn-secondary text-sm py-1.5"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Appointments;
