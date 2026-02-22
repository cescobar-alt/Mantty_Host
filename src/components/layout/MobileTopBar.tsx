import { NavLink } from 'react-router-dom';
import { HousePlus, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NotificationBell } from '../NotificationBell';

export const MobileTopBar = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="lg:hidden fixed top-0 left-0 w-full z-50 glassmorphism border-b border-slate-200 dark:border-white/5 px-4 py-3 flex justify-between items-center safe-area-top">
            <NavLink to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
    );
};
