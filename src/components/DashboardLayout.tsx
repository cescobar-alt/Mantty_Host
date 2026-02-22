import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    PlusCircle,
    Bell,
    Settings,
    Users,
    ClipboardList,
    Sun,
    Moon,
    User
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { BottomNavigation } from './BottomNavigation';
import { MobileFAB } from './dashboard/MobileFAB';
import { DesktopSidebar } from './layout/DesktopSidebar';
import { MobileTopBar } from './layout/MobileTopBar';
import { MobileSlideMenu } from './layout/MobileSlideMenu';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { role } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();

    // Close menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open (iOS-safe)
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.overscrollBehavior = 'none';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.overscrollBehavior = '';
            if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.overscrollBehavior = '';
        };
    }, [isMobileMenuOpen]);

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
        { icon: <ClipboardList className="w-5 h-5" />, label: 'Solicitudes', path: '/dashboard/requests' },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Nueva Solicitud', path: '/dashboard/new' },
        ...(role === 'admin_uh' || role === 'superadmin' ? [
            { icon: <Users className="w-5 h-5" />, label: 'Usuarios', path: '/dashboard/users' }
        ] : []),
        { icon: <Bell className="w-5 h-5" />, label: 'Alertas', path: '/dashboard/alerts' },
        { icon: <User className="w-5 h-5" />, label: 'Mi Perfil', path: '/dashboard/profile' },
        { icon: <Settings className="w-5 h-5" />, label: 'Configuración', path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex overflow-hidden transition-colors duration-500">
            {/* Desktop Sidebar */}
            <DesktopSidebar menuItems={menuItems} />

            {/* Mobile Top Bar */}
            <MobileTopBar />

            {/* Mobile Slide-over Menu */}
            <MobileSlideMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                menuItems={menuItems}
            />

            {/* Main Content Area */}
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
