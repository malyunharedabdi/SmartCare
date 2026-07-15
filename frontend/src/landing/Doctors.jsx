import { motion } from 'framer-motion';
import { Stethoscope, Mail, Phone } from 'lucide-react';

const doctors = [
    {
        name: 'Dr. Ayaan Ali',
        gender: 'Female',
        specialization: 'Cardiologist',
        experience: '12 years',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Dr. Mohamed Hassan',
        gender: 'Male',
        specialization: 'Neurologist',
        experience: '15 years',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Dr. Fatima Nur',
        gender: 'Female',
        specialization: 'Pediatrician',
        experience: '10 years',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Dr. Ahmed Abdullahi',
        gender: 'Male',
        specialization: 'Orthopedic Surgeon',
        experience: '18 years',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Dr. Halima Yusuf',
        gender: 'Female',
        specialization: 'Dermatologist',
        experience: '8 years',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    },
    {
        name: 'Dr. Omar Abdi',
        gender: 'Male',
        specialization: 'Ophthalmologist',
        experience: '14 years',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

const Doctors = () => {
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
                        Our Doctors
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Meet our team of dedicated Somali healthcare professionals.
                    </motion.p>
                </div>
            </section>

            {/* Doctors Grid */}
            <section className="py-20 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {doctors.map((doctor, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="card group text-center"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                    {doctor.name}
                                </h3>
                                <p className="text-primary font-medium mb-1">{doctor.specialization}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{doctor.experience} experience</p>
                                <div className="flex justify-center gap-3">
                                    <span className="inline-flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                        <Phone className="w-4 h-4 mr-1" />
                                        <span className="text-xs">Call</span>
                                    </span>
                                    <span className="inline-flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                        <Mail className="w-4 h-4 mr-1" />
                                        <span className="text-xs">Email</span>
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Doctors;
