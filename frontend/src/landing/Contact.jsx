import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    Heart,
    Brain,
    Bone,
    Baby,
    Siren,
    Navigation,
} from 'lucide-react';
import toast from 'react-hot-toast';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

const quickInfo = [
    { icon: MapPin, label: 'Address', value: 'Hodan District, Mogadishu, Somalia' },
    { icon: Phone, label: 'Phone', value: '+252 61 234 5678' },
    { icon: Mail, label: 'Email', value: 'info@smartcare.so' },
    { icon: Clock, label: 'Working Hours', value: 'Sat–Thu, 8:00 AM – 10:00 PM' },
];

const departments = [
    { icon: Heart, name: 'Cardiology', ext: 'Ext. 101' },
    { icon: Brain, name: 'Neurology', ext: 'Ext. 102' },
    { icon: Bone, name: 'Orthopedics', ext: 'Ext. 103' },
    { icon: Baby, name: 'Pediatrics', ext: 'Ext. 104' },
];

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const heroImage =
        'https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=900&q=80';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            toast.success("Message sent — we'll get back to you within 24 hours");
            setForm({ name: '', email: '', message: '' });
            setSubmitting(false);
        }, 800);
    };

    return (
        <div className="pt-16">
            {/* ============ HERO — diagonal clipped split ============ */}
            <section className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="space-y-5 order-2 lg:order-1"
                        >
                            <motion.div
                                variants={fadeInUp}
                                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-dark dark:text-primary-light font-semibold text-sm px-4 py-1.5 rounded-full"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Get in touch</span>
                            </motion.div>
                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
                            >
                                We'd love to <span className="text-primary-dark dark:text-primary-light">hear from you</span>
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                                Questions about an appointment, billing, or how we can help? Our team
                                typically replies within 24 hours — often much sooner.
                            </motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <a href="tel:+252612345678" className="btn-primary">
                                    <Phone className="w-5 h-5" />
                                    Call Us Now
                                </a>
                                <a href="#contact-form" className="btn-outline">
                                    <Send className="w-5 h-5" />
                                    Send a Message
                                </a>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative order-1 lg:order-2"
                        >
                            <div
                                className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden shadow-2xl"
                                style={{ clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)', borderRadius: '2rem' }}
                            >
                                <img
                                    src={heroImage}
                                    alt="SmartCare front desk"
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 via-transparent to-transparent" />
                            </div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/25 rounded-full blur-2xl -z-10" />
                            <div className="absolute -bottom-8 left-4 w-40 h-40 bg-primary/15 rounded-full blur-2xl -z-10" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="card absolute -bottom-6 -left-4 sm:-left-10 flex items-center gap-3 py-3 px-4 max-w-[220px]"
                            >
                                <div className="w-11 h-11 shrink-0 bg-primary/15 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Open 24/7</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">For emergencies</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ QUICK INFO TILES ============ */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-5"
                    >
                        {quickInfo.map((info) => (
                            <motion.div key={info.label} variants={fadeInUp} className="card text-center py-7">
                                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                                    <info.icon className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{info.label}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{info.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ MAP + FORM — side by side ============ */}
            <section id="contact-form" className="pb-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="card p-0 overflow-hidden relative min-h-[380px]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
                                alt="Map to SmartCare hospital"
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-white font-semibold">SmartCare Main Hospital</p>
                                    <p className="text-white/80 text-sm">Hodan District, Mogadishu</p>
                                </div>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary text-sm py-2 px-3 whitespace-nowrap"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Directions
                                </a>
                            </div>
                        </motion.div>

                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="card"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Send a Message</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                We'll route it to the right team automatically.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Your name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
                                    <Send className="w-4 h-4" />
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============ DEPARTMENT DIRECTORY ============ */}
            <section className="pb-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Direct Lines</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                            Reach a Department Directly
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-5"
                    >
                        {departments.map((dept) => (
                            <motion.a
                                key={dept.name}
                                href="tel:+252612345678"
                                variants={fadeInUp}
                                className="card flex items-center gap-3 hover:border-primary/40 transition-colors"
                            >
                                <div className="w-11 h-11 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <dept.icon className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{dept.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{dept.ext}</p>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ EMERGENCY BANNER ============ */}
            <section className="pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border border-red-400/30 bg-red-500/10 backdrop-blur-xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 shrink-0 bg-red-500/15 rounded-2xl flex items-center justify-center">
                                <Siren className="w-7 h-7 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Medical Emergency?</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Our emergency department is open 24/7, every day of the year.
                                </p>
                            </div>
                        </div>
                        <a
                            href="tel:+252612349999"
                            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-red-500/25 whitespace-nowrap"
                        >
                            <Phone className="w-5 h-5" />
                            +252 61 234 9999
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;