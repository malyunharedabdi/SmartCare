import { Outlet } from 'react-router';
import PatientSidebar from '../components/PatientSidebar';

const PatientLayout = () => {
    return (
        <div className="pt-16 flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <PatientSidebar />
            <main className="flex-1 p-6 lg:p-10 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;