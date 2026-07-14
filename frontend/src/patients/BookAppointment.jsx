import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { doctorAPI, appointmentAPI } from '../services/api';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await doctorAPI.getAll();
                setDoctors(res.data);
            } catch (err) {
                toast.error('Failed to load doctors');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization.toLowerCase().includes(search.toLowerCase())
    );

    const handleBook = async (e) => {
        e.preventDefault();
        if (!selectedDoctor || !date || !time) {
            toast.error('Please select a doctor, date and time');
            return;
        }
        setSubmitting(true);
        try {
            await appointmentAPI.create({
                doctor_id: selectedDoctor.id,
                date,
                time,
                symptoms,
            });
            toast.success('Appointment requested — awaiting admin approval');
            navigate('/patient/appointments');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Book an Appointment
            </h1>

            {!selectedDoctor ? (
                <>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by doctor or specialization..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDoctors.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
                                No doctors found.
                            </p>
                        )}
                        {filteredDoctors.map((doc) => (
                            <motion.button
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedDoctor(doc)}
                                className="card text-left hover:border-primary border border-transparent transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                                <p className="text-sm text-primary">{doc.specialization}</p>
                                {doc.department && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{doc.department}</p>
                                )}
                                {doc.consultation_fee ? (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Consultation fee: ${doc.consultation_fee}
                                    </p>
                                ) : null}
                            </motion.button>
                        ))}
                    </div>
                </>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card max-w-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CalendarPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{selectedDoctor.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDoctor.specialization}</p>
                        </div>
                    </div>

                    <form onSubmit={handleBook} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Symptoms / Reason for visit
                            </label>
                            <textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="input-field"
                                rows={3}
                                placeholder="Briefly describe your symptoms..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
                                {submitting ? 'Booking...' : 'Confirm Booking'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedDoctor(null)}
                                className="btn-secondary w-full justify-center"
                            >
                                Back
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </div>
    );
};

export default BookAppointment;
