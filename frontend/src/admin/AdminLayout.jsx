import { Outlet } from 'react-router';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen transition-colors">
            <AdminSidebar />
            <main className="flex-1 p-6 lg:p-10 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
