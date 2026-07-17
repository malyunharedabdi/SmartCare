import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Download, Wallet, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { billingAPI } from '../services/api';
import PaymentModal from '../components/PaymentModal';

const statusStyle = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payTarget, setPayTarget] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchBills = async () => {
        try {
            const res = await billingAPI.getAll();
            setBills(res.data);
        } catch (err) {
            toast.error('Failed to load bills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const { outstanding, paidTotal } = useMemo(() => {
        return bills.reduce(
            (acc, b) => {
                if (b.payment_status === 'paid') acc.paidTotal += b.total_amount || 0;
                else acc.outstanding += b.total_amount || 0;
                return acc;
            },
            { outstanding: 0, paidTotal: 0 }
        );
    }, [bills]);

    const filtered = bills.filter((b) => filter === 'all' || b.payment_status === filter);

    const downloadReceipt = async (billId, invoiceNumber) => {
        try {
            const res = await billingAPI.getReceipt(billId);
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt_${invoiceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Failed to download receipt');
        }
    };

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
                    <Wallet className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing &amp; Payments</h1>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${outstanding.toFixed(2)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding Balance</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${paidTotal.toFixed(2)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {['all', 'pending', 'paid'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                            filter === f
                                ? 'bg-primary text-white'
                                : 'bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary/10'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Bills list */}
            <div className="space-y-4">
                {filtered.length === 0 && (
                    <div className="card text-center py-10">
                        <Receipt className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No bills to show.</p>
                    </div>
                )}
                {filtered.map((bill, idx) => (
                    <motion.div
                        key={bill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                <Receipt className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{bill.invoice_number}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{bill.description || 'Consultation'}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(bill.bill_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 sm:justify-end">
                            <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-white">${bill.total_amount.toFixed(2)}</p>
                                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusStyle[bill.payment_status]}`}>
                                    {bill.payment_status}
                                </span>
                            </div>
                            {bill.payment_status === 'pending' ? (
                                <button onClick={() => setPayTarget(bill)} className="btn-primary text-sm py-2 px-4">
                                    <CreditCard className="w-4 h-4" /> Pay Now
                                </button>
                            ) : (
                                <button
                                    onClick={() => downloadReceipt(bill.id, bill.invoice_number)}
                                    className="btn-outline text-sm py-2 px-4"
                                >
                                    <Download className="w-4 h-4" /> Receipt
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {payTarget && (
                <PaymentModal bill={payTarget} onClose={() => setPayTarget(null)} onSuccess={handlePaySuccess} mode="patient" />
            )}
        </div>
    );
};

export default Billing;
