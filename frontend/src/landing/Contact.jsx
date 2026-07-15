import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
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
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Get in touch – we’re here to help.
                    </motion.p>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left – Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Get in <span className="text-primary">Touch</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Have questions or need to schedule an appointment? Reach out to us and our team will respond promptly.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <MapPin className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Address</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Mogadishu, Somalia</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Phone className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                                        <p className="text-gray-600 dark:text-gray-400">+252 61 234 5678</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Mail className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                                        <p className="text-gray-600 dark:text-gray-400">info@smartcare.so</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Clock className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Working Hours</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Sat–Thu: 8:00 AM – 10:00 PM</p>
                                        <p className="text-gray-600 dark:text-gray-400">Friday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right – Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="card"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Send a Message
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        className="input-field"
                                        rows="4"
                                        placeholder="How can we help?"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full justify-center">
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
