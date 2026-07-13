import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Edit3, ChevronDown } from 'lucide-react';

const initialAppointments = [
    {
        id: 1,
        doctor: 'Dr. Fatima Nur',
        specialization: 'Pediatrics',
        date: '2025-01-12',
        time: '10:00 AM',
        status: 'confirmed',
    },
    {
        id: 2,
        doctor: 'Dr. Mohamed Hassan',
        specialization: 'Neurology',
        date: '2025-01-15',
        time: '2:30 PM',
        status: 'confirmed',
    },
    {
        id: 3,
        doctor: 'Dr. Ayaan Ali',
        specialization: 'Cardiology',
        date: '2025-02-02',
        time: '9:00 AM',
        status: 'pending',
    },
];

const Appointments = () => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [rescheduleId, setRescheduleId] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const cancelAppointment = (id) => {
        setAppointments(appointments.filter((a) => a.id !== id));
    };

    const startReschedule = (apt) => {
        setRescheduleId(apt.id);
        setNewDate(apt.date);
        setNewTime(apt.time);
    };

    const saveReschedule = () => {
        setAppointments(
            appointments.map((a) =>
                a.id === rescheduleId ? { ...a, date: newDate, time: newTime, status: 'confirmed' } : a
            )
        );
        setRescheduleId(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Appointments
            </h1>

            <div className="grid gap-4">
                {appointments.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                        No appointments yet.
                    </p>
                )}
                {appointments.map((apt) => (
                    <motion.div
                        key={apt.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {apt.doctor}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {apt.specialization}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-sm">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {new Date(apt.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                        <Clock className="w-4 h-4" /> {apt.time}
                                    </span>
                                </div>
                                <span
                                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${apt.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}
                                >
                                    {apt.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                                onClick={() => startReschedule(apt)}
                                className="p-2 text-gray-500 hover:text-primary transition-colors"
                                title="Reschedule"
                            >
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => cancelAppointment(apt.id)}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                title="Cancel"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Inline reschedule form */}
                        <AnimatePresence>
                            {rescheduleId === apt.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="w-full overflow-hidden"
                                >
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-2 flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="date"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="input-field"
                                        />
                                        <input
                                            type="time"
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            className="input-field"
                                        />
                                        <button onClick={saveReschedule} className="btn-primary whitespace-nowrap">
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setRescheduleId(null)}
                                            className="btn-secondary whitespace-nowrap"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Appointments;