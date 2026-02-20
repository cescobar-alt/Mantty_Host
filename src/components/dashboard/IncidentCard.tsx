import { AlertTriangle, ArrowUpRight, Clock } from 'lucide-react';
import type { Ticket } from '../../hooks/useTickets';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface IncidentCardProps {
    report: Ticket;
}

export const IncidentCard = ({ report }: IncidentCardProps) => {
    const statusMap = {
        pendiente: { label: 'Pendiente', classes: 'bg-slate-100 dark:bg-slate-800 text-slate-500' },
        en_progreso: { label: 'En progreso', classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        completado: { label: 'Completado', classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
        cancelado: { label: 'Cancelado', classes: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    };

    const priorityMap = {
        baja: 'bg-emerald-500/10 text-emerald-500',
        media: 'bg-amber-500/10 text-amber-500',
        alta: 'bg-red-500/10 text-red-500',
        critica: 'bg-red-600 text-white shadow-lg shadow-red-500/20',
    };

    const statusInfo = statusMap[report.status] || statusMap.pendiente;
    const priorityClasses = priorityMap[report.priority] || priorityMap.media;

    return (
        <div className="animate-mantty-slide-up glassmorphism rounded-3xl p-6 border border-slate-100 dark:border-white/5 hover:border-mantty-primary/20 dark:hover:border-white/10 transition-all cursor-pointer group shadow-sm hover:shadow-md">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 ${priorityClasses}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg truncate text-slate-900 dark:text-white group-hover:text-mantty-primary transition-colors">{report.title}</h3>
                        <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-lg ${statusInfo.classes}`}>
                            {statusInfo.label}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: es })}
                    </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-mantty-primary dark:group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
        </div>
    );
};
