import { Calendar } from 'lucide-react';

interface OperationalStatusWidgetProps {
    efficiency: number;
}

export const OperationalStatusWidget = ({ efficiency }: OperationalStatusWidgetProps) => {
    return (
        <div className="animate-mantty-slide-up glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 bg-gradient-to-br from-mantty-secondary/5 to-transparent text-slate-900 dark:text-white">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Estado Operativo</h3>
                <Calendar className="w-5 h-5 text-mantty-secondary" />
            </div>
            <div className="text-center py-2">
                <div className="text-4xl font-black mb-1">{efficiency}%</div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tareas al día</p>
            </div>
            <div className="mt-6 h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-mantty-gradient transition-all duration-1000" style={{ width: `${efficiency}%` }} />
            </div>
        </div>
    );
};
