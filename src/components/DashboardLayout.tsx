import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LogOut,
    HousePlus,
    LayoutDashboard,
    PlusCircle,
    Bell,
    Settings,
    Users,
    ChevronRight,
    Menu,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { NotificationBell } from './NotificationBell';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { role, plan, signOut, user, extraUhCapacity } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Resumen', path: '/dashboard' },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Nueva Solicitud', path: '/dashboard/new' },
        ...(role === 'admin_uh' || role === 'superadmin' ? [
            { icon: <Users className="w-5 h-5" />, label: 'Usuarios', path: '/dashboard/users' }
        ] : []),
        { icon: <Bell className="w-5 h-5" />, label: 'Alertas', path: '/dashboard/alerts' },
        { icon: <Settings className="w-5 h-5" />, label: 'Configuración', path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex overflow-hidden transition-colors duration-500">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 p-8 flex-col shrink-0">
                <NavLink to="/" className="flex items-center gap-4 mb-14 px-2 hover:opacity-80 transition-opacity">
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

                <div className="pt-8 mt-8 border-t border-slate-200 dark:border-white/5">
                    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-5 border border-slate-200 dark:border-white/5 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-mantty-primary font-black text-lg border border-slate-100 dark:border-white/5">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email?.split('@')[0]}</p>
                                <p className="text-[11px] text-slate-500 font-medium capitalize">
                                    {role === 'admin_uh' ? 'Administrador UH' :
                                        role === 'residente' ? 'Residente' :
                                            role === 'proveedor' ? 'Proveedor Técnico' :
                                                role === 'superadmin' ? 'Super Administrador' : 'Usuario'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className={`flex-1 text-[10px] text-center uppercase tracking-widest font-black px-2 py-1.5 rounded-xl ${role === 'admin_uh' ? 'text-mantty-primary bg-mantty-primary/10' :
                                    role === 'residente' ? 'text-emerald-600 bg-emerald-100' :
                                        role === 'proveedor' ? 'text-amber-600 bg-amber-100' :
                                            'text-slate-500 bg-slate-100'
                                }`}>
                                {role === 'admin_uh' ? 'ADMIN' :
                                    role === 'residente' ? 'RESIDENTE' :
                                        role === 'proveedor' ? 'PRO' : role?.toUpperCase()}
                            </span>
                            <span className="flex-1 text-[10px] text-center uppercase tracking-widest font-black text-mantty-accent px-2 py-1.5 bg-mantty-accent/10 rounded-xl">
                                Plan {plan} {extraUhCapacity > 0 && `+${extraUhCapacity} UH`}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-mantty-primary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-black uppercase tracking-widest"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                        </button>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all text-sm font-bold"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <div className="lg:hidden fixed top-0 left-0 w-full z-50 glassmorphism border-b border-slate-200 dark:border-white/5 px-6 py-4 flex justify-between items-center">
                <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 mantty-gradient rounded-lg flex items-center justify-center">
                        <HousePlus className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white">Mantty</span>
                </NavLink>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 text-slate-400 hover:text-mantty-primary transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <NotificationBell />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto pt-20 lg:pt-0">
                {/* Top Desktop Actions */}
                <div className="hidden lg:flex fixed top-8 right-8 z-40 items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-mantty-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <NotificationBell />
                </div>

                <div className="p-6 lg:p-12 lg:pt-24 max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
