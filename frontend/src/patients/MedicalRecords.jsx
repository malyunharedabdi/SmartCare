import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Activity, Clipboard } from 'lucide-react';

const records = [
    {
        id: 1,
        type: 'Lab Report',
        title: 'Complete Blood Count (CBC)',
        date: '2025-01-05',
        doctor: 'Dr. Fatima Nur',
        status: 'final',
        file: '#',
    },
    {
        id: 2,
        type: 'Prescription',
        title: 'Amoxicillin 500mg',
        date: '2025-01-05',
        doctor: 'Dr. Fatima Nur',
        status: 'active',
        file: '#',
    },
    {
        id: 3,
        type: 'Imaging',
        title: 'Chest X-Ray',
        date: '2024-12-20',
        doctor: 'Dr. Ayaan Ali',
        status: 'final',
        file: '#',
    },
    {
        id: 4,
        type: 'Vaccination',
        title: 'COVID-19 Booster',
        date: '2024-11-15',
        doctor: 'Dr. Omar Abdi',
        status: 'completed',
        file: '#',
    },
];

const MedicalRecords = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Medical Records
            </h1>

            <div className="grid gap-4">
                {records.map((record) => (
                    <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                {record.type === 'Lab Report' ? (
                                    <Activity className="w-5 h-5 text-primary" />
                                ) : record.type === 'Prescription' ? (
                                    <Clipboard className="w-5 h-5 text-primary" />
                                ) : (
                                    <FileText className="w-5 h-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {record.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {record.type} • {record.doctor}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(record.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                                onClick={() => setSelectedRecord(record)}
                                className="btn-secondary text-xs py-1.5 px-3"
                            >
                                <Eye className="w-4 h-4 mr-1" /> View
                            </button>
                            <a
                                href={record.file}
                                className="btn-primary text-xs py-1.5 px-3"
                                download
                            >
                                <Download className="w-4 h-4 mr-1" /> PDF
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal for viewing a record (simplified) */}
            {selectedRecord && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedRecord(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {selectedRecord.title}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {selectedRecord.type} • {selectedRecord.doctor} • {selectedRecord.date}
                        </p>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-300">
                            <p><strong>Status:</strong> {selectedRecord.status}</p>
                            <p className="mt-2">
                                <strong>Details:</strong> This is a placeholder record. Real documents would be displayed here or downloaded via the PDF link.
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedRecord(null)}
                            className="btn-secondary mt-6 w-full"
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default MedicalRecords;