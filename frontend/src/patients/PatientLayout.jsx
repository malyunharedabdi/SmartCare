import { Outlet } from 'react-router';
import PatientSidebar from '../components/PatientSidebar';

const PatientLayout = () => {
    return (
        <div className="flex min-h-screen transition-colors">
            <PatientSidebar />
            <main className="flex-1 p-6 lg:p-10 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;
