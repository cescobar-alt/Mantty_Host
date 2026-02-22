import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getRoleLabel, getRoleBadge } from '../../lib/business-rules';
import {
    Sun,
    Moon,
    LogOut,
    ChevronDown
} from 'lucide-react';
import React from 'react';

interface UserCardProps {
    variant: 'sidebar' | 'mobile';
}

export const UserCard: React.FC<UserCardProps> = ({ variant }) => {
    const { role, plan, signOut, user, extraUhCapacity } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isExpanded, setIsExpanded] = React.useState(false);

    const roleBadge = getRoleBadge(role);

    if (variant === 'mobile') {
        return (
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
        );
    }

    // Sidebar variant
    return (
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-white/5">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
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
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isExpanded && (
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
    );
};
