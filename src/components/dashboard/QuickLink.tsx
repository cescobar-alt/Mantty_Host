import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickLinkProps {
    label: string;
    icon: ReactNode;
    path?: string;
}

export const QuickLink = ({ label, icon, path }: QuickLinkProps) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => path && navigate(path)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
        >
            <div className="flex items-center gap-3">
                <div className="text-slate-400 dark:text-slate-500 group-hover:text-mantty-primary transition-colors">{icon}</div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-all" />
        </button>
    );
};
