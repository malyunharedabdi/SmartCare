import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    Heart,
    Brain,
    Bone,
    Baby,
    Eye,
    Stethoscope,
    Microscope,
    Activity,
    Shield,
    Syringe,
    ArrowRight,
    CalendarPlus,
    CheckCircle2,
    PhoneCall,
    ClipboardList,
    UserCheck,
} from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

/* Featured departments — shown as alternating image/text rows */
const featured = [
    {
        icon: Heart,
        name: 'Cardiology',
        desc: 'Complete heart care — from ECGs and stress tests to angioplasty and cardiac surgery, delivered by a team that treats your heart like their own.',
        points: ['24/7 cardiac emergency unit', 'Non-invasive & surgical treatment', 'Ongoing rehab & monitoring'],
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: Brain,
        name: 'Neurology',
        desc: 'Advanced diagnosis and treatment for the brain, spine and nervous system, from migraines to complex neurological disorders.',
        points: ['MRI & CT-guided diagnostics', 'Stroke fast-track protocol', 'Epilepsy & movement disorder clinics'],
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: Baby,
        name: 'Pediatrics',
        desc: 'Gentle, compassionate care for infants, children and teens — with a child-friendly ward designed to put little ones at ease.',
        points: ['Newborn & wellness checks', 'Full immunisation programs', 'Child-friendly play ward'],
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=900&q=80',
    },
];

/* Quick-access specialties — simple icon grid (deliberately not a bento) */
const quickServices = [
    { icon: Bone, name: 'Orthopedics', desc: 'Bone, joint & spine care' },
    { icon: Eye, name: 'Ophthalmology', desc: 'Eye exams & laser surgery' },
    { icon: Stethoscope, name: 'General Medicine', desc: 'Primary care for all ages' },
    { icon: Microscope, name: 'Laboratory', desc: 'Fast, accurate diagnostics' },
    { icon: Activity, name: 'Emergency', desc: '24/7 rapid response' },
    { icon: Shield, name: 'Vaccination', desc: 'Immunisation programs' },
    { icon: Syringe, name: 'Dermatology', desc: 'Skin, hair & nail care' },
    { icon: UserCheck, name: "Women's Health", desc: 'Gynecology & maternity' },
];

const steps = [
    { icon: ClipboardList, title: 'Tell us your symptoms', desc: 'Use our symptom checker or pick a department yourself.' },
    { icon: UserCheck, title: 'We match a specialist', desc: 'Get paired with the right doctor for your condition.' },
    { icon: CalendarPlus, title: 'Book your slot', desc: 'Choose a date and time that works for you.' },
    { icon: PhoneCall, title: 'Get confirmed', desc: 'Receive confirmation and reminders before your visit.' },
];

const Services = () => {
    const heroImage =
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80';

    return (
        <div>
            {/* ============ HERO — full-bleed image fading into text ============ */}
            <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
                <img
                    src={heroImage}
                    alt="SmartCare hospital corridor"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                />
                {/* fade from solid at the bottom (where text sits) to transparent at the top */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#10231a] via-[#10231a]/70 to-[#10231a]/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#10231a]/60 via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="max-w-2xl space-y-5"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white font-semibold text-sm px-4 py-1.5 rounded-full"
                        >
                            <Stethoscope className="w-4 h-4" />
                            <span>Everything under one roof</span>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                            Our Services
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-white/85">
                            Comprehensive medical services delivered by experienced specialists — from routine
                            check-ups to complex surgeries, we're with you every step of the way.
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link to="/signup" className="btn-primary">
                                <CalendarPlus className="w-5 h-5" />
                                Book an Appointment
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ============ FEATURED DEPARTMENTS — zigzag alternating rows ============ */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Featured Departments</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                            Deep expertise where it matters most
                        </h2>
                    </motion.div>

                    {featured.map((dept, idx) => {
                        const reversed = idx % 2 === 1;
                        return (
                            <div
                                key={dept.name}
                                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: reversed ? 30 : -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]"
                                >
                                    <img src={dept.image} alt={dept.name} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute top-4 left-4 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center">
                                        <dept.icon className="w-7 h-7 text-white" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: reversed ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{dept.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">{dept.desc}</p>
                                    <ul className="space-y-2">
                                        {dept.points.map((point) => (
                                            <li key={point} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <CheckCircle2 className="w-5 h-5 text-primary-dark dark:text-primary-light shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center gap-1 text-primary-dark dark:text-primary-light font-medium hover:underline pt-1"
                                    >
                                        Book with {dept.name} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ============ QUICK-ACCESS SPECIALTIES — simple icon grid ============ */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">More Specialties</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                            Every department you'd expect
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-2 md:grid-cols-4 gap-5"
                    >
                        {quickServices.map((service) => (
                            <motion.div
                                key={service.name}
                                variants={fadeInUp}
                                className="card group text-center py-8"
                            >
                                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                    <service.icon className="w-7 h-7 text-primary-dark dark:text-primary-light" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{service.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============ HOW IT WORKS — horizontal step timeline ============ */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Getting Care</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                            How booking works
                        </h2>
                    </motion.div>

                    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-primary/25" />
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative text-center"
                            >
                                <div className="relative z-10 w-[72px] h-[72px] mx-auto bg-white dark:bg-gray-900 border-2 border-primary/30 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                                    <step.icon className="w-7 h-7 text-primary-dark dark:text-primary-light" />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="card py-14 px-6">
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
                            Book your appointment now and experience world-class healthcare.
                        </motion.p>
                        <Link to="/signup" className="btn-primary text-lg px-8 py-4 inline-flex">
                            <CalendarPlus className="w-5 h-5" />
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;

