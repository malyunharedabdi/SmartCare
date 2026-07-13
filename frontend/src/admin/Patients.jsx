import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, UserX } from 'lucide-react';

const initialPatients = [
    { id: 1, name: 'Ayaan Ali', age: 30, gender: 'Female', phone: '+252 61 234 5678', email: 'ayaan@example.com' },
    { id: 2, name: 'Mohamed Hassan', age: 45, gender: 'Male', phone: '+252 61 987 6543', email: 'mohamed@example.com' },
    { id: 3, name: 'Fatima Nur', age: 28, gender: 'Female', phone: '+252 61 555 1234', email: 'fatima@example.com' },
    { id: 4, name: 'Ahmed Abdullahi', age: 52, gender: 'Male', phone: '+252 61 111 2222', email: 'ahmed@example.com' },
    { id: 5, name: 'Halima Yusuf', age: 35, gender: 'Female', phone: '+252 61 333 4444', email: 'halima@example.com' },
];

const Patients = () => {
    const [patients, setPatients] = useState(initialPatients);
    const [search, setSearch] = useState('');

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
    );

    const deletePatient = (id) => {
        if (window.confirm('Delete this patient?')) {
            setPatients(patients.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Manage Patients
                </h1>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="py-3 pr-4">Name</th>
                            <th className="py-3 pr-4">Age</th>
                            <th className="py-3 pr-4">Gender</th>
                            <th className="py-3 pr-4">Phone</th>
                            <th className="py-3 pr-4">Email</th>
                            <th className="py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    <UserX className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                    No patients found
                                </td>
                            </tr>
                        )}
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">{patient.name}</td>
                                <td className="py-3 pr-4">{patient.age}</td>
                                <td className="py-3 pr-4">{patient.gender}</td>
                                <td className="py-3 pr-4">{patient.phone}</td>
                                <td className="py-3 pr-4">{patient.email}</td>
                                <td className="py-3">
                                    <button
                                        onClick={() => deletePatient(patient.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patients;