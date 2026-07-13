import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';

const appointmentData = [
    { month: 'Jan', completed: 40, cancelled: 24, pending: 18 },
    { month: 'Feb', completed: 30, cancelled: 13, pending: 22 },
    { month: 'Mar', completed: 20, cancelled: 8, pending: 27 },
    { month: 'Apr', completed: 27, cancelled: 18, pending: 15 },
    { month: 'May', completed: 18, cancelled: 9, pending: 30 },
    { month: 'Jun', completed: 23, cancelled: 15, pending: 19 },
];

const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4780 },
    { month: 'May', revenue: 5890 },
    { month: 'Jun', revenue: 4390 },
];

const patientAgeData = [
    { name: '0-18', value: 400 },
    { name: '19-35', value: 300 },
    { name: '36-50', value: 300 },
    { name: '51-65', value: 200 },
    { name: '65+', value: 100 },
];

const departmentData = [
    { name: 'Cardiology', patients: 120 },
    { name: 'Neurology', patients: 90 },
    { name: 'Pediatrics', patients: 150 },
    { name: 'Orthopedics', patients: 80 },
    { name: 'Dermatology', patients: 70 },
    { name: 'Ophthalmology', patients: 60 },
];

const COLORS = ['#0096C7', '#00B4E0', '#007A9E', '#4DC9F6', '#A1E0F4', '#0B4F6C'];

const Analytics = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics & Reports
            </h1>

            {/* Row 1: Appointments Bar Chart + Revenue Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Appointments Overview
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={appointmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" fill="#0096C7" />
                            <Bar dataKey="cancelled" fill="#EF4444" />
                            <Bar dataKey="pending" fill="#F59E0B" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Revenue Trend
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0096C7"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#0096C7' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Row 2: Patient Age Pie + Department Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Patient Age Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={patientAgeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {patientAgeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Patients by Department
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" />
                            <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                            <Tooltip />
                            <Bar dataKey="patients" fill="#0096C7" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Row 3: Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Wait Time</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">12 min</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Patient Satisfaction</p>
                    <p className="text-3xl font-bold text-primary mt-1">96%</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Readmission Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">3.2%</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bed Occupancy</p>
                    <p className="text-3xl font-bold text-primary mt-1">78%</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;