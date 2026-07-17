import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    X,
    CreditCard,
    Smartphone,
    Wallet,
    Landmark,
    Loader2,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { billingAPI } from '../services/api';

const METHODS = [
    { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa, Mastercard' },
    { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'STK push to your phone' },
    { id: 'paypal', label: 'PayPal', icon: Wallet, desc: 'Pay with PayPal balance' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Landmark, desc: 'Direct bank payment' },
];

const formatCardNumber = (value) =>
    value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

/**
 * Simulated payment checkout.
 *
 * Props:
 *  - bill: the bill object being paid (needs id, total_amount, invoice_number)
 *  - onClose(): called to dismiss the modal
 *  - onSuccess(updatedBill): called once the (simulated) payment succeeds
 *  - mode: 'patient' (default, full checkout UI) | 'admin' (quick manual record-payment)
 */
const PaymentModal = ({ bill, onClose, onSuccess, mode = 'patient' }) => {
    const [method, setMethod] = useState(mode === 'admin' ? 'cash' : null);
    const [step, setStep] = useState(mode === 'admin' ? 'details' : 'method'); // method -> details -> processing -> success/failed
    const [errorMsg, setErrorMsg] = useState('');

    // Card fields
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    // M-Pesa
    const [phone, setPhone] = useState('');
    // PayPal
    const [paypalEmail, setPaypalEmail] = useState('');
    // Bank transfer
    const [accountNumber, setAccountNumber] = useState('');

    const chooseMethod = (id) => {
        setMethod(id);
        setStep('details');
    };

    const detailsValid = () => {
        if (mode === 'admin') return true;
        if (method === 'card') {
            return cardNumber.replace(/\s/g, '').length === 16 && cardName.trim() && /^\d{2}\/\d{2}$/.test(expiry) && cvc.length >= 3;
        }
        if (method === 'mpesa') {
            return /^(0|\+?254)?7\d{8}$/.test(phone.replace(/\s/g, ''));
        }
        if (method === 'paypal') {
            return /\S+@\S+\.\S+/.test(paypalEmail);
        }
        if (method === 'bank_transfer') {
            return accountNumber.trim().length >= 6;
        }
        return false;
    };

    const payerReference = () => {
        if (method === 'card') return `Card ending ${cardNumber.replace(/\s/g, '').slice(-4)}`;
        if (method === 'mpesa') return phone;
        if (method === 'paypal') return paypalEmail;
        if (method === 'bank_transfer') return accountNumber;
        return undefined;
    };

    const submitPayment = async () => {
        setStep('processing');
        setErrorMsg('');

        // Simulated network / STK-push delay so the flow feels real.
        const delay = method === 'mpesa' ? 2600 : 1600;
        await new Promise((res) => setTimeout(res, delay));

        try {
            const res = await billingAPI.pay(bill.id, {
                payment_method: method,
                payer_reference: payerReference(),
            });
            setStep('success');
            toast.success('Payment successful');
            setTimeout(() => onSuccess?.(res.data.bill), 900);
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Payment failed. Please try again.');
            setStep('failed');
        }
    };

    const retry = () => {
        setStep(mode === 'admin' ? 'details' : 'method');
        setErrorMsg('');
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && step !== 'processing' && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="card w-full max-w-md relative"
                >
                    {step !== 'processing' && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <div className="mb-5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {mode === 'admin' ? 'Record Payment' : 'Pay Invoice'} · {bill.invoice_number}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            ${Number(bill.total_amount).toFixed(2)}
                        </p>
                        {bill.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bill.description}</p>
                        )}
                    </div>

                    {/* STEP: choose method (patient checkout only) */}
                    {step === 'method' && (
                        <div className="grid grid-cols-2 gap-3">
                            {METHODS.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => chooseMethod(m.id)}
                                    className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                                >
                                    <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center">
                                        <m.icon className="w-4.5 h-4.5 text-primary-dark dark:text-primary-light" />
                                    </div>
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{m.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP: admin quick method pick */}
                    {mode === 'admin' && step === 'details' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="input-field mt-1"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card (in person)</option>
                                    <option value="mpesa">M-Pesa</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <button onClick={submitPayment} className="btn-primary w-full justify-center">
                                Confirm Payment Received
                            </button>
                        </div>
                    )}

                    {/* STEP: patient detail entry per method */}
                    {mode === 'patient' && step === 'details' && method === 'card' && (
                        <div className="space-y-3">
                            <input
                                className="input-field"
                                placeholder="Card number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                inputMode="numeric"
                            />
                            <input
                                className="input-field"
                                placeholder="Name on card"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <input
                                    className="input-field"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                    inputMode="numeric"
                                />
                                <input
                                    className="input-field"
                                    placeholder="CVC"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    inputMode="numeric"
                                />
                            </div>
                            <PayButton onClick={submitPayment} disabled={!detailsValid()} />
                            <BackLink onClick={() => setStep('method')} />
                        </div>
                    )}

                    {mode === 'patient' && step === 'details' && method === 'mpesa' && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter the phone number to receive the STK push prompt.
                            </p>
                            <input
                                className="input-field"
                                placeholder="e.g. 0712 345 678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                inputMode="tel"
                            />
                            <PayButton onClick={submitPayment} disabled={!detailsValid()} label="Send STK Push" />
                            <BackLink onClick={() => setStep('method')} />
                        </div>
                    )}

                    {mode === 'patient' && step === 'details' && method === 'paypal' && (
                        <div className="space-y-3">
                            <input
                                className="input-field"
                                placeholder="PayPal email"
                                value={paypalEmail}
                                onChange={(e) => setPaypalEmail(e.target.value)}
                                inputMode="email"
                            />
                            <PayButton onClick={submitPayment} disabled={!detailsValid()} />
                            <BackLink onClick={() => setStep('method')} />
                        </div>
                    )}

                    {mode === 'patient' && step === 'details' && method === 'bank_transfer' && (
                        <div className="space-y-3">
                            <input
                                className="input-field"
                                placeholder="Your bank account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                inputMode="numeric"
                            />
                            <PayButton onClick={submitPayment} disabled={!detailsValid()} label="Authorize Transfer" />
                            <BackLink onClick={() => setStep('method')} />
                        </div>
                    )}

                    {/* STEP: processing */}
                    {step === 'processing' && (
                        <div className="py-8 flex flex-col items-center gap-4 text-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {method === 'mpesa' ? 'Check your phone for the M-Pesa prompt…' : 'Processing your payment…'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Simulated secure transaction
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP: success */}
                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center gap-3 text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle2 className="w-14 h-14 text-green-500" />
                            </motion.div>
                            <p className="font-semibold text-gray-900 dark:text-white">Payment Successful</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your receipt is now available.</p>
                        </div>
                    )}

                    {/* STEP: failed */}
                    {step === 'failed' && (
                        <div className="py-6 flex flex-col items-center gap-3 text-center">
                            <XCircle className="w-14 h-14 text-red-500" />
                            <p className="font-semibold text-gray-900 dark:text-white">Payment Failed</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{errorMsg}</p>
                            <button onClick={retry} className="btn-outline mt-2">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const PayButton = ({ onClick, disabled, label = 'Pay Now' }) => (
    <button onClick={onClick} disabled={disabled} className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed">
        {label}
    </button>
);

const BackLink = ({ onClick }) => (
    <button onClick={onClick} className="text-xs text-gray-500 dark:text-gray-400 hover:underline w-full text-center">
        Choose a different method
    </button>
);

export default PaymentModal;
