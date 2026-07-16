import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    Stethoscope,
    Star,
    Clock,
    DollarSign,
    GraduationCap,
    CalendarPlus,
    Sparkles,
    ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { doctorAPI, appointmentAPI } from '../services/api';

/* Symptom → specialization matching. "Not sure" shows every doctor. */
const SYMPTOMS = [
    { label: 'Chest pain / palpitations', specialization: 'Cardiologist' },
    { label: 'High blood pressure', specialization: 'Cardiologist' },
    { label: 'Headache / migraine', specialization: 'Neurologist' },
    { label: 'Dizziness / seizures', specialization: 'Neurologist' },
    { label: "Child's fever or cough", specialization: 'Pediatrician' },
    { label: "Child growth concern", specialization: 'Pediatrician' },
    { label: 'Skin rash / acne / eczema', specialization: 'Dermatologist' },
    { label: 'Joint pain / fracture', specialization: 'Orthopedic Surgeon' },
    { label: 'Back pain', specialization: 'Orthopedic Surgeon' },
    { label: 'Pregnancy check-up', specialization: 'Gynecologist' },
    { label: 'Menstrual issues', specialization: 'Gynecologist' },
    { label: 'General fever / cold / flu', specialization: 'General Physician' },
    { label: 'Routine check-up', specialization: 'General Physician' },
    { label: 'Ear pain / sinus issues', specialization: 'ENT Specialist' },
    { label: 'Sore throat', specialization: 'ENT Specialist' },
    { label: 'Blurred vision / eye pain', specialization: 'Ophthalmologist' },
    { label: 'Anxiety / depression / sleep issues', specialization: 'Psychiatrist' },
    { label: 'Stomach pain / acid reflux', specialization: 'Gastroenterologist' },
    { label: 'Nausea / digestive issues', specialization: 'Gastroenterologist' },
    { label: 'Toothache / gum pain', specialization: 'Dentist' },
    { label: 'Urinary issues / kidney pain', specialization: 'Urologist' },
    { label: 'Cough / shortness of breath', specialization: 'Pulmonologist' },
    { label: "Not sure — show me everyone", specialization: null },
];

const initials = (name = '') =>
    name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');

    const [showModal, setShowModal] = useState(false);
    const [symptomIdx, setSymptomIdx] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
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

    const departments = useMemo(
        () => ['all', ...new Set(doctors.map((d) => d.department).filter(Boolean))],
        [doctors]
    );

    const filteredDoctors = doctors.filter((d) => {
        const matchesSearch =
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.specialization.toLowerCase().includes(search.toLowerCase());
        const matchesDept = deptFilter === 'all' || d.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const matchedSpecialization = symptomIdx !== '' ? SYMPTOMS[symptomIdx].specialization : null;

    const recommendedDoctors = matchedSpecialization
        ? doctors.filter((d) => d.specialization === matchedSpecialization)
        : doctors;

    const openBookingModal = (doctorId = '') => {
        setSelectedDoctorId(doctorId ? String(doctorId) : '');
        setSymptomIdx('');
        setDate('');
        setTime('');
        setDescription('');
        setShowModal(true);
    };

    // When the symptom changes, if the currently selected doctor no longer
    // matches the recommended specialization, clear the selection so the
    // patient picks from the newly recommended list instead.
    useEffect(() => {
        if (!matchedSpecialization) return;
        const stillValid = doctors.some(
            (d) => String(d.id) === selectedDoctorId && d.specialization === matchedSpecialization
        );
        if (!stillValid) setSelectedDoctorId('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symptomIdx]);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!selectedDoctorId || !date || !time) {
            toast.error('Please select a doctor, date and time');
            return;
        }
        setSubmitting(true);
        try {
            const symptomLabel = symptomIdx !== '' ? SYMPTOMS[symptomIdx].label : '';
            const symptomsText = [symptomLabel, description].filter(Boolean).join(' — ');

            await appointmentAPI.create({
                doctor_id: Number(selectedDoctorId),
                date,
                time,
                symptoms: symptomsText || undefined,
            });
            toast.success('Appointment requested — awaiting admin approval');
            setShowModal(false);
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book an Appointment</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Browse our doctors, or let us match you to the right specialist.
                    </p>
                </div>
                <button onClick={() => openBookingModal()} className="btn-primary whitespace-nowrap">
                    <CalendarPlus className="w-5 h-5" />
                    Book Appointment
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by doctor or specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
                <div className="relative sm:w-56">
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="input-field appearance-none pr-9"
                    >
                        {departments.map((d) => (
                            <option key={d} value={d}>
                                {d === 'all' ? 'All Departments' : d}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Doctor grid — the "content and data" page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDoctors.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-16">
                        No doctors found.
                    </p>
                )}
                {filteredDoctors.map((doc, idx) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="card flex flex-col"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {initials(doc.name)}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{doc.name}</h3>
                                <p className="text-primary-dark dark:text-primary-light text-sm">{doc.specialization}</p>
                                {doc.department && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{doc.department}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                            {doc.qualification && (
                                <div className="flex items-center gap-1.5">
                                    <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary-dark dark:text-primary-light" />
                                    <span className="truncate">{doc.qualification}</span>
                                </div>
                            )}
                            {doc.experience != null && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 shrink-0 text-primary-dark dark:text-primary-light" />
                                    <span>{doc.experience} yrs exp.</span>
                                </div>
                            )}
                            {doc.consultation_fee ? (
                                <div className="flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 shrink-0 text-primary-dark dark:text-primary-light" />
                                    <span>${doc.consultation_fee} / visit</span>
                                </div>
                            ) : null}
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 shrink-0 fill-primary text-primary" />
                                <span>4.9 rating</span>
                            </div>
                        </div>

                        <button
                            onClick={() => openBookingModal(doc.id)}
                            className="btn-primary w-full justify-center mt-auto text-sm py-2"
                        >
                            <CalendarPlus className="w-4 h-4" />
                            Book with {doc.name.replace('Dr. ', 'Dr. ')}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* ═══════════ BOOKING MODAL ═══════════ */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            className="card w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center">
                                        <Stethoscope className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Appointment</h2>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleBook} className="space-y-4">
                                {/* Symptom dropdown — drives doctor matching */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        What's the issue?
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={symptomIdx}
                                            onChange={(e) => setSymptomIdx(e.target.value)}
                                            className="input-field appearance-none pr-9"
                                        >
                                            <option value="">Select a symptom or reason...</option>
                                            {SYMPTOMS.map((s, i) => (
                                                <option key={s.label} value={i}>{s.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {matchedSpecialization && (
                                        <p className="flex items-center gap-1.5 text-xs text-primary-dark dark:text-primary-light mt-1.5">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Recommended specialist: {matchedSpecialization}
                                        </p>
                                    )}
                                </div>

                                {/* Doctor dropdown — filtered to the match */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Choose a doctor
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedDoctorId}
                                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                                            className="input-field appearance-none pr-9"
                                            required
                                        >
                                            <option value="">Select a doctor...</option>
                                            {recommendedDoctors.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} — {d.specialization}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {matchedSpecialization && recommendedDoctors.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1.5">
                                            No {matchedSpecialization} available right now — try another symptom.
                                        </p>
                                    )}
                                </div>

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
                                        Describe how you're feeling
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="input-field"
                                        rows={3}
                                        placeholder="e.g. sharp pain since yesterday, worse when I move..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary w-full justify-center disabled:opacity-60"
                                    >
                                        {submitting ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary w-full justify-center"
                                    >
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

export default BookAppointment;
