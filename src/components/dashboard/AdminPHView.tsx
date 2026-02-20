import {
    BarChart3,
    Clock,
    Mic,
    Plus,
    ArrowUpRight,
    Users,
    Shield,
    AlertTriangle,
    Calendar,
    TrendingUp,
    Inbox
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { exportReports } from '../../lib/export-utils';
import type { ReactNode } from 'react';

interface MiniStatCardProps {
    label: string;
    value: string;
    icon: ReactNode;
    color: string;
    highlight?: boolean;
}

interface QuickLinkProps {
    label: string;
    icon: ReactNode;
}

const mockReports = [
    { id: '1021', title: 'Falla en ascensor Torre 1', status: 'Pendiente', priority: 'Alta', resident: 'Apto 101', created_at: new Date().toISOString() },
    { id: '1022', title: 'Humedad en sótano -1', status: 'En progreso', priority: 'Media', resident: 'Admin', created_at: new Date().toISOString() },
    { id: '1023', title: 'Mantenimiento preventivo piscina', status: 'Completado', priority: 'Baja', resident: 'Apto 502', created_at: new Date().toISOString() },
];

export const AdminPHView = () => {
    const { isRecording, transcript, startRecording, stopRecording } = useVoice();

    const handleExport = () => {
        exportReports.toPDF(mockReports);
    };

    return (
        <div className="animate-mantty-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-mantty-primary/10 text-mantty-primary rounded-lg border border-mantty-primary/20">
                            Vista Ejecutiva Admin
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                        Panel de Control
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Gestión integral de tu Unidad Habitacional.</p>
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
                    value="15"
                    icon={<Inbox className="w-4 h-4 text-mantty-primary" />}
                    color="primary"
                />
                <MiniStatCard
                    label="Asignadas"
                    value="8"
                    icon={<Users className="w-4 h-4 text-blue-400" />}
                    color="blue"
                />
                <MiniStatCard
                    label="En Progreso"
                    value="4"
                    icon={<Clock className="w-4 h-4 text-amber-400" />}
                    color="amber"
                />
                <MiniStatCard
                    label="Por Revisar"
                    value="3"
                    icon={<Shield className="w-4 h-4 text-emerald-400" />}
                    color="emerald"
                />
                <MiniStatCard
                    label="Críticas"
                    value="2"
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
                        {mockReports.map((report) => (
                            <div key={report.id} className="glassmorphism rounded-3xl p-6 border border-slate-100 dark:border-white/5 hover:border-mantty-primary/20 dark:hover:border-white/10 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 ${report.priority === 'Alta' ? 'bg-red-500/10 text-red-500' :
                                        report.priority === 'Media' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg truncate text-slate-900 dark:text-white group-hover:text-mantty-primary transition-colors">{report.title}</h3>
                                            <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-lg ${report.status === 'Pendiente' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' :
                                                report.status === 'En progreso' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">Originado en {report.resident} • Hace 2 horas</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-mantty-primary dark:group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Community Overview */}
                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        <div className="glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 bg-gradient-to-br from-mantty-primary/5 to-transparent">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Comunidad</h3>
                                <Users className="w-5 h-5 text-mantty-primary" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-white/5 rounded-2xl">
                                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Residentes activos</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">124</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-white/5 rounded-2xl">
                                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Proveedores vinculados</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">12</span>
                                </div>
                            </div>
                        </div>

                        <div className="glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 bg-gradient-to-br from-mantty-secondary/5 to-transparent text-slate-900 dark:text-white">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Estado Operativo</h3>
                                <Calendar className="w-5 h-5 text-mantty-secondary" />
                            </div>
                            <div className="text-center py-2">
                                <div className="text-4xl font-black mb-1">85%</div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tareas al día</p>
                            </div>
                            <div className="mt-6 h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] mantty-gradient" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Widgets */}
                <div className="space-y-8">
                    {/* Voice Reporter */}
                    <div className="glassmorphism rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                            <Mic className="w-24 h-24 text-slate-900 dark:text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-mantty-primary/10 flex items-center justify-center">
                                    <Mic className="w-5 h-5 text-mantty-primary" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reporte Inteligente</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                                Graba un audio describiendo el incidente y nuestra IA generará la solicitud técnica por ti.
                            </p>

                            <div className="flex flex-col items-center gap-6">
                                <button
                                    onMouseDown={startRecording}
                                    onMouseUp={stopRecording}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isRecording
                                        ? 'bg-red-500 shadow-red-500/40 scale-110 animate-pulse'
                                        : 'mantty-gradient shadow-mantty-primary/40 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    <Mic className={`w-10 h-10 text-white ${isRecording ? 'animate-bounce' : ''}`} />
                                </button>

                                <div className="w-full min-h-[120px] bg-slate-100 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 italic">
                                    {transcript || (isRecording ? "Capturando audio..." : "Mantén presionado para reportar...")}
                                </div>
                            </div>
                        </div>
                    </div>

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

const MiniStatCard = ({ label, value, icon, color, highlight = false }: MiniStatCardProps) => {
    const colors: Record<string, string> = {
        primary: 'border-mantty-primary/20 bg-mantty-primary/5',
        blue: 'border-blue-500/20 bg-blue-500/5',
        amber: 'border-amber-500/20 bg-amber-500/5',
        emerald: 'border-emerald-500/20 bg-emerald-500/5',
        red: 'border-red-500/20 bg-red-500/5',
        secondary: 'border-mantty-secondary/20 bg-mantty-secondary/5',
    };

    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} hover:bg-white dark:hover:bg-white/5 transition-all text-center group ${highlight ? 'ring-1 ring-red-500/30' : 'shadow-sm'}`}>
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-xl font-black text-slate-900 dark:text-white transition-colors">{value}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 tracking-wider transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-300">{label}</div>
        </div>
    );
};

const QuickLink = ({ label, icon }: QuickLinkProps) => (
    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
        <div className="flex items-center gap-3">
            <div className="text-slate-400 dark:text-slate-500 group-hover:text-mantty-primary transition-colors">{icon}</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-all" />
    </button>
);

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
