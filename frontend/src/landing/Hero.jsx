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
    Search,
    MapPin,
    CalendarDays,
    PlayCircle,
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
    {
        icon: HeartPulse,
        name: 'Cardiology',
        desc: 'Heart care and surgeries',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: Microscope,
        name: 'Neurology',
        desc: 'Brain and nervous system',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Stethoscope,
        name: 'Orthopedics',
        desc: 'Bone and joint treatment',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Users,
        name: 'Pediatrics',
        desc: 'Children health care',
        image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=600&q=80',
    },
    {
        icon: Shield,
        name: 'ICU & Ophthalmology',
        desc: 'Critical care and eye surgeries',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: HeartPulse,
        name: 'Dentistry',
        desc: 'Dental and oral health',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    },
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
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80';

    return (
        <>
            {/* ═══════════ SECTION 1 : HERO — diagonal split ═══════════ */}
            <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left – Text */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="space-y-8 order-2 lg:order-1"
                        >
                            <motion.div variants={fadeInUp} className="space-y-5">
                                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-dark dark:text-primary-light font-semibold text-sm px-4 py-1.5 rounded-full">
                                    <Stethoscope className="w-4 h-4" />
                                    <span>Welcome to SmartCare</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white">
                                    Combining advanced medical technology with{' '}
                                    <span className="text-primary-dark dark:text-primary-light">experienced care</span>
                                </h1>

                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                                    World-class healthcare with a team of expert doctors, modern facilities,
                                    and compassionate treatment plans built around you.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                                <Link to="/signup" className="btn-primary">
                                    <Calendar className="w-5 h-5" />
                                    Book Appointment
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/services" className="btn-outline">
                                    <PlayCircle className="w-5 h-5" />
                                    Our Services
                                </Link>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-8 pt-2">
                                {[
                                    { value: '500+', label: 'Expert Doctors' },
                                    { value: '50k+', label: 'Happy Patients' },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <div className="text-2xl font-bold text-primary-dark dark:text-primary-light">{s.value}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-8">
                                    <div className="flex -space-x-3">
                                        {testimonials.map((t) => (
                                            <img key={t.name} src={t.image} alt="" className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <Star className="w-4 h-4 fill-primary text-primary" />
                                        4.9 rating
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right – Diagonal image with floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative order-1 lg:order-2"
                        >
                            <div
                                className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden shadow-2xl"
                                style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)', borderRadius: '2rem' }}
                            >
                                <img
                                    src={heroImage}
                                    alt="SmartCare hospital facility"
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 via-transparent to-transparent" />
                            </div>

                            {/* Ambient glow */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/25 rounded-full blur-2xl -z-10" />
                            <div className="absolute -bottom-8 right-4 w-40 h-40 bg-primary/15 rounded-full blur-2xl -z-10" />

                            {/* Floating experience badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="card absolute -bottom-6 -left-4 sm:-left-10 flex items-center gap-3 py-3 px-4 max-w-[220px]"
                            >
                                <div className="w-11 h-11 shrink-0 bg-primary/15 rounded-xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">25+ Years</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Of trusted care</p>
                                </div>
                            </motion.div>

                            {/* Floating availability badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65 }}
                                className="card absolute -top-4 right-2 sm:right-0 flex items-center gap-2 py-2.5 px-3.5"
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                                </span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Open 24/7</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 2 : SEE OUR DEPARTMENTS — bento grid w/ images ═══════════ */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
                    >
                        <div>
                            <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Our Departments</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                                See Our Departments
                            </h2>
                        </div>
                        <Link to="/services" className="inline-flex items-center gap-1 text-primary-dark dark:text-primary-light font-medium hover:underline">
                            View all departments <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] lg:auto-rows-[180px] gap-5 grid-flow-dense"
                    >
                        {services.map((s, idx) => {
                            const spanClasses = [
                                'col-span-2 row-span-2',   // 0 Cardiology - featured
                                'col-span-1 row-span-1',   // 1 Neurology
                                'col-span-1 row-span-1',   // 2 Orthopedics
                                'col-span-1 row-span-2',   // 3 Pediatrics - tall
                                'col-span-2 row-span-1',   // 4 ICU & Ophthalmology - wide
                                'col-span-1 row-span-1',   // 5 Dentistry
                            ];
                            const isFeatured = idx === 0;

                            return (
                                <motion.div
                                    key={s.name}
                                    variants={fadeInUp}
                                    className={`group relative overflow-hidden rounded-2xl shadow-md ${spanClasses[idx % spanClasses.length]}`}
                                >
                                    {/* background image */}
                                    <img
                                        src={s.image}
                                        alt={s.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {/* gradient overlay for legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/0" />

                                    {/* icon badge */}
                                    <div
                                        className={`absolute top-4 left-4 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 ${isFeatured ? 'w-12 h-12' : 'w-10 h-10'
                                            }`}
                                    >
                                        <s.icon className={`text-white ${isFeatured ? 'w-6 h-6' : 'w-5 h-5'}`} />
                                    </div>

                                    {/* text content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                        <h3 className={`font-semibold text-white ${isFeatured ? 'text-xl mb-1' : 'text-base mb-0.5'}`}>
                                            {s.name}
                                        </h3>
                                        <p className={`text-white/80 ${isFeatured ? 'text-sm mb-2' : 'text-xs mb-1.5 line-clamp-1'}`}>
                                            {s.desc}
                                        </p>
                                        <Link
                                            to="/services"
                                            className="inline-flex items-center text-white text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                                        >
                                            Learn more <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ SECTION 3 : FIND A DOCTOR — search band ═══════════ */}
            <section className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card grid grid-cols-1 sm:grid-cols-3 gap-4 items-end p-6"
                    >
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                                <Search className="w-3.5 h-3.5" /> Specialty
                            </label>
                            <input type="text" placeholder="e.g. Cardiology" className="input-field" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                                <MapPin className="w-3.5 h-3.5" /> Location
                            </label>
                            <input type="text" placeholder="Nearest hospital" className="input-field" />
                        </div>
                        <Link to="/signup" className="btn-primary w-full justify-center">
                            <CalendarDays className="w-5 h-5" />
                            Find a Doctor
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════ SECTION 4 : WHY CHOOSE US ═══════════ */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Why SmartCare</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-3">
                            Care built around <span className="text-primary-dark dark:text-primary-light">you</span>
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
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                    <f.icon className="w-6 h-6 text-primary-dark dark:text-primary-light" />
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

            {/* ═══════════ SECTION 5 : SERVICES OVERVIEW ═══════════ */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">What We Offer</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-3">
                            Our Services
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
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                    <s.icon className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {s.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{s.desc}</p>
                                <Link
                                    to="/services"
                                    className="mt-auto inline-flex items-center text-primary-dark dark:text-primary-light text-sm font-medium hover:underline"
                                >
                                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 6 : STATS ═══════════ */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card grid grid-cols-2 lg:grid-cols-4 gap-6 text-center py-10">
                        {stats.map((s, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-1"
                            >
                                <div className="w-12 h-12 mx-auto bg-primary/15 rounded-xl flex items-center justify-center mb-1">
                                    <s.icon className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SECTION 7 : TESTIMONIALS ═══════════ */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Testimonials</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                            What Our Patients Say
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

            {/* ═══════════ SECTION 8 : CTA ═══════════ */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="card py-12 px-6">
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
                </div>
            </section>
        </>
    );
};

export default Hero;