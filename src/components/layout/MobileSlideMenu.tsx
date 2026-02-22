import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    X,
    ChevronRight,
    Sun,
    Moon,
    LogOut
} from 'lucide-react';
import { UserCard } from './UserCard';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

interface MobileSlideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
}

export const MobileSlideMenu: React.FC<MobileSlideMenuProps> = ({ isOpen, onClose, menuItems }) => {
    const { signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in-fast"
                onClick={onClose}
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
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white active:bg-slate-100 dark:active:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Card */}
                <UserCard variant="mobile" />

                {/* Navigation Links */}
                <nav className="px-4 pb-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = item.path === '/dashboard'
                            ? location.pathname === '/dashboard'
                            : location.pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.path}
                                onClick={() => { navigate(item.path); onClose(); }}
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
                        onClick={() => { signOut(); onClose(); }}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-[0.98]"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
