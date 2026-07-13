import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    ArrowRight,
    Calendar,
    Stethoscope,
    Clock,
    Shield,
    HeartPulse,
    Microscope,
    Users,
    Award,
    Building,
    Smile,
    Star,
} from 'lucide-react';

/* ---------- animation helpers ---------- */
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

/* ---------- data ---------- */
const features = [
    { icon: Shield, title: 'Safe & Secure', desc: 'Your data is encrypted and protected.' },
    { icon: Clock, title: '24/7 Support', desc: 'Emergency and telemedicine always available.' },
    { icon: HeartPulse, title: 'Modern Equipment', desc: 'Cutting‑edge technology for accurate diagnosis.' },
    { icon: Microscope, title: 'Advanced Lab', desc: 'Fast and reliable test results.' },
    { icon: Users, title: 'Expert Team', desc: 'Highly qualified doctors and nurses.' },
    { icon: Stethoscope, title: 'Personalised Care', desc: 'Treatment plans tailored to you.' },
];

const services = [
    { icon: HeartPulse, name: 'Cardiology', desc: 'Heart care and surgeries' },
    { icon: Microscope, name: 'Neurology', desc: 'Brain and nervous system' },
    { icon: Stethoscope, name: 'Orthopedics', desc: 'Bone and joint treatment' },
    { icon: Users, name: 'Pediatrics', desc: 'Children health care' },
    { icon: Shield, name: 'Ophthalmology', desc: 'Eye care and surgeries' },
    { icon: HeartPulse, name: 'Dentistry', desc: 'Dental and oral health' },
];

const stats = [
    { icon: Users, value: '500+', label: 'Expert Doctors' },
    { icon: Smile, value: '50,000+', label: 'Happy Patients' },
    { icon: Building, value: '12', label: 'Hospitals' },
    { icon: Award, value: '25+', label: 'Years Experience' },
];

const testimonials = [
    {
        name: 'Aisha Mohamed',
        role: 'Patient',
        quote: 'SmartCare saved my life. The doctors were incredibly professional and caring.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    },
    {
        name: 'Abdi Rahman',
        role: 'Patient',
        quote: 'The telemedicine service is a game-changer. I got a consultation from home in minutes.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    },
    {
        name: 'Fatima Nur',
        role: 'Mother of two',
        quote: 'Pediatric care here is outstanding. My children are always treated with kindness.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    },
];

/* ---------- component ---------- */
const Hero = () => {
    const heroImage =
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80';

    return (
        <>
            {/* ═══════════ SECTION 1 : HERO (original size) ═══════════ */}
            <section className="min-h-screen flex items-center bg-white dark:bg-black transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left – Text */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="space-y-8"
                        >
                            <motion.div variants={fadeInUp} className="space-y-4">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <Stethoscope className="w-5 h-5" />
                                    <span>Welcome to SmartCare</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                                    Your Health Is Our{' '}
                                    <span className="text-primary">Top Priority</span>
                                </h1>

                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                                    Experience world-class healthcare with our team of expert doctors,
                                    modern facilities, and compassionate care. Book your appointment
                                    today and take the first step towards a healthier life.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <Link to="/signup" className="btn-primary">
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/services" className="btn-outline">
                                    Our Services
                                </Link>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="flex gap-8 pt-4 border-t border-gray-200 dark:border-gray-800"
                            >
                                <div>
                                    <div className="text-2xl font-bold text-primary">500+</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Expert Doctors</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">50k+</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Happy Patients</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                                        <Clock className="w-5 h-5" />
                                        <span>24/7</span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Emergency</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right – Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={heroImage}
                                    alt="Stethoscope on a medical book"
                                    className="w-full h-auto object-cover"
                                    loading="eager"
                                />
                            </div>
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl z-0" />
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-xl z-0" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 2 : WHY CHOOSE US ═══════════ */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Why Choose <span className="text-primary">SmartCare</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            Compassionate care meets modern technology.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((f, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="card group">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                    <f.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {f.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ SECTION 3 : SERVICES OVERVIEW ═══════════ */}
            <section className="py-16 bg-white dark:bg-black transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Our <span className="text-primary">Services</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            Everything you need under one roof.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((s, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="card group flex flex-col items-start"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                    <s.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {s.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{s.desc}</p>
                                <Link
                                    to="/services"
                                    className="mt-auto inline-flex items-center text-primary text-sm font-medium hover:underline"
                                >
                                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 4 : STATS ═══════════ */}
            <section className="py-16 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        {stats.map((s, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-1"
                            >
                                <s.icon className="w-8 h-8 mx-auto text-white/80" />
                                <div className="text-3xl font-bold">{s.value}</div>
                                <div className="text-white/80 text-sm">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 5 : TESTIMONIALS ═══════════ */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            What Our <span className="text-primary">Patients</span> Say
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="card flex flex-col"
                            >
                                <div className="flex items-center gap-1 mb-3">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 italic text-sm mb-4">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="flex items-center gap-2 mt-auto">
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 6 : CTA ═══════════ */}
            <section className="py-16 bg-white dark:bg-black transition-colors duration-500">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        Join thousands of happy patients today.
                    </p>
                    <Link to="/signup" className="btn-primary text-base px-6 py-3">
                        <Calendar className="w-5 h-5" />
                        Book Appointment
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Hero;