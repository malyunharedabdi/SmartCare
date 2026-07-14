import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Activity, Clipboard, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentAPI, billingAPI } from '../services/api';

const MedicalRecords = () => {
    const [loading, setLoading] = useState(true);
    const [visits, setVisits] = useState([]);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, billsRes] = await Promise.all([
                    appointmentAPI.getAll(),
                    billingAPI.getAll(),
                ]);
                const completed = apptRes.data.filter((a) => a.status === 'completed');
                setVisits(completed);
                setBills(billsRes.data);
            } catch (err) {
                toast.error('Failed to load medical records');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                Medical Records
            </h1>

            {/* Completed visits with diagnosis / prescription */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Visit History
                </h2>
                <div className="grid gap-4">
                    {visits.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                            No completed visits yet.
                        </p>
                    )}
                    {visits.map((visit) => (
                        <motion.div
                            key={visit.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card flex flex-col sm:flex-row sm:items-start gap-4"
                        >
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Visit with {visit.doctor_name}
                                </h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(visit.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                                {visit.symptoms && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                        <strong>Symptoms:</strong> {visit.symptoms}
                                    </p>
                                )}
                                {visit.diagnosis && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        <strong>Diagnosis:</strong> {visit.diagnosis}
                                    </p>
                                )}
                                {visit.prescription && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-start gap-1">
                                        <Clipboard className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span><strong>Prescription:</strong> {visit.prescription}</span>
                                    </p>
                                )}
                                {!visit.diagnosis && !visit.prescription && (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 italic">
                                        No diagnosis or prescription recorded for this visit yet.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Billing / receipts */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Bills & Receipts
                </h2>
                <div className="grid gap-4">
                    {bills.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                            No bills yet.
                        </p>
                    )}
                    {bills.map((bill) => (
                        <motion.div
                            key={bill.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Receipt className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {bill.invoice_number}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {bill.description || 'Consultation'} • ${bill.total_amount?.toFixed(2)}
                                    </p>
                                    <span
                                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${bill.payment_status === 'paid'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}
                                    >
                                        {bill.payment_status}
                                    </span>
                                </div>
                            </div>
                            {bill.payment_status === 'paid' && (
                                <button
                                    onClick={() => downloadReceipt(bill.id, bill.invoice_number)}
                                    className="btn-primary text-xs py-1.5 px-3 self-end sm:self-center"
                                >
                                    <Download className="w-4 h-4 mr-1" /> Receipt
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;
