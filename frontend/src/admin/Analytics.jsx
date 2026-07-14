import { useState, useEffect } from 'react';
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
import { patientAPI, doctorAPI, appointmentAPI, billingAPI } from '../services/api';

const COLORS = ['#0096C7', '#00B4E0', '#007A9E', '#4DC9F6', '#A1E0F4', '#0B4F6C'];

const ageBucket = (age) => {
    if (age <= 18) return '0-18';
    if (age <= 35) return '19-35';
    if (age <= 50) return '36-50';
    if (age <= 65) return '51-65';
    return '65+';
};

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [appointmentData, setAppointmentData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [patientAgeData, setPatientAgeData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [summary, setSummary] = useState({ totalPatients: 0, totalAppointments: 0, totalRevenue: 0, pending: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes, appointmentsRes, billsRes] = await Promise.all([
                    patientAPI.getAll(),
                    doctorAPI.getAll(),
                    appointmentAPI.getAll(),
                    billingAPI.getAll(),
                ]);

                const patients = patientsRes.data;
                const doctors = doctorsRes.data;
                const appointments = appointmentsRes.data;
                const bills = billsRes.data;

                // Appointments by month/status
                const apptByMonth = {};
                appointments.forEach((a) => {
                    const month = new Date(a.date).toLocaleString('en-US', { month: 'short' });
                    if (!apptByMonth[month]) apptByMonth[month] = { month, pending: 0, scheduled: 0, completed: 0, cancelled: 0, rejected: 0 };
                    apptByMonth[month][a.status] = (apptByMonth[month][a.status] || 0) + 1;
                });
                setAppointmentData(Object.values(apptByMonth));

                // Revenue by month (paid bills only)
                const revByMonth = {};
                bills
                    .filter((b) => b.payment_status === 'paid' && b.payment_date)
                    .forEach((b) => {
                        const month = new Date(b.payment_date).toLocaleString('en-US', { month: 'short' });
                        revByMonth[month] = (revByMonth[month] || 0) + (b.total_amount || 0);
                    });
                setRevenueData(Object.entries(revByMonth).map(([month, revenue]) => ({ month, revenue })));

                // Patient age distribution
                const ageBuckets = {};
                patients.forEach((p) => {
                    const bucket = ageBucket(p.age);
                    ageBuckets[bucket] = (ageBuckets[bucket] || 0) + 1;
                });
                setPatientAgeData(Object.entries(ageBuckets).map(([name, value]) => ({ name, value })));

                // Appointments by doctor department/specialization
                const deptCounts = {};
                appointments.forEach((a) => {
                    const doctor = doctors.find((d) => d.id === a.doctor_id);
                    const dept = doctor?.department || doctor?.specialization || 'Other';
                    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
                });
                setDepartmentData(Object.entries(deptCounts).map(([name, patients]) => ({ name, patients })));

                setSummary({
                    totalPatients: patients.length,
                    totalAppointments: appointments.length,
                    totalRevenue: bills.filter((b) => b.payment_status === 'paid').reduce((s, b) => s + (b.total_amount || 0), 0),
                    pending: appointments.filter((a) => a.status === 'pending').length,
                });
            } catch (err) {
                console.error('Failed to load analytics data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

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
                    {appointmentData.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No appointment data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={appointmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="completed" fill="#0096C7" />
                                <Bar dataKey="scheduled" fill="#F59E0B" />
                                <Bar dataKey="pending" fill="#3B82F6" />
                                <Bar dataKey="cancelled" fill="#EF4444" />
                                <Bar dataKey="rejected" fill="#B91C1C" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
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
                    {revenueData.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No paid bills yet.</p>
                    ) : (
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
                    )}
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
                    {patientAgeData.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No patients yet.</p>
                    ) : (
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
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Appointments by Department
                    </h2>
                    {departmentData.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No appointment data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                                <Tooltip />
                                <Bar dataKey="patients" fill="#0096C7" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Patients</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{summary.totalPatients}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Appointments</p>
                    <p className="text-3xl font-bold text-primary mt-1">{summary.totalAppointments}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting Approval</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{summary.pending}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="card text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-primary mt-1">${summary.totalRevenue.toFixed(2)}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
