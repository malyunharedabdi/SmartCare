import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    Heart,
    Brain,
    Bone,
    Baby,
    Eye,
    Clipboard,    // Replaced Tooth with Clipboard
    Stethoscope,
    Microscope,
    Activity,
    Shield,
    ArrowRight,
} from 'lucide-react';

const services = [
    { icon: Heart, name: 'Cardiology', desc: 'Complete heart care, from diagnostics to surgery.' },
    { icon: Brain, name: 'Neurology', desc: 'Advanced treatment for brain and nervous system disorders.' },
    { icon: Bone, name: 'Orthopedics', desc: 'Bone, joint, and spine care with rehabilitation.' },
    { icon: Baby, name: 'Pediatrics', desc: 'Compassionate healthcare for infants, children, and teens.' },
    { icon: Eye, name: 'Ophthalmology', desc: 'Eye exams, laser surgery, and vision correction.' },
    { icon: Clipboard, name: 'Dentistry', desc: 'Dental check‑ups, orthodontics, and cosmetic dentistry.' },
    { icon: Stethoscope, name: 'General Medicine', desc: 'Routine check‑ups and primary care for all ages.' },
    { icon: Microscope, name: 'Laboratory', desc: 'Fast and accurate lab tests for precise diagnosis.' },
    { icon: Activity, name: 'Emergency', desc: '24/7 emergency services with rapid response teams.' },
    { icon: Shield, name: 'Vaccination', desc: 'Immunisation programs for children and adults.' },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

const Services = () => {
    // Image URL you provided
    const heroImage =
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80';

    return (
        <div className="pt-16">
            {/* Hero Banner with 50/50 layout */}
            <section className="min-h-[80vh] flex items-center transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Text */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="space-y-6"
                        >
                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
                            >
                                Our <span className="text-primary">Services</span>
                            </motion.h1>
                            <motion.p
                                variants={fadeInUp}
                                className="text-lg text-gray-600 dark:text-gray-400"
                            >
                                Comprehensive medical services under one roof, delivered by experienced specialists.
                                From routine check‑ups to complex surgeries, we are here for you.
                            </motion.p>
                            <motion.div variants={fadeInUp}>
                                <Link to="/signup" className="btn-primary">
                                    Book Appointment
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right side - Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={heroImage}
                                    alt="Doctor with stethoscope"
                                    className="w-full h-auto object-cover"
                                    loading="eager"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="card group flex flex-col items-start"
                            >
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <service.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.desc}</p>
                                <Link
                                    to="/appointment"
                                    className="mt-auto inline-flex items-center text-primary font-medium hover:underline"
                                >
                                    Book now <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Ready to get started?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                    >
                        Book your appointment now and experience world‑class healthcare.
                    </motion.p>
                    <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                        Book Appointment
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Services;
