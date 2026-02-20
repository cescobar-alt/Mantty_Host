import { Hammer, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ProviderView = () => {
    return (
        <div className="animate-mantty-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2 transition-colors">Panel del Proveedor</h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide border-l-4 border-mantty-secondary pl-4 transition-colors">Gestión de servicios técnicos y puestas en marcha.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white transition-colors">Tareas Pendientes</h3>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white italic transition-colors">05</div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Incidentes esperando tu visita técnica.</p>
                </div>

                <div className="glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10">
                            <Hammer className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white transition-colors">En Curso</h3>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white italic transition-colors">02</div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Trabajos activos en este momento.</p>
                </div>

                <div className="glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-mantty-secondary/10">
                            <CheckCircle2 className="w-5 h-5 text-mantty-secondary" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white transition-colors">Finalizados</h3>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white italic transition-colors">28</div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Total de servicios completados este mes.</p>
                </div>
            </div>
        </div>
    );
};
