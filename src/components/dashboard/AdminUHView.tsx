import {
    Plus,
    Users,
    Shield,
    AlertTriangle,
    TrendingUp,
    Inbox,
    Clock,
    BarChart3
} from 'lucide-react';
import { exportReports } from '../../lib/export-utils';
import { MiniStatCard } from './MiniStatCard';
import { IncidentCard } from './IncidentCard';
import { VoiceReporter } from './VoiceReporter';
import { CommunityWidget } from './CommunityWidget';
import { OperationalStatusWidget } from './OperationalStatusWidget';
import { QuickLink } from './QuickLink';
import { useTickets } from '../../hooks/useTickets';

export const AdminUHView = () => {
    const { tickets, loading } = useTickets();

    const handleExport = () => {
        exportReports.toPDF(tickets);
    };

    // Calculate real stats
    const stats = {
        active: tickets.filter(t => t.status === 'pendiente').length,
        assigned: tickets.filter(t => t.assigned_to).length,
        inProgress: tickets.filter(t => t.status === 'en_progreso').length,
        completed: tickets.filter(t => t.status === 'completado').length,
        critical: tickets.filter(t => t.priority === 'critica' || t.priority === 'alta').length,
    };

    return (
        <div className="animate-mantty-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-mantty-primary/10 text-mantty-primary rounded-lg border border-mantty-primary/20">
                            Vista Ejecutiva Admin UH
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                        Panel de Control
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Gestión integral de tu Unidad Habitacional Remanufactura.</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-sm"
                    >
                        <Inbox className="w-4 h-4" />
                        Gestionar
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3 rounded-2xl mantty-gradient text-white font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-mantty-primary/25 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Nueva Solicitud
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                <MiniStatCard
                    label="Activas"
                    value={loading ? '...' : stats.active.toString()}
                    icon={<Inbox className="w-4 h-4 text-mantty-primary" />}
                    color="primary"
                />
                <MiniStatCard
                    label="Asignadas"
                    value={loading ? '...' : stats.assigned.toString()}
                    icon={<Users className="w-4 h-4 text-blue-400" />}
                    color="blue"
                />
                <MiniStatCard
                    label="En Progreso"
                    value={loading ? '...' : stats.inProgress.toString()}
                    icon={<Clock className="w-4 h-4 text-amber-400" />}
                    color="amber"
                />
                <MiniStatCard
                    label="Por Revisar"
                    value={loading ? '...' : stats.completed.toString()}
                    icon={<Shield className="w-4 h-4 text-emerald-400" />}
                    color="emerald"
                />
                <MiniStatCard
                    label="Críticas"
                    value={loading ? '...' : stats.critical.toString()}
                    icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
                    color="red"
                    highlight
                />
                <MiniStatCard
                    label="Eficiencia"
                    value="92%"
                    icon={<TrendingUp className="w-4 h-4 text-mantty-secondary" />}
                    color="secondary"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Activities */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
                            <ActivityIcon className="w-5 h-5 text-mantty-primary" />
                            Incidentes de Atención Inmediata
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {tickets.length === 0 && !loading ? (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/5">
                                <p className="text-slate-400 font-medium">No hay incidentes reportados aún.</p>
                            </div>
                        ) : (
                            tickets.slice(0, 5).map((report) => (
                                <IncidentCard key={report.id} report={report as any} />
                            ))
                        )}
                    </div>

                    {/* Community Overview */}
                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        <CommunityWidget residentsCount={124} providersCount={12} />
                        <OperationalStatusWidget efficiency={85} />
                    </div>
                </div>

                {/* Right Widgets */}
                <div className="space-y-8">
                    <VoiceReporter />

                    {/* Quick Access */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 mb-4">Accesos Rápidos</h3>
                        <QuickLink label="Base de Residentes" icon={<Users className="w-4 h-4" />} />
                        <QuickLink label="Directorio de Proveedores" icon={<Shield className="w-4 h-4" />} />
                        <QuickLink label="Informes Financieros" icon={<BarChart3 className="w-4 h-4" />} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);
