import { useNavigate } from 'react-router-dom';
import { Plus, Inbox, Clock } from 'lucide-react';

export const ResidentView = () => {
    const navigate = useNavigate();
    return (
        <div className="animate-mantty-fade-in py-10 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-mantty-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-mantty-primary/10">
                <Inbox className="w-10 h-10 text-mantty-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 transition-colors">¡Hola, Residente!</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed transition-colors">
                Aquí podrás reportar incidentes en tu unidad y hacer seguimiento a tus solicitudes de mantenimiento.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <button
                    onClick={() => navigate('/dashboard/new')}
                    className="p-8 glassmorphism rounded-3xl border border-slate-100 dark:border-white/5 hover:border-mantty-primary/30 transition-all group shadow-sm text-left"
                >
                    <div className="w-12 h-12 rounded-2xl bg-mantty-primary flex items-center justify-center mb-6 shadow-lg shadow-mantty-primary/20 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Nueva Solicitud</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Reporta un daño o solicita un servicio técnico.</p>
                </button>

                <button className="p-8 glassmorphism rounded-3xl border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/20 transition-all group shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                        <Clock className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Mis Reportes</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Consulta el estado de tus solicitudes activas.</p>
                </button>
            </div>
        </div>
    );
};
