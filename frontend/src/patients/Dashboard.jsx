import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, FileText, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        upcoming: 0,
        past: 0,
        prescriptions: 0,
        labReports: 0,
    });
    const [upcomingAppts, setUpcomingAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await appointmentAPI.getAll();
                const appointments = res.data;
                const upcoming = appointments.filter(a => a.status === 'scheduled');
                const past = appointments.filter(a => a.status === 'completed');

                setStats({
                    upcoming: upcoming.length,
                    past: past.length,
                    prescriptions: 0,   // will need a prescriptions endpoint later
                    labReports: 0,      // will need a lab reports endpoint later
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
        { icon: Clock, label: 'Past Visits', value: stats.past },
        { icon: FileText, label: 'Prescriptions', value: stats.prescriptions },
        { icon: Activity, label: 'Lab Reports', value: stats.labReports },
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, <span className="text-primary">{user?.username || 'Patient'}</span>
            </h1>

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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Upcoming Appointments
                </h2>
                {upcomingAppts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No upcoming appointments.</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingAppts.map((apt) => (
                            <div
                                key={apt.id}
                                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {apt.doctor_name}
                                    </p>
                                    {/* You can add specialization if available */}
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