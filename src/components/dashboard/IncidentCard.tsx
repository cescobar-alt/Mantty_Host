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
        <div className="animate-mantty-slide-up glassmorphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 dark:border-white/5 hover:border-mantty-primary/20 dark:hover:border-white/10 transition-all cursor-pointer group shadow-sm hover:shadow-md active:scale-[0.99]">
            <div className="flex items-start sm:items-center gap-3 sm:gap-5">
                {/* Priority icon */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 shrink-0 ${priorityClasses}`}>
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-mantty-primary transition-colors truncate mb-1">
                        {report.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-lg ${statusInfo.classes}`}>
                            {statusInfo.label}
                        </span>
                        <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: es })}
                        </span>
                    </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-mantty-primary dark:group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 hidden sm:block" />
            </div>
        </div>
    );
};
