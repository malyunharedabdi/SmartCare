import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    CalendarCheck,
    DollarSign,
    TrendingUp,
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

// Mock data for charts
const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4780 },
    { month: 'May', revenue: 5890 },
    { month: 'Jun', revenue: 4390 },
    { month: 'Jul', revenue: 6000 },
];

const stats = [
    { icon: Users, label: 'Total Patients', value: '1,248', change: '+12%' },
    { icon: UserPlus, label: 'Total Doctors', value: '42', change: '+3%' },
    { icon: CalendarCheck, label: 'Appointments', value: '156', change: '+8%' },
    { icon: DollarSign, label: 'Revenue', value: '$48,290', change: '+15%' },
];

const recentAppointments = [
    { id: 1, patient: 'Ayaan Ali', doctor: 'Dr. Fatima Nur', date: '2025-01-12', time: '10:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Mohamed Hassan', doctor: 'Dr. Ayaan Ali', date: '2025-01-12', time: '11:00 AM', status: 'pending' },
    { id: 3, patient: 'Halima Yusuf', doctor: 'Dr. Omar Abdi', date: '2025-01-12', time: '2:30 PM', status: 'cancelled' },
    { id: 4, patient: 'Ahmed Abdullahi', doctor: 'Dr. Mohamed Hassan', date: '2025-01-13', time: '9:00 AM', status: 'confirmed' },
];

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
            </h1>

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
                            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                                {s.change}
                            </span>
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
                            {recentAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-3 pr-4 text-gray-900 dark:text-white">{apt.patient}</td>
                                    <td className="py-3 pr-4">{apt.doctor}</td>
                                    <td className="py-3 pr-4">{apt.date}</td>
                                    <td className="py-3 pr-4">{apt.time}</td>
                                    <td className="py-3">
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