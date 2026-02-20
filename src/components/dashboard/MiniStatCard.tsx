import type { ReactNode } from 'react';

interface MiniStatCardProps {
    label: string;
    value: string;
    icon: ReactNode;
    color: string;
    highlight?: boolean;
}

export const MiniStatCard = ({ label, value, icon, color, highlight = false }: MiniStatCardProps) => {
    const colors: Record<string, string> = {
        primary: 'border-mantty-primary/20 bg-mantty-primary/5',
        blue: 'border-blue-500/20 bg-blue-500/5',
        amber: 'border-amber-500/20 bg-amber-500/5',
        emerald: 'border-emerald-500/20 bg-emerald-500/5',
        red: 'border-red-500/20 bg-red-500/5',
        secondary: 'border-mantty-secondary/20 bg-mantty-secondary/5',
    };

    return (
        <div className={`animate-mantty-slide-up p-4 rounded-2xl border ${colors[color]} backdrop-blur-md transition-all duration-300 hover:scale-105 ${highlight ? 'shadow-lg ring-2 ring-red-500/20' : ''}`}>
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-xl font-black text-slate-900 dark:text-white transition-colors">{value}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 tracking-wider transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">{label}</div>
        </div>
    );
};
