import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    CalendarCheck,
    Clock,
    FileText,
    Hourglass,
    CalendarPlus,
    History,
    UserCircle,
    Stethoscope,
    ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';

const quickActions = [
    { to: '/patient/book', icon: CalendarPlus, label: 'Book Appointment', desc: 'Find and book a doctor' },
    { to: '/patient/appointments', icon: History, label: 'My Appointments', desc: 'View & manage bookings' },
    { to: '/patient/records', icon: FileText, label: 'Medical Records', desc: 'Visit history & bills' },
    { to: '/patient/profile', icon: UserCircle, label: 'My Profile', desc: 'Update your details' },
];

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        upcoming: 0,
        pending: 0,
        past: 0,
        prescriptions: 0,
    });
    const [upcomingAppts, setUpcomingAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await appointmentAPI.getAll();
                const appointments = res.data;
                const upcoming = appointments.filter(a => a.status === 'scheduled');
                const pending = appointments.filter(a => a.status === 'pending');
                const past = appointments.filter(a => a.status === 'completed');
                const prescriptions = past.filter(a => a.prescription).length;

                setStats({
                    upcoming: upcoming.length,
                    pending: pending.length,
                    past: past.length,
                    prescriptions,
                });
                setUpcomingAppts(upcoming.slice(0, 3)); // show max 3 upcoming
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { icon: CalendarCheck, label: 'Upcoming Appointments', value: stats.upcoming },
        { icon: Hourglass, label: 'Awaiting Approval', value: stats.pending },
        { icon: Clock, label: 'Past Visits', value: stats.past },
        { icon: FileText, label: 'Prescriptions', value: stats.prescriptions },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, <span className="text-primary-dark dark:text-primary-light">{user?.username || 'Patient'}</span>
                </h1>
            </div>

            {/* Quick actions bento */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((a, idx) => (
                    <motion.div
                        key={a.to}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                    >
                        <Link to={a.to} className="card flex flex-col gap-2 h-full group">
                            <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                                <a.icon className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{a.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{a.desc}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <s.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Upcoming Appointments
                    </h2>
                    <Link to="/patient/appointments" className="text-sm text-primary-dark dark:text-primary-light font-medium hover:underline inline-flex items-center gap-1">
                        View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                {upcomingAppts.length === 0 ? (
                    <div className="text-center py-10">
                        <CalendarCheck className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming appointments.</p>
                        <Link to="/patient/book" className="btn-primary inline-flex text-sm py-2 px-4">
                            <CalendarPlus className="w-4 h-4" /> Book one now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingAppts.map((apt) => (
                            <div
                                key={apt.id}
                                className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Stethoscope className="w-4 h-4 text-primary-dark dark:text-primary-light" />
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {apt.doctor_name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {apt.date}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
