import { useState, useEffect, useMemo } from 'react';
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
    Wallet,
    CreditCard,
    Receipt,
    CalendarDays,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, billingAPI } from '../services/api';
import PaymentModal from '../components/PaymentModal';

const quickActions = [
    { to: '/patient/book', icon: CalendarPlus, label: 'Book Appointment', desc: 'Find and book a doctor' },
    { to: '/patient/appointments', icon: History, label: 'My Appointments', desc: 'View & manage bookings' },
    { to: '/patient/records', icon: FileText, label: 'Medical Records', desc: 'Visit history & bills' },
    { to: '/patient/billing', icon: Wallet, label: 'Billing & Payments', desc: 'Pay invoices online' },
    { to: '/patient/profile', icon: UserCircle, label: 'My Profile', desc: 'Update your details' },
];

const daysUntil = (dateStr) => {
    const target = new Date(dateStr);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payTarget, setPayTarget] = useState(null);

    const fetchData = async () => {
        try {
            const [apptRes, billsRes] = await Promise.all([appointmentAPI.getAll(), billingAPI.getAll()]);
            setAppointments(apptRes.data);
            setBills(billsRes.data);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const upcoming = appointments.filter((a) => a.status === 'scheduled');
    const pending = appointments.filter((a) => a.status === 'pending');
    const past = appointments.filter((a) => a.status === 'completed');
    const prescriptions = past.filter((a) => a.prescription).length;

    const nextAppointment = useMemo(() => {
        return [...upcoming].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0];
    }, [upcoming]);

    const pendingBills = useMemo(() => bills.filter((b) => b.payment_status === 'pending'), [bills]);
    const outstanding = useMemo(() => pendingBills.reduce((s, b) => s + (b.total_amount || 0), 0), [pendingBills]);
    const nextDueBill = pendingBills[0];

    const statCards = [
        { icon: CalendarCheck, label: 'Upcoming Appointments', value: upcoming.length },
        { icon: Hourglass, label: 'Awaiting Approval', value: pending.length },
        { icon: Clock, label: 'Past Visits', value: past.length },
        { icon: FileText, label: 'Prescriptions', value: prescriptions },
    ];

    const handlePaySuccess = (updatedBill) => {
        setBills((prev) => prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)));
        setPayTarget(null);
    };

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

            {/* Hero row: next appointment + outstanding balance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card">
                    {nextAppointment ? (
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center shrink-0">
                                    <CalendarDays className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Your Next Appointment</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{nextAppointment.doctor_name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {nextAppointment.time}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-2xl font-bold text-primary-dark dark:text-primary-light">
                                    {daysUntil(nextAppointment.date) === 0 ? 'Today' : `${daysUntil(nextAppointment.date)}d`}
                                </p>
                                <Link to="/patient/appointments" className="text-xs text-primary-dark dark:text-primary-light hover:underline">
                                    Manage
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">No upcoming appointments</p>
                                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">Book your next visit</p>
                            </div>
                            <Link to="/patient/book" className="btn-primary text-sm py-2 px-4">
                                <CalendarPlus className="w-4 h-4" /> Book Now
                            </Link>
                        </div>
                    )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="card">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                                <Wallet className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Outstanding Balance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">${outstanding.toFixed(2)}</p>
                                {pendingBills.length > 0 && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {pendingBills.length} invoice{pendingBills.length > 1 ? 's' : ''} pending
                                    </p>
                                )}
                            </div>
                        </div>
                        {nextDueBill ? (
                            <button onClick={() => setPayTarget(nextDueBill)} className="btn-primary text-sm py-2 px-4 shrink-0">
                                <CreditCard className="w-4 h-4" /> Pay Now
                            </button>
                        ) : (
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">All settled ✓</span>
                        )}
                    </div>
                </motion.div>
            </div>

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

            {/* Upcoming Appointments + Billing preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Upcoming Appointments
                        </h2>
                        <Link to="/patient/appointments" className="text-sm text-primary-dark dark:text-primary-light font-medium hover:underline inline-flex items-center gap-1">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="text-center py-10">
                            <CalendarCheck className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming appointments.</p>
                            <Link to="/patient/book" className="btn-primary inline-flex text-sm py-2 px-4">
                                <CalendarPlus className="w-4 h-4" /> Book one now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.slice(0, 3).map((apt) => (
                                <div key={apt.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                            <Stethoscope className="w-4 h-4 text-primary-dark dark:text-primary-light" />
                                        </div>
                                        <p className="font-medium text-gray-900 dark:text-white">{apt.doctor_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{apt.date}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{apt.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Billing</h2>
                        <Link to="/patient/billing" className="text-sm text-primary-dark dark:text-primary-light font-medium hover:underline inline-flex items-center gap-1">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    {bills.length === 0 ? (
                        <div className="text-center py-10">
                            <Receipt className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                            <p className="text-gray-500 dark:text-gray-400">No bills yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bills.slice(0, 3).map((bill) => (
                                <div key={bill.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{bill.invoice_number}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{bill.description || 'Consultation'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">${bill.total_amount.toFixed(2)}</p>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                                                bill.payment_status === 'paid'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}
                                        >
                                            {bill.payment_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {payTarget && (
                <PaymentModal bill={payTarget} onClose={() => setPayTarget(null)} onSuccess={handlePaySuccess} mode="patient" />
            )}
        </div>
    );
};

export default PatientDashboard;
