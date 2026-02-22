import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Send,
    AlertTriangle,
    Tag,
    FileText,
    Image as ImageIcon,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { toast } from 'sonner';

export const NewTicketPage = () => {
    const navigate = useNavigate();
    const { createTicket, loading } = useTickets();
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'media',
        image_url: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('El título es obligatorio');
            return;
        }

        const result = await createTicket({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            image_url: formData.image_url || null
        });

        if (result.success) {
            setIsSuccess(true);
            toast.success('Solicitud enviada correctamente');
            setTimeout(() => navigate('/dashboard'), 2000);
        } else {
            toast.error(result.error || 'Error al enviar la solicitud');
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-mantty-fade-in">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    ¡Solicitud Enviada!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium">
                    Tu requerimiento ha sido registrado y el personal encargado será notificado.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <div className="animate-mantty-fade-in max-w-2xl mx-auto pb-24 lg:pb-12">
            <header className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50 text-slate-500 hover:text-mantty-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                        Nueva Solicitud
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Reporta un incidente en tu UH.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glassmorphism rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent shadow-sm space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Asunto / Título</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium text-sm"
                                placeholder="Ej: Filtración en balcón"
                                required
                            />
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Prioridad estimada</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {['baja', 'media', 'alta', 'critica'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: p })}
                                    className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${formData.priority === p
                                            ? 'bg-mantty-primary text-white border-mantty-primary shadow-lg shadow-mantty-primary/20'
                                            : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 text-slate-500'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Descripción detallada</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium text-sm min-h-[120px]"
                                placeholder="Describe el problema con el mayor detalle posible..."
                            />
                        </div>
                    </div>

                    {/* Image Placeholder (Mock) */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Adjuntar evidencia (opcional)</label>
                        <div className="border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 hover:text-mantty-primary hover:border-mantty-primary/50 transition-all cursor-pointer bg-slate-50/50 dark:bg-white/2 group">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Subir Imagen</span>
                            <p className="text-[10px] mt-1">Máximo 5MB</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] py-4 rounded-2xl mantty-gradient text-white font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-mantty-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Enviar Solicitud
                    </button>
                </div>
            </form>

            <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
                    Si se trata de una emergencia vital (incendio, inundación masiva o fuga de gas), por favor comunícate directamente con las líneas de emergencia de tu ciudad además de reportarlo aquí.
                </p>
            </div>
        </div>
    );
};
