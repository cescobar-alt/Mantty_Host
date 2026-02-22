import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    AlertTriangle,
    User,
    Shield,
    CheckCircle2,
    MoreHorizontal,
    MessageSquare,
    Image as ImageIcon,
    MapPin,
    Calendar,
    Loader2,
    Send
} from 'lucide-react';
import { useTicket, useTickets } from '../hooks/useTickets';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useState } from 'react';

export const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { ticket, loading: loadingTicket } = useTicket(id);
    const { updateTicket, loading: updating } = useTickets();
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    if (loadingTicket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando detalles...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-20">
                <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Solicitud no encontrada</h2>
                <button onClick={() => navigate('/dashboard/requests')} className="mt-6 text-blue-600 font-bold flex items-center gap-2 mx-auto">
                    <ArrowLeft className="w-5 h-5" /> Volver a Solicitudes
                </button>
            </div>
        );
    }

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdatingStatus(true);
        const result = await updateTicket(ticket.id, { status: newStatus });
        if (result.success) {
            toast.success('Estado actualizado correctamente');
        } else {
            toast.error('Error al actualizar el estado');
        }
        setIsUpdatingStatus(false);
    };

    const statusMap: Record<string, { label: string, color: string }> = {
        pendiente: { label: 'Por Revisar', color: 'indigo' },
        en_progreso: { label: 'En Progreso', color: 'blue' },
        completado: { label: 'Finalizado', color: 'emerald' },
        cancelado: { label: 'Cancelado', color: 'rose' },
    };

    const priorityMap: Record<string, { label: string, color: string }> = {
        baja: { label: 'Baja Prioridad', color: 'emerald' },
        media: { label: 'Prioridad Media', color: 'amber' },
        alta: { label: 'Alta Prioridad', color: 'rose' },
        critica: { label: 'Emergencia Crítica', color: 'rose' },
    };

    const currentStatus = statusMap[ticket.status || 'pendiente'] || statusMap.pendiente;
    const currentPriority = priorityMap[ticket.priority || 'media'] || priorityMap.media;

    return (
        <div className="animate-mantty-fade-in max-w-5xl mx-auto px-4 lg:px-0">
            {/* Header Area */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/dashboard/requests')}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Solicitud</span>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">#{ticket.id}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white truncate max-w-md">
                            {ticket.title}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    {ticket.status !== 'completado' && (
                        <button
                            disabled={isUpdatingStatus || updating}
                            onClick={() => handleStatusUpdate('completado')}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Resolver
                        </button>
                    )}
                    <button className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Info Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Banner */}
                    <div className={`p-6 rounded-[2rem] border flex items-center justify-between
                        ${currentStatus.color === 'indigo' ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-500/5' : ''}
                        ${currentStatus.color === 'blue' ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-500/5' : ''}
                        ${currentStatus.color === 'emerald' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5' : ''}
                    `}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
                                ${currentStatus.color === 'indigo' ? 'bg-indigo-500 text-white' : ''}
                                ${currentStatus.color === 'blue' ? 'bg-blue-500 text-white' : ''}
                                ${currentStatus.color === 'emerald' ? 'bg-emerald-500 text-white' : ''}
                            `}>
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Estado actual</p>
                                <h3 className={`text-lg font-black uppercase tracking-tight
                                    ${currentStatus.color === 'indigo' ? 'text-indigo-600' : ''}
                                    ${currentStatus.color === 'blue' ? 'text-blue-600' : ''}
                                    ${currentStatus.color === 'emerald' ? 'text-emerald-600' : ''}
                                `}>
                                    {currentStatus.label}
                                </h3>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {ticket.status === 'pendiente' && (
                                <button
                                    onClick={() => handleStatusUpdate('en_progreso')}
                                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 hover:text-blue-600 transition-all shadow-sm"
                                >
                                    Marcar como Recibida
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="glassmorphism rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Descripción detallada
                            </h4>
                            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                                {ticket.description || 'Sin descripción adicional proporcionada por el residente.'}
                            </p>
                        </div>

                        {ticket.image_url && (
                            <div className="pt-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-4">
                                    <ImageIcon className="w-4 h-4" /> Registro Fotográfico
                                </h4>
                                <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group relative h-64 sm:h-80">
                                    <img
                                        src={ticket.image_url}
                                        alt="Evidencia del problema"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Communication / Timeline placeholder */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Actividad de la Solicitud</h4>
                        <div className="glassmorphism rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Escribe una actualización o nota interna..."
                                className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                            />
                            <button className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    {/* Metadata Card */}
                    <div className="glassmorphism rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-8 space-y-6">
                            {/* Priority */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prioridad</p>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border
                                    ${currentPriority.color === 'emerald' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600' : ''}
                                    ${currentPriority.color === 'amber' ? 'bg-amber-50/50 border-amber-100 text-amber-600' : ''}
                                    ${currentPriority.color === 'rose' ? 'bg-rose-50/50 border-rose-100 text-rose-600' : ''}
                                `}>
                                    <div className={`w-2 h-2 rounded-full animate-pulse
                                        ${currentPriority.color === 'emerald' ? 'bg-emerald-500' : ''}
                                        ${currentPriority.color === 'amber' ? 'bg-amber-500' : ''}
                                        ${currentPriority.color === 'rose' ? 'bg-rose-500' : ''}
                                    `} />
                                    <span className="font-black text-sm uppercase tracking-widest">{currentPriority.label}</span>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Registro</p>
                                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <Calendar className="w-5 h-5 text-slate-300" />
                                    <span className="font-bold">{format(new Date(ticket.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">Reportado hace {format(new Date(ticket.created_at), "k")} horas</span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación</p>
                                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <MapPin className="w-5 h-5 text-slate-300" />
                                    <span className="font-bold">{(ticket as any).space_location || 'Unidad de Vivienda'}</span>
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-white/5" />

                            {/* Assigned To */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Responsable asignado</p>
                                {ticket.assigned_to ? (
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-xs">
                                            AD
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-900 dark:text-white truncate">Administrador UH</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Interno</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-400 hover:text-blue-500 hover:border-blue-500/30 transition-all group">
                                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-widest">Asignar Responsable</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resident Info */}
                    <div className="glassmorphism rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Información del Residente</p>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-mantty-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-mantty-primary/20">
                                R
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 dark:text-white">Residente de UH</h5>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">ID: {ticket.created_by?.substring(0, 8)}</p>
                            </div>
                        </div>
                        <button className="w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                            Contactar Residente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
