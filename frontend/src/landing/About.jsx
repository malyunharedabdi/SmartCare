// src/landing/About.jsx
import { motion } from 'framer-motion';
import { Stethoscope, Award, Users, Heart } from 'lucide-react';

const About = () => {
    const aboutImage =
        'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80';

    const values = [
        { icon: Heart, title: 'Compassion', desc: 'We treat every patient with empathy and respect.' },
        { icon: Award, title: 'Excellence', desc: 'World‑class medical standards and continuous improvement.' },
        { icon: Users, title: 'Community', desc: 'Serving our community with dedication for over 25 years.' },
        { icon: Stethoscope, title: 'Innovation', desc: 'Advanced technology for accurate diagnosis and treatment.' },
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.15 } },
    };

    return (
        <div className="pt-16">
            {/* Hero Banner */}
            <section className="bg-primary text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl font-bold mb-4"
                    >
                        About SmartCare
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/90 max-w-2xl mx-auto"
                    >
                        Dedicated to providing exceptional healthcare for you and your family since 1998.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision – 50/50 */}
            <section className="py-20 bg-white dark:bg-black transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="space-y-6"
                        >
                            <motion.h2
                                variants={fadeInUp}
                                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
                            >
                                Our <span className="text-primary">Mission</span>
                            </motion.h2>
                            <motion.p
                                variants={fadeInUp}
                                className="text-lg text-gray-600 dark:text-gray-400"
                            >
                                To deliver accessible, high‑quality healthcare that improves the lives of our patients
                                through compassion, innovation, and clinical excellence. We believe every individual
                                deserves personalised care in a safe and welcoming environment.
                            </motion.p>
                            <motion.p
                                variants={fadeInUp}
                                className="text-lg text-gray-600 dark:text-gray-400"
                            >
                                From routine check‑ups to advanced surgical procedures, our multidisciplinary team
                                works together to ensure the best possible outcomes. Your health is not just our job –
                                it's our calling.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={aboutImage}
                                    alt="Doctor with stethoscope"
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Our <span className="text-primary">Values</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {values.map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="card flex gap-4"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;