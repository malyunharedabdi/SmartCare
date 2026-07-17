import { useState, useEffect, useMemo } from 'react';
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
    Receipt as ReceiptIcon,
    LayoutGrid,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Percent,
    Wallet,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';
import { patientAPI, doctorAPI, appointmentAPI, billingAPI } from '../services/api';

const quickActions = [
    { to: '/admin/appointments', icon: ClipboardList, label: 'Appointments', desc: 'Approve, reject & manage' },
    { to: '/admin/doctors', icon: UserCog, label: 'Doctors', desc: 'Manage medical staff' },
    { to: '/admin/patients', icon: Users, label: 'Patients', desc: 'View & manage patients' },
    { to: '/admin/payments', icon: ReceiptIcon, label: 'Payments', desc: 'Track invoices & revenue' },
    { to: '/admin/analytics', icon: LineChart, label: 'Analytics', desc: 'Reports & insights' },
];

const statusStyle = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const DONUT_COLORS = ['#3b82f6', '#eab308', '#22c55e', '#ef4444', '#a855f7'];
const RANGE_OPTIONS = [
    { id: 7, label: '7D' },
    { id: 30, label: '30D' },
    { id: 90, label: '90D' },
    { id: 365, label: '1Y' },
];

const withinDays = (dateStr, days) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return date >= cutoff;
};

const TrendBadge = ({ current, previous }) => {
    if (previous === 0 && current === 0) return null;
    const pct = previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);
    const isUp = pct >= 0;
    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(pct)}%
        </span>
    );
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [bills, setBills] = useState([]);
    const [range, setRange] = useState(30);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes, appointmentsRes, billsRes] = await Promise.all([
                    patientAPI.getAll(),
                    doctorAPI.getAll(),
                    appointmentAPI.getAll(),
                    billingAPI.getAll(),
                ]);
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
                setAppointments(appointmentsRes.data);
                setBills(billsRes.data);
            } catch (err) {
                console.error('Failed to load admin dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const paidBills = useMemo(() => bills.filter((b) => b.payment_status === 'paid'), [bills]);
    const pendingBills = useMemo(() => bills.filter((b) => b.payment_status === 'pending'), [bills]);
    const totalRevenue = useMemo(() => paidBills.reduce((sum, b) => sum + (b.total_amount || 0), 0), [paidBills]);
    const outstanding = useMemo(() => pendingBills.reduce((sum, b) => sum + (b.total_amount || 0), 0), [pendingBills]);

    const completionRate = appointments.length
        ? Math.round((appointments.filter((a) => a.status === 'completed').length / appointments.length) * 100)
        : 0;

    // --- Trends: this-30-days vs previous-30-days ---
    const trend = (list, dateField) => {
        const current = list.filter((x) => withinDays(x[dateField], 30)).length;
        const prevWindow = list.filter((x) => {
            const d = new Date(x[dateField]);
            const start = new Date();
            start.setDate(start.getDate() - 60);
            const end = new Date();
            end.setDate(end.getDate() - 30);
            return d >= start && d < end;
        }).length;
        return { current, previous: prevWindow };
    };

    const patientTrend = trend(patients, 'created_at');
    const apptTrend = trend(appointments, 'created_at');
    const revenueTrend = {
        current: paidBills.filter((b) => withinDays(b.payment_date, 30)).reduce((s, b) => s + (b.total_amount || 0), 0),
        previous: paidBills
            .filter((b) => {
                const d = new Date(b.payment_date);
                const start = new Date();
                start.setDate(start.getDate() - 60);
                const end = new Date();
                end.setDate(end.getDate() - 30);
                return d >= start && d < end;
            })
            .reduce((s, b) => s + (b.total_amount || 0), 0),
    };

    const stats = [
        { icon: Users, label: 'Total Patients', value: patients.length, trend: patientTrend },
        { icon: UserPlus, label: 'Total Doctors', value: doctors.length },
        { icon: CalendarCheck, label: 'Appointments', value: appointments.length, trend: apptTrend },
        { icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: revenueTrend },
        { icon: Wallet, label: 'Outstanding', value: `$${outstanding.toFixed(2)}` },
        { icon: Percent, label: 'Completion Rate', value: `${completionRate}%` },
    ];

    // --- Revenue chart, filtered by selected range, grouped by day (<=30d) or month ---
    const revenueData = useMemo(() => {
        const inRange = paidBills.filter((b) => b.payment_date && withinDays(b.payment_date, range));
        const groups = {};
        inRange.forEach((b) => {
            const d = new Date(b.payment_date);
            const key = range <= 30 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.toLocaleString('en-US', { month: 'short' });
            groups[key] = (groups[key] || 0) + (b.total_amount || 0);
        });
        return Object.entries(groups).map(([label, revenue]) => ({ label, revenue }));
    }, [paidBills, range]);

    // --- Appointment status breakdown ---
    const statusBreakdown = useMemo(() => {
        const counts = {};
        appointments.forEach((a) => {
            counts[a.status] = (counts[a.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [appointments]);

    // --- Doctor utilization (top 5 by appointment count) ---
    const doctorUtilization = useMemo(() => {
        const counts = {};
        appointments.forEach((a) => {
            if (a.doctor_name) counts[a.doctor_name] = (counts[a.doctor_name] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, appointments]) => ({ name, appointments }))
            .sort((a, b) => b.appointments - a.appointments)
            .slice(0, 5);
    }, [appointments]);

    const recentAppointments = useMemo(
        () => [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
        [appointments]
    );
    const recentPayments = useMemo(
        () => [...paidBills].sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date)).slice(0, 5),
        [paidBills]
    );

    const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

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

            {/* Alerts */}
            {(pendingAppointments > 0 || pendingBills.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pendingAppointments > 0 && (
                        <Link to="/admin/appointments" className="card flex items-center gap-3 border-l-4 border-l-blue-500">
                            <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{pendingAppointments}</strong> appointment{pendingAppointments > 1 ? 's' : ''} awaiting approval
                            </p>
                        </Link>
                    )}
                    {pendingBills.length > 0 && (
                        <Link to="/admin/payments" className="card flex items-center gap-3 border-l-4 border-l-amber-500">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{pendingBills.length}</strong> unpaid invoice{pendingBills.length > 1 ? 's' : ''} (${outstanding.toFixed(2)})
                            </p>
                        </Link>
                    )}
                </div>
            )}

            {/* Quick actions bento */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
                            {s.trend && <TrendBadge current={s.trend.current} previous={s.trend.previous} />}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                            {s.value}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Revenue + Status breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Revenue Overview
                        </h2>
                        <div className="flex gap-1">
                            {RANGE_OPTIONS.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setRange(r.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                        range === r.id ? 'bg-primary text-white' : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-primary/10'
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {revenueData.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No paid bills in this range.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6bbf4a" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#6bbf4a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                                <Area type="monotone" dataKey="revenue" stroke="#4f9e33" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Appointment Status
                    </h2>
                    {statusBreakdown.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No appointments yet.</p>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                                        {statusBreakdown.map((entry, i) => (
                                            <Cell key={entry.name} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
                                {statusBreakdown.map((entry, i) => (
                                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 capitalize">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                                        {entry.name} ({entry.value})
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Doctor utilization */}
            {doctorUtilization.length > 0 && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Doctor Utilization (Top 5)
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={doctorUtilization} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                            <XAxis type="number" stroke="#6b7280" fontSize={12} allowDecimals={false} />
                            <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={140} />
                            <Tooltip />
                            <Bar dataKey="appointments" fill="#6bbf4a" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Recent Appointments + Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    <th className="py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAppointments.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-500">
                                            No appointments yet
                                        </td>
                                    </tr>
                                )}
                                {recentAppointments.map((apt) => (
                                    <tr key={apt.id} className="border-b border-gray-100 dark:border-gray-800">
                                        <td className="py-3 pr-4 text-gray-900 dark:text-white">{apt.patient_name}</td>
                                        <td className="py-3 pr-4">{apt.doctor_name}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status] || statusStyle.scheduled}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
                        <Link to="/admin/payments" className="text-sm text-primary-dark dark:text-primary-light font-medium hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentPayments.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">No payments yet.</p>}
                        {recentPayments.map((bill) => (
                            <div key={bill.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{bill.patient_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{bill.invoice_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${bill.total_amount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{bill.payment_method}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
