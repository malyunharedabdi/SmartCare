import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, DollarSign, Clock, TrendingUp, Receipt, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { billingAPI } from '../services/api';
import PaymentModal from '../components/PaymentModal';

const statusStyle = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const methodLabel = {
    cash: 'Cash',
    card: 'Card',
    mpesa: 'M-Pesa',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    insurance: 'Insurance',
};

const AdminPayments = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [recordTarget, setRecordTarget] = useState(null);

    const fetchBills = async () => {
        try {
            const res = await billingAPI.getAll();
            setBills(res.data);
        } catch (err) {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const stats = useMemo(() => {
        const paid = bills.filter((b) => b.payment_status === 'paid');
        const pending = bills.filter((b) => b.payment_status === 'pending');
        const today = new Date().toDateString();
        const paidToday = paid.filter((b) => b.payment_date && new Date(b.payment_date).toDateString() === today);
        return {
            totalRevenue: paid.reduce((s, b) => s + (b.total_amount || 0), 0),
            outstanding: pending.reduce((s, b) => s + (b.total_amount || 0), 0),
            transactionsToday: paidToday.length,
            avgTransaction: paid.length ? paid.reduce((s, b) => s + (b.total_amount || 0), 0) / paid.length : 0,
        };
    }, [bills]);

    const filtered = bills.filter((b) => {
        const matchesSearch =
            (b.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (b.invoice_number || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.payment_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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

    const handleRecordSuccess = (updatedBill) => {
        setBills((prev) => prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)));
        setRecordTarget(null);
        toast.success('Payment recorded');
    };

    const summaryCards = [
        { icon: DollarSign, label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}` },
        { icon: Clock, label: 'Outstanding', value: `$${stats.outstanding.toFixed(2)}` },
        { icon: CheckCircle2, label: 'Paid Today', value: stats.transactionsToday },
        { icon: TrendingUp, label: 'Avg. Transaction', value: `$${stats.avgTransaction.toFixed(2)}` },
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
                    <Receipt className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((s, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="card"
                    >
                        <div className="p-2 bg-primary/10 rounded-lg w-fit">
                            <s.icon className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{s.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="card">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            className="input-field pl-9"
                            placeholder="Search patient or invoice number…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-48">
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="py-3 pr-4">Invoice</th>
                                <th className="py-3 pr-4">Patient</th>
                                <th className="py-3 pr-4">Amount</th>
                                <th className="py-3 pr-4">Method</th>
                                <th className="py-3 pr-4">Date</th>
                                <th className="py-3 pr-4">Status</th>
                                <th className="py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                            {filtered.map((bill) => (
                                <tr key={bill.id} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">{bill.invoice_number}</td>
                                    <td className="py-3 pr-4">{bill.patient_name}</td>
                                    <td className="py-3 pr-4 text-gray-900 dark:text-white">${bill.total_amount.toFixed(2)}</td>
                                    <td className="py-3 pr-4">{methodLabel[bill.payment_method] || bill.payment_method || '—'}</td>
                                    <td className="py-3 pr-4">
                                        {bill.payment_date
                                            ? new Date(bill.payment_date).toLocaleDateString()
                                            : new Date(bill.bill_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[bill.payment_status]}`}>
                                            {bill.payment_status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {bill.payment_status === 'pending' ? (
                                            <button
                                                onClick={() => setRecordTarget(bill)}
                                                className="text-primary-dark dark:text-primary-light text-xs font-medium hover:underline"
                                            >
                                                Record Payment
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => downloadReceipt(bill.id, bill.invoice_number)}
                                                className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Receipt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {recordTarget && (
                <PaymentModal bill={recordTarget} onClose={() => setRecordTarget(null)} onSuccess={handleRecordSuccess} mode="admin" />
            )}
        </div>
    );
};

export default AdminPayments;
