import { NavLink } from 'react-router';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    CalendarCheck,
    BarChart3,
    Receipt,
    Settings,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/patients', icon: Users, label: 'Patients' },
    { to: '/admin/doctors', icon: UserPlus, label: 'Doctors' },
    { to: '/admin/appointments', icon: CalendarCheck, label: 'Appointments' },
    { to: '/admin/payments', icon: Receipt, label: 'Payments' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

const AdminSidebar = () => {
    const { logout } = useAuth();

    return (
        <aside className="w-64 glass-panel border-r border-white/40 dark:border-white/5 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors w-full px-4 py-2 rounded-lg text-sm font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
