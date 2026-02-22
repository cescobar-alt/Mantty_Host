import { Bell, Info, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AlertasPage = () => {
    const { } = useAuth();

    // Mock alerts for now - in Phase 3 this will be connected to the notifications table
    const alerts = [
        {
            id: '1',
            title: 'Nueva Solicitud Creada',
            message: 'Se ha registrado una nueva solicitud de mantenimiento en el Bloque B.',
            time: 'Hace 5 minutos',
            type: 'info',
            icon: <Info className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-500/10'
        },
        {
            id: '2',
            title: 'Incidente Crítico',
            message: 'Fuga de agua reportada en el área común de la piscina.',
            time: 'Hace 2 horas',
            type: 'warning',
            icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
            bg: 'bg-amber-500/10'
        },
        {
            id: '3',
            title: 'Solicitud Completada',
            message: 'La reparación del ascensor principal ha sido finalizada.',
            time: 'Hace 1 día',
            type: 'success',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
            bg: 'bg-emerald-500/10'
        }
    ];

    return (
        <div className="animate-mantty-fade-in max-w-4xl mx-auto">
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-mantty-primary/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-mantty-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Centro de Alertas</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Mantente al tanto de lo que sucede en tu UH.</p>
            </header>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className="glassmorphism rounded-3xl p-6 border border-slate-200 dark:border-white/5 flex items-start gap-5 hover:border-mantty-primary/20 transition-all cursor-pointer group bg-white dark:bg-slate-900"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${alert.bg}`}>
                            {alert.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-mantty-primary transition-colors">
                                    {alert.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    {alert.time}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {alert.message}
                            </p>
                        </div>
                    </div>
                ))}

                {alerts.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/5">
                        <Bell className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No tienes alertas pendientes</p>
                    </div>
                )}
            </div>
        </div>
    );
};
