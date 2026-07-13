import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Edit3, Calendar } from 'lucide-react';

const initialAppointments = [
    {
        id: 1,
        patient: 'Ayaan Ali',
        doctor: 'Dr. Fatima Nur',
        date: '2025-01-12',
        time: '10:00 AM',
        status: 'pending',
    },
    {
        id: 2,
        patient: 'Mohamed Hassan',
        doctor: 'Dr. Ayaan Ali',
        date: '2025-01-12',
        time: '11:00 AM',
        status: 'confirmed',
    },
    {
        id: 3,
        patient: 'Halima Yusuf',
        doctor: 'Dr. Omar Abdi',
        date: '2025-01-12',
        time: '2:30 PM',
        status: 'cancelled',
    },
    {
        id: 4,
        patient: 'Ahmed Abdullahi',
        doctor: 'Dr. Mohamed Hassan',
        date: '2025-01-13',
        time: '9:00 AM',
        status: 'pending',
    },
    {
        id: 5,
        patient: 'Fatima Nur',
        doctor: 'Dr. Ahmed Abdullahi',
        date: '2025-01-14',
        time: '3:00 PM',
        status: 'confirmed',
    },
];

const Appointments = () => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [rescheduleId, setRescheduleId] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const filtered = appointments.filter((apt) => {
        const matchesSearch =
            apt.patient.toLowerCase().includes(search.toLowerCase()) ||
            apt.doctor.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = (id, status) => {
        setAppointments(appointments.map((a) => (a.id === id ? { ...a, status } : a)));
    };

    const startReschedule = (apt) => {
        setRescheduleId(apt.id);
        setNewDate(apt.date);
        setNewTime(apt.time);
    };

    const saveReschedule = () => {
        setAppointments(
            appointments.map((a) =>
                a.id === rescheduleId
                    ? { ...a, date: newDate, time: newTime, status: 'confirmed' }
                    : a
            )
        );
        setRescheduleId(null);
    };

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
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

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
                                    {apt.patient}
                                </td>
                                <td className="py-3 pr-4">{apt.doctor}</td>
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
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${apt.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : apt.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                    >
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-1">
                                        {apt.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'confirmed')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'cancelled')}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Deny"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        {apt.status !== 'cancelled' && (
                                            <button
                                                onClick={() => startReschedule(apt)}
                                                className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                                title="Reschedule"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                        )}
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