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
    ChevronDown,
    X,
    Sun,
    Moon
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { NotificationBell } from './NotificationBell';
import { BottomNavigation } from './BottomNavigation';
import { MobileFAB } from './dashboard/MobileFAB';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { role, plan, signOut, user, extraUhCapacity } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Close menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Resumen', path: '/dashboard' },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Nueva Solicitud', path: '/dashboard/new' },
        ...(role === 'admin_uh' || role === 'superadmin' ? [
            { icon: <Users className="w-5 h-5" />, label: 'Usuarios', path: '/dashboard/users' }
        ] : []),
        { icon: <Bell className="w-5 h-5" />, label: 'Alertas', path: '/dashboard/alerts' },
        { icon: <Settings className="w-5 h-5" />, label: 'Configuración', path: '/dashboard/settings' },
    ];


    const getRoleLabel = (r: string | null | undefined) => {
        switch (r) {
            case 'admin_uh': return 'Administrador UH';
            case 'residente': return 'Residente';
            case 'proveedor': return 'Proveedor Técnico';
            case 'superadmin': return 'Super Administrador';
            default: return 'Usuario';
        }
    };

    const getRoleBadge = (r: string | null | undefined) => {
        switch (r) {
            case 'admin_uh': return { text: 'ADMIN', classes: 'text-mantty-primary bg-mantty-primary/10' };
            case 'residente': return { text: 'RESIDENTE', classes: 'text-emerald-600 bg-emerald-100' };
            case 'proveedor': return { text: 'PRO', classes: 'text-amber-600 bg-amber-100' };
            default: return { text: r?.toUpperCase() || 'USER', classes: 'text-slate-500 bg-slate-100' };
        }
    };

    const roleBadge = getRoleBadge(role);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex overflow-hidden transition-colors duration-500">
            {/* =================== Desktop Sidebar =================== */}
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
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-5 border border-slate-200 dark:border-white/5 mb-4 text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-800/80 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-mantty-primary font-black text-lg border border-slate-100 dark:border-white/5 shadow-sm">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email?.split('@')[0]}</p>
                                <p className="text-[11px] text-slate-500 font-medium capitalize">
                                    {getRoleLabel(role)}
                                </p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {isUserMenuOpen && (
                        <div className="space-y-3 px-2 mb-6 animate-mantty-slide-up">
                            <div className="flex gap-2">
                                <span className={`flex-1 text-[10px] text-center uppercase tracking-widest font-black px-2 py-1.5 rounded-xl ${roleBadge.classes}`}>
                                    {roleBadge.text}
                                </span>
                                <span className="flex-1 text-[10px] text-center uppercase tracking-widest font-black text-mantty-accent px-2 py-1.5 bg-mantty-accent/10 rounded-xl">
                                    Plan {plan} {extraUhCapacity > 0 && `+${extraUhCapacity} UH`}
                                </span>
                            </div>
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-mantty-primary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-black uppercase tracking-widest"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all text-sm font-bold"
                            >
                                <LogOut className="w-5 h-5" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* =================== Mobile Top Bar =================== */}
            <div className="lg:hidden fixed top-0 left-0 w-full z-50 glassmorphism border-b border-slate-200 dark:border-white/5 px-4 py-3 flex justify-between items-center safe-area-top">
                <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 mantty-gradient rounded-lg flex items-center justify-center">
                        <HousePlus className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">Mantty</span>
                </NavLink>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-3 rounded-xl text-slate-400 hover:text-mantty-primary transition-colors active:bg-slate-100 dark:active:bg-white/10"
                        aria-label="Cambiar tema"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <NotificationBell />
                </div>
            </div>

            {/* =================== Mobile Slide-over Menu =================== */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[60]">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in-fast"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    {/* Panel */}
                    <div className="absolute bottom-0 left-0 right-0 glassmorphism rounded-t-[2rem] max-h-[85vh] overflow-y-auto animate-slide-up-panel safe-area-bottom shadow-2xl">
                        {/* Handle bar */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                        </div>

                        {/* Close button */}
                        <div className="flex justify-between items-center px-6 pb-4">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Menú</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white active:bg-slate-100 dark:active:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Card */}
                        <div className="mx-6 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-mantty-primary font-black text-xl border border-slate-100 dark:border-white/5">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email?.split('@')[0]}</p>
                                    <p className="text-xs text-slate-500 font-medium">{getRoleLabel(role)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <span className={`flex-1 text-[10px] text-center uppercase tracking-widest font-black px-2 py-1.5 rounded-xl ${roleBadge.classes}`}>
                                    {roleBadge.text}
                                </span>
                                <span className="flex-1 text-[10px] text-center uppercase tracking-widest font-black text-mantty-accent px-2 py-1.5 bg-mantty-accent/10 rounded-xl">
                                    Plan {plan} {extraUhCapacity > 0 && `+${extraUhCapacity} UH`}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="px-4 pb-4 space-y-1">
                            {menuItems.map((item) => {
                                const isActive = item.path === '/dashboard'
                                    ? location.pathname === '/dashboard'
                                    : location.pathname.startsWith(item.path);

                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left active:scale-[0.98] ${isActive
                                            ? 'bg-mantty-primary/10 text-mantty-primary font-bold'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-semibold text-[15px]">{item.label}</span>
                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Actions */}
                        <div className="px-6 pt-4 pb-6 border-t border-slate-100 dark:border-white/5 space-y-3">
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-all active:scale-[0.98]"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                <span className="font-semibold text-sm">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                            </button>
                            <button
                                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-[0.98]"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-semibold text-sm">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =================== Main Content Area =================== */}
            <div className="flex-1 h-screen overflow-y-auto pt-16 pb-20 lg:pt-0 lg:pb-0">
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

                <div className="px-4 py-6 lg:p-12 lg:pt-24 max-w-7xl mx-auto pb-32 lg:pb-12">
                    {children}
                </div>
            </div>

            <BottomNavigation />
            <MobileFAB />
        </div>
    );
};

export default DashboardLayout;
