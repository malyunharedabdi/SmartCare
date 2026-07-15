import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
    {
        question: 'How do I book an appointment?',
        answer:
            'You can book an appointment online through our website by signing up and navigating to the "Book Appointment" section, or by calling our front desk at +252 61 234 5678.',
    },
    {
        question: 'What should I bring for my first visit?',
        answer:
            'Please bring a valid ID, any previous medical records, a list of current medications, and your insurance card if applicable.',
    },
    {
        question: 'Do you accept walk‑in patients?',
        answer:
            'We prioritise scheduled appointments, but walk‑in patients are welcome based on availability. For urgent needs, please visit our emergency department.',
    },
    {
        question: 'What insurance plans do you accept?',
        answer:
            'We accept most major local and international insurance plans. Contact our billing department with your policy details to verify coverage before your visit.',
    },
    {
        question: 'How do I reschedule or cancel an appointment?',
        answer:
            'You can reschedule or cancel your appointment by logging into your patient dashboard or by calling our reception at least 24 hours in advance.',
    },
    {
        question: 'Are telemedicine consultations available?',
        answer:
            'Yes, we offer virtual consultations for non‑emergency follow‑ups. You can book a telemedicine appointment just like a regular in‑person visit.',
    },
    {
        question: 'What are your working hours?',
        answer:
            'Our hospital operates Saturday to Thursday from 8:00 AM to 10:00 PM. We are closed on Fridays. Emergency services run 24/7.',
    },
    {
        question: 'How do I access my medical records?',
        answer:
            'You can view and download your medical records anytime through your patient dashboard after logging in. They are encrypted and secure.',
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="pt-16">
            {/* Hero Banner */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl font-bold mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Find answers to the most common questions about our services.
                    </motion.p>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {faqData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center text-left p-0 bg-transparent border-none cursor-pointer"
                                    aria-expanded={openIndex === index}
                                >
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                                            {item.question}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pt-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-4">
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still have questions? */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Contact our support team and we'll get back to you within 24 hours.
                    </p>
                    <a
                        href="/contact"
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
