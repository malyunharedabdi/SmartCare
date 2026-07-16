import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
    Stethoscope,
    Award,
    Users,
    Heart,
    Target,
    Eye,
    ArrowRight,
    Building2,
    Sparkles,
} from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

const values = [
    { icon: Heart, title: 'Compassion', desc: 'We treat every patient with empathy and respect.' },
    { icon: Award, title: 'Excellence', desc: 'World-class medical standards, continuously improved.' },
    { icon: Users, title: 'Community', desc: 'Serving our community with dedication for 25+ years.' },
    { icon: Stethoscope, title: 'Innovation', desc: 'Advanced technology for accurate diagnosis.' },
];

const milestones = [
    { year: '1998', label: 'SmartCare founded' },
    { year: '2008', label: 'First regional hospital opened' },
    { year: '2016', label: 'Telemedicine platform launched' },
    { year: '2024', label: 'Digital patient portal, 50k+ patients' },
];

const About = () => {
    const teamImage = 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=900&q=80';
    const buildingImage = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=700&q=80';
    const surgeryImage = 'https://images.unsplash.com/photo-1640876777012-bdb00a6323e2?auto=format&fit=crop&w=700&q=80';

    return (
        <div>
            {/* Hero Banner */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-dark dark:text-primary-light font-semibold text-sm px-4 py-1.5 rounded-full mb-5"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>About SmartCare</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
                    >
                        Care that puts <span className="text-primary-dark dark:text-primary-light">people first</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Dedicated to providing exceptional healthcare for you and your family since 1998.
                    </motion.p>
                </div>
            </section>

            {/* Bento grid: mission, vision, images, milestones */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-2 gap-5 auto-rows-[13rem]"
                    >
                        {/* Big team photo */}
                        <motion.div
                            variants={fadeInUp}
                            className="relative overflow-hidden rounded-3xl lg:col-span-3 lg:row-span-2 border border-white/50 dark:border-white/10 shadow-lg"
                        >
                            <img src={teamImage} alt="Our medical team" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <h3 className="text-white font-bold text-2xl">Our Team</h3>
                                <p className="text-white/80 text-sm mt-1 max-w-xs">
                                    500+ doctors and specialists working together for you.
                                </p>
                            </div>
                        </motion.div>

                        {/* Mission */}
                        <motion.div variants={fadeInUp} className="card lg:col-span-3 flex flex-col justify-center">
                            <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center mb-3">
                                <Target className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Deliver accessible, high-quality healthcare that improves lives through
                                compassion, innovation, and clinical excellence.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div variants={fadeInUp} className="card lg:col-span-2 flex flex-col justify-center">
                            <div className="w-11 h-11 bg-primary/15 rounded-xl flex items-center justify-center mb-3">
                                <Eye className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Our Vision</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                A future where quality care is within everyone's reach.
                            </p>
                        </motion.div>

                        {/* Surgery image cell */}
                        <motion.div
                            variants={fadeInUp}
                            className="relative overflow-hidden rounded-3xl lg:col-span-1 border border-white/50 dark:border-white/10 shadow-lg"
                        >
                            <img src={surgeryImage} alt="Advanced surgery" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-black/25" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">What Drives Us</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                            Our Values
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {values.map((item, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="card group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-6 h-6 text-primary-dark dark:text-primary-light" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Milestones + building photo */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]"
                        >
                            <img src={buildingImage} alt="SmartCare facility" className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-primary/20 rounded-full blur-2xl -z-10" />
                        </motion.div>

                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
                                <Building2 className="w-5 h-5 text-primary-dark dark:text-primary-light" />
                                <span className="text-primary-dark dark:text-primary-light font-semibold text-sm">Our Journey</span>
                            </motion.div>
                            {milestones.map((m) => (
                                <motion.div key={m.year} variants={fadeInUp} className="card flex items-center gap-4 py-3">
                                    <div className="text-lg font-bold text-primary-dark dark:text-primary-light w-16 shrink-0">{m.year}</div>
                                    <div className="text-gray-700 dark:text-gray-300 text-sm">{m.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="card py-12 px-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Join the SmartCare family
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Experience healthcare built around you.
                        </p>
                        <Link to="/signup" className="btn-primary text-base px-6 py-3">
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
