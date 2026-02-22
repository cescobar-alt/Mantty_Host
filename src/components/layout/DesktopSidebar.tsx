import { NavLink, useLocation } from 'react-router-dom';
import {
    HousePlus,
    ChevronRight,
} from 'lucide-react';
import { UserCard } from './UserCard';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

interface DesktopSidebarProps {
    menuItems: MenuItem[];
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ menuItems }) => {
    const location = useLocation();

    return (
        <aside className="hidden lg:flex w-72 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-8 flex-col shrink-0">
            <NavLink to="/dashboard" className="flex items-center gap-4 mb-14 px-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 mantty-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-mantty-primary/20">
                    <HousePlus className="text-white w-6 h-6" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight">Mantty</span>
            </NavLink>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => `
                flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
                ${isActive
                                ? 'bg-mantty-primary/15 text-mantty-primary border border-mantty-primary/20 shadow-lg shadow-mantty-primary/5'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-mantty-primary dark:hover:text-white border border-transparent'}
              `}
                    >
                        <div className="flex items-center gap-4">
                            {item.icon}
                            <span className="font-semibold text-[15px]">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${location.pathname === item.path ? 'opacity-100' : 'opacity-0'
                            }`} />
                    </NavLink>
                ))}
            </nav>

            <UserCard variant="sidebar" />
        </aside>
    );
};
