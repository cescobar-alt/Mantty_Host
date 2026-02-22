import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users, Settings, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ClipboardList, label: 'Solicitudes', path: '/dashboard/requests' },
        { icon: PlusCircle, label: 'Nuevo', path: '/dashboard/new' },
        ...(role === 'admin_uh' || role === 'superadmin'
            ? [{ icon: Users, label: 'Usuarios', path: '/dashboard/users' }]
            : []),
        { icon: Settings, label: 'Config', path: '/dashboard/settings' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = item.path === '/dashboard'
                        ? location.pathname === '/dashboard'
                        : location.pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{ touchAction: 'manipulation' }}
                            className={`flex flex-col items-center justify-center gap-1 min-w-[48px] min-h-[48px] w-full h-full transition-all relative ${isActive
                                ? 'text-mantty-primary'
                                : 'text-slate-400 dark:text-slate-500 active:scale-90'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-mantty-primary/10' : ''}`}>
                                <Icon className={`w-6 h-6 ${isActive ? 'animate-mantty-pulse' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-1 bg-mantty-primary rounded-b-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

