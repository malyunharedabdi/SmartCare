import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    Users,
    UserPlus,
    CalendarCheck,
    DollarSign,
    UserCog,
    ClipboardList,
    LineChart,
    ArrowRight,
    LayoutGrid,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { patientAPI, doctorAPI, appointmentAPI, billingAPI } from '../services/api';

const quickActions = [
    { to: '/admin/appointments', icon: ClipboardList, label: 'Appointments', desc: 'Approve, reject & manage' },
    { to: '/admin/doctors', icon: UserCog, label: 'Doctors', desc: 'Manage medical staff' },
    { to: '/admin/patients', icon: Users, label: 'Patients', desc: 'View & manage patients' },
    { to: '/admin/analytics', icon: LineChart, label: 'Analytics', desc: 'Reports & insights' },
];

const statusStyle = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0, revenue: 0 });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes, appointmentsRes, billsRes] = await Promise.all([
                    patientAPI.getAll(),
                    doctorAPI.getAll(),
                    appointmentAPI.getAll(),
                    billingAPI.getAll(),
                ]);

                const appointments = appointmentsRes.data;
                const bills = billsRes.data;

                const totalRevenue = bills
                    .filter((b) => b.payment_status === 'paid')
                    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

                setCounts({
                    patients: patientsRes.data.length,
                    doctors: doctorsRes.data.length,
                    appointments: appointments.length,
                    revenue: totalRevenue,
                });

                const sorted = [...appointments].sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setRecentAppointments(sorted.slice(0, 5));

                // Group paid bill revenue by month for the chart
                const byMonth = {};
                bills
                    .filter((b) => b.payment_status === 'paid' && b.payment_date)
                    .forEach((b) => {
                        const month = new Date(b.payment_date).toLocaleString('en-US', { month: 'short' });
                        byMonth[month] = (byMonth[month] || 0) + (b.total_amount || 0);
                    });
                setRevenueData(Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue })));
            } catch (err) {
                console.error('Failed to load admin dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { icon: Users, label: 'Total Patients', value: counts.patients },
        { icon: UserPlus, label: 'Total Doctors', value: counts.doctors },
        { icon: CalendarCheck, label: 'Appointments', value: counts.appointments },
        { icon: DollarSign, label: 'Revenue', value: `$${counts.revenue.toFixed(2)}` },
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
                    <LayoutGrid className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
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
                {stats.map((s, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <s.icon className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                            {s.value}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Revenue chart */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Revenue Overview
                </h2>
                {revenueData.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No paid bills yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0096C7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0096C7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0096C7"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Recent Appointments */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Appointments
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="py-3 pr-4">Patient</th>
                                <th className="py-3 pr-4">Doctor</th>
                                <th className="py-3 pr-4">Date</th>
                                <th className="py-3 pr-4">Time</th>
                                <th className="py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-gray-500">
                                        No appointments yet
                                    </td>
                                </tr>
                            )}
                            {recentAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-3 pr-4 text-gray-900 dark:text-white">{apt.patient_name}</td>
                                    <td className="py-3 pr-4">{apt.doctor_name}</td>
                                    <td className="py-3 pr-4">{apt.date}</td>
                                    <td className="py-3 pr-4">{apt.time}</td>
                                    <td className="py-3">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status] || statusStyle.scheduled
                                                }`}
                                        >
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
