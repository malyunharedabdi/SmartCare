import { Outlet } from 'react-router';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="pt-16 flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <AdminSidebar />
            <main className="flex-1 p-6 lg:p-10 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;