import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import {
    ChevronDown,
    HelpCircle,
    CalendarClock,
    Wallet,
    FileText,
    Video,
    ShieldCheck,
    Clock,
    Phone,
    Mail,
    MessageCircleQuestion,
} from 'lucide-react';

const categories = ['All', 'Appointments', 'Billing', 'Records', 'Telemedicine', 'General'];

const faqData = [
    {
        category: 'Appointments',
        icon: CalendarClock,
        question: 'How do I book an appointment?',
        answer:
            'You can book online through our website by signing up and navigating to "Book Appointment", or by calling our front desk at +252 61 234 5678.',
    },
    {
        category: 'Appointments',
        icon: CalendarClock,
        question: 'How do I reschedule or cancel an appointment?',
        answer:
            'Log into your patient dashboard and use the reschedule or cancel option, or call reception at least 24 hours in advance.',
    },
    {
        category: 'Appointments',
        icon: Clock,
        question: 'Do you accept walk-in patients?',
        answer:
            'We prioritise scheduled appointments, but walk-ins are welcome based on availability. For urgent needs, please visit our emergency department.',
    },
    {
        category: 'General',
        icon: FileText,
        question: 'What should I bring for my first visit?',
        answer:
            'A valid ID, any previous medical records, a list of current medications, and your insurance card if applicable.',
    },
    {
        category: 'Billing',
        icon: Wallet,
        question: 'What insurance plans do you accept?',
        answer:
            'We accept most major local and international insurance plans. Contact our billing department with your policy details to verify coverage.',
    },
    {
        category: 'Billing',
        icon: Wallet,
        question: 'How do I pay my bill or download a receipt?',
        answer:
            'Once a bill is marked paid, you can download a PDF receipt straight from the Medical Records section of your patient dashboard.',
    },
    {
        category: 'Telemedicine',
        icon: Video,
        question: 'Are telemedicine consultations available?',
        answer:
            'Yes — we offer virtual consultations for non-emergency follow-ups. Book a telemedicine slot just like a regular in-person visit.',
    },
    {
        category: 'General',
        icon: Clock,
        question: 'What are your working hours?',
        answer:
            'Saturday to Thursday, 8:00 AM – 10:00 PM. We are closed on Fridays. Emergency services run 24/7.',
    },
    {
        category: 'Records',
        icon: FileText,
        question: 'How do I access my medical records?',
        answer:
            'View and download your medical records anytime through your patient dashboard after logging in. They are encrypted and secure.',
    },
    {
        category: 'Records',
        icon: ShieldCheck,
        question: 'How is my medical data protected?',
        answer:
            'All records are encrypted in transit and at rest, and only accessible to you and the clinical staff directly treating you.',
    },
];

const popularTopics = [
    { icon: CalendarClock, label: 'Appointments', category: 'Appointments' },
    { icon: Wallet, label: 'Billing', category: 'Billing' },
    { icon: FileText, label: 'Records', category: 'Records' },
    { icon: Video, label: 'Telemedicine', category: 'Telemedicine' },
];

const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState(null);

    const filtered = useMemo(
        () => (activeCategory === 'All' ? faqData : faqData.filter((f) => f.category === activeCategory)),
        [activeCategory]
    );

    const toggleFAQ = (key) => {
        setOpenIndex(openIndex === key ? null : key);
    };

    const heroImage =
        'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80';

    return (
        <div className="pt-16">
            {/* ============ HERO — 50/50 split ============ */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-5"
                        >
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-dark dark:text-primary-light font-semibold text-sm px-4 py-1.5 rounded-full">
                                <MessageCircleQuestion className="w-4 h-4" />
                                <span>We're here to help</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                                Frequently Asked <span className="text-primary-dark dark:text-primary-light">Questions</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                                Answers to the questions patients ask us most — about booking, billing,
                                records, and virtual care. Can't find what you need? We're one call away.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <a href="tel:+252612345678" className="btn-primary">
                                    <Phone className="w-5 h-5" />
                                    +252 61 234 5678
                                </a>
                                <Link to="/contact" className="btn-outline">
                                    <Mail className="w-5 h-5" />
                                    Email Support
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            className="relative"
                        >
                            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                                <img
                                    src={heroImage}
                                    alt="Support team ready to help"
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                            <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-primary/20 rounded-full blur-2xl -z-10" />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="card absolute -bottom-6 -right-4 sm:-right-8 flex items-center gap-3 py-3 px-4 max-w-[210px]"
                            >
                                <div className="w-11 h-11 shrink-0 bg-primary/15 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">&lt; 24 hrs</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Average reply time</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ POPULAR TOPICS — quick icon nav ============ */}
            <section className="pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {popularTopics.map((topic) => (
                            <button
                                key={topic.label}
                                onClick={() => setActiveCategory(topic.category)}
                                className={`card flex flex-col items-center text-center py-6 transition-all ${
                                    activeCategory === topic.category ? 'border-primary/60 ring-2 ring-primary/20' : ''
                                }`}
                            >
                                <topic.icon className="w-7 h-7 text-primary-dark dark:text-primary-light mb-2" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{topic.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CATEGORY FILTER + FAQ MASONRY GRID ============ */}
            <section className="pb-20 transition-colors duration-500">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                    activeCategory === cat
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-white/40 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:text-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={activeCategory}
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                        className="columns-1 md:columns-2 gap-5"
                    >
                        {filtered.map((item, index) => {
                            const key = `${activeCategory}-${index}`;
                            const isOpen = openIndex === key;
                            return (
                                <motion.div
                                    key={key}
                                    variants={fadeInUpVariant}
                                    className="card mb-5 break-inside-avoid"
                                >
                                    <button
                                        onClick={() => toggleFAQ(key)}
                                        className="w-full flex justify-between items-start text-left p-0 bg-transparent border-none cursor-pointer gap-3"
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <item.icon className="w-4.5 h-4.5 text-primary-dark dark:text-primary-light" />
                                            </div>
                                            <span className="text-base font-medium text-gray-900 dark:text-white pt-1">
                                                {item.question}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`w-5 h-5 text-primary flex-shrink-0 mt-1 transition-transform duration-300 ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pt-3 pl-12 text-gray-600 dark:text-gray-400 text-sm">
                                                    {item.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ============ STILL HAVE QUESTIONS — CTA band ============ */}
            <section className="pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card grid grid-cols-1 sm:grid-cols-3 gap-6 items-center py-10 px-8">
                        <div className="sm:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <HelpCircle className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Still stuck?</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Our support team is a message away
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Reach out and we'll get back to you within 24 hours — usually much sooner.
                            </p>
                        </div>
                        <Link to="/contact" className="btn-primary w-full justify-center">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;

