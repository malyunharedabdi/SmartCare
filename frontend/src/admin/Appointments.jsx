import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    CheckCircle2,
    XCircle,
    CalendarClock,
    Trash2,
    X,
    DollarSign,
    CreditCard,
    Wallet,
    Receipt,
    ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentAPI, doctorAPI, billingAPI } from '../services/api';

const statusStyle = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Approve → payment modal
    const [approveTarget, setApproveTarget] = useState(null);
    const [paymentChoice, setPaymentChoice] = useState('paid'); // 'paid' | 'pending'
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amount, setAmount] = useState('');
    const [approving, setApproving] = useState(false);

    // Reschedule modal
    const [rescheduleTarget, setRescheduleTarget] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [rescheduling, setRescheduling] = useState(false);

    const fetchAll = async () => {
        try {
            const [apptRes, docRes] = await Promise.all([appointmentAPI.getAll(), doctorAPI.getAll()]);
            setAppointments(apptRes.data);
            setDoctors(docRes.data);
        } catch (err) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const pending = appointments.filter((a) => a.status === 'pending');

    const filtered = appointments.filter((apt) => {
        const matchesSearch =
            (apt.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (apt.doctor_name || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    /* ---------- Approve flow ---------- */
    const openApproveModal = (apt) => {
        const doctor = doctors.find((d) => d.id === apt.doctor_id);
        setApproveTarget(apt);
        setPaymentChoice('paid');
        setPaymentMethod('cash');
        setAmount(doctor?.consultation_fee ? String(doctor.consultation_fee) : '');
    };

    const confirmApprove = async () => {
        setApproving(true);
        try {
            await appointmentAPI.updateStatus(approveTarget.id, 'scheduled');

            const feeAmount = Number(amount) || 0;
            if (feeAmount > 0) {
                const billRes = await billingAPI.create({
                    patient_id: approveTarget.patient_id,
                    appointment_id: approveTarget.id,
                    amount: feeAmount,
                    description: `Consultation with ${approveTarget.doctor_name}`,
                    payment_method: paymentChoice === 'paid' ? paymentMethod : undefined,
                });
                if (paymentChoice === 'paid') {
                    await billingAPI.pay(billRes.data.bill.id, paymentMethod);
                }
            }

            toast.success('Appointment approved');
            setApproveTarget(null);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to approve');
        } finally {
            setApproving(false);
        }
    };

    /* ---------- Reject / complete / cancel / delete ---------- */
    const updateStatus = async (id, status, successMsg) => {
        try {
            await appointmentAPI.updateStatus(id, status);
            toast.success(successMsg);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update status');
        }
    };

    const deleteAppointment = async (id) => {
        if (!window.confirm('Permanently delete this appointment? This cannot be undone.')) return;
        try {
            await appointmentAPI.delete(id);
            toast.success('Appointment deleted');
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete');
        }
    };

    /* ---------- Reschedule flow ---------- */
    const openRescheduleModal = (apt) => {
        setRescheduleTarget(apt);
        setNewDate(apt.date);
        setNewTime(apt.time);
    };

    const confirmReschedule = async (e) => {
        e.preventDefault();
        setRescheduling(true);
        try {
            await appointmentAPI.reschedule(rescheduleTarget.id, { date: newDate, time: newTime });
            toast.success('Appointment rescheduled');
            setRescheduleTarget(null);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to reschedule');
        } finally {
            setRescheduling(false);
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
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field w-40 appearance-none pr-9"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Pending approval queue — the main focus area */}
            {pending.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        Awaiting Approval
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            {pending.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pending.map((apt) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card border-l-4 border-blue-400 dark:border-blue-500"
                            >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{apt.patient_name}</p>
                                        <p className="text-sm text-primary-dark dark:text-primary-light">{apt.doctor_name}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.pending}`}>
                                        pending
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {apt.time}
                                </p>
                                {apt.symptoms && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{apt.symptoms}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => openApproveModal(apt)}
                                        className="btn-primary text-sm py-2 px-4"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(apt.id, 'rejected', 'Appointment rejected')}
                                        className="btn-secondary text-sm py-2 px-4 text-red-600 dark:text-red-400"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Full appointments table */}
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
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {apt.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => openApproveModal(apt)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'rejected', 'Appointment rejected')}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                                </button>
                                            </>
                                        )}
                                        {apt.status === 'scheduled' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'completed', 'Marked as completed')}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt.id, 'cancelled', 'Appointment cancelled')}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Cancel
                                                </button>
                                                <button
                                                    onClick={() => openRescheduleModal(apt)}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-dark dark:text-primary-light bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <CalendarClock className="w-3.5 h-3.5" /> Reschedule
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => deleteAppointment(apt.id)}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ═══════════ APPROVE + PAYMENT MODAL ═══════════ */}
            <AnimatePresence>
                {approveTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setApproveTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            className="card w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center">
                                        <Receipt className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Approve & Bill</h2>
                                </div>
                                <button onClick={() => setApproveTarget(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Approving <span className="font-medium text-gray-900 dark:text-white">{approveTarget.patient_name}</span>'s
                                appointment with <span className="font-medium text-gray-900 dark:text-white">{approveTarget.doctor_name}</span>.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Consultation fee
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="input-field pl-9"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Leave at 0 to skip creating a bill.</p>
                                </div>

                                {Number(amount) > 0 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Has the patient paid?
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentChoice('paid')}
                                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${paymentChoice === 'paid'
                                                            ? 'bg-primary/15 border-primary text-primary-dark dark:text-primary-light'
                                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Paid now
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentChoice('pending')}
                                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${paymentChoice === 'pending'
                                                            ? 'bg-primary/15 border-primary text-primary-dark dark:text-primary-light'
                                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <Wallet className="w-4 h-4" /> Bill later
                                                </button>
                                            </div>
                                        </div>

                                        {paymentChoice === 'paid' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Payment method
                                                </label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <select
                                                        value={paymentMethod}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="input-field pl-9 appearance-none"
                                                    >
                                                        <option value="cash">Cash</option>
                                                        <option value="card">Card</option>
                                                        <option value="insurance">Insurance</option>
                                                        <option value="mobile_money">Mobile Money</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={confirmApprove}
                                    disabled={approving}
                                    className="btn-primary w-full justify-center disabled:opacity-60"
                                >
                                    {approving ? 'Approving...' : 'Confirm Approval'}
                                </button>
                                <button onClick={() => setApproveTarget(null)} className="btn-secondary w-full justify-center">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ RESCHEDULE MODAL ═══════════ */}
            <AnimatePresence>
                {rescheduleTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setRescheduleTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            className="card w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center">
                                        <CalendarClock className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reschedule</h2>
                                </div>
                                <button onClick={() => setRescheduleTarget(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {rescheduleTarget.patient_name} with {rescheduleTarget.doctor_name}
                            </p>

                            <form onSubmit={confirmReschedule} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New date</label>
                                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New time</label>
                                    <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="input-field" required />
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <button type="submit" disabled={rescheduling} className="btn-primary w-full justify-center disabled:opacity-60">
                                        {rescheduling ? 'Saving...' : 'Save New Time'}
                                    </button>
                                    <button type="button" onClick={() => setRescheduleTarget(null)} className="btn-secondary w-full justify-center">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Appointments;
