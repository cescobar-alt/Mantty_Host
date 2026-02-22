import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Calendar,
    ChevronDown,
    X,
    AlertCircle,
    Clock,
    MapPin,
    User,
    CheckCircle2,
    RotateCcw
} from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const GestionSolicitudesPage = () => {
    const navigate = useNavigate();
    const { tickets, loading } = useTickets();

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pendientes');
    const [priorityFilter, setPriorityFilter] = useState('Todas');
    const [locationFilter, setLocationFilter] = useState('Todas');
    const [providerFilter, setProviderFilter] = useState('Todos');

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('Pendientes');
        setPriorityFilter('Todas');
        setLocationFilter('Todas');
        setProviderFilter('Todos');
    };

    // Mapping for internal statuses to display statuses (matching the image)
    const statusDisplayMap: Record<string, { label: string, classes: string }> = {
        pendiente: { label: 'Por Revisar', classes: 'bg-indigo-50 text-indigo-600' },
        en_progreso: { label: 'Recibida', classes: 'bg-blue-50 text-blue-600' },
        completado: { label: 'Completado', classes: 'bg-emerald-50 text-emerald-600' },
        cancelado: { label: 'Cancelado', classes: 'bg-rose-50 text-rose-600' },
    };

    const priorityDisplayMap: Record<string, { label: string, classes: string }> = {
        baja: { label: 'BAJA', classes: 'text-emerald-500 border-emerald-100 bg-emerald-50/30' },
        media: { label: 'MEDIA', classes: 'text-amber-500 border-amber-100 bg-amber-50/30' },
        alta: { label: 'ALTA', classes: 'text-orange-500 border-orange-100 bg-orange-50/30' },
        critica: { label: 'CRÍTICA', classes: 'text-rose-500 border-rose-100 bg-rose-50/30' },
    };

    const calculateSLA = (createdAt: string) => {
        const days = differenceInDays(new Date(), new Date(createdAt));
        if (days > 7) { // Example threshold
            return {
                label: `VENCIDO HACE ${days}D`,
                classes: 'bg-rose-50 text-rose-500 border-rose-100'
            };
        }
        return {
            label: 'EN TIEMPO',
            classes: 'bg-emerald-50 text-emerald-500 border-emerald-100'
        };
    };

    const filteredTickets = tickets.filter(t => {
        const titleMatch = t.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const descMatch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesSearch = titleMatch || descMatch;

        const mappedStatus = t.status === 'pendiente' ? 'Pendientes' :
            t.status === 'en_progreso' ? 'En Progreso' :
                t.status === 'completado' ? 'Completados' : 'Todas';

        const matchesStatus = statusFilter === 'Todas' || mappedStatus === statusFilter;
        const matchesPriority = priorityFilter === 'Todas' || (t.priority?.toLowerCase() === priorityFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen p-4 sm:p-8 font-sans">
            {/* Top Bar: Search and Priorities */}
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 dark:text-slate-300 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 shrink-0">
                        Prioridad
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filter Panel (Matching the greyish box in the image) */}
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 lg:p-8 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-4 items-end">

                    {/* Date Filter */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <Clock className="w-3.5 h-3.5" /> Fecha
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Filtrar por fecha"
                                readOnly
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <RotateCcw className="w-3.5 h-3.5" /> Estado
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        >
                            <option>Pendientes</option>
                            <option>En Progreso</option>
                            <option>Completados</option>
                            <option>Todas</option>
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Prioridad
                        </label>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        >
                            <option>Todas</option>
                            <option>Baja</option>
                            <option>Media</option>
                            <option>Alta</option>
                            <option>Critica</option>
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <MapPin className="w-3.5 h-3.5" /> Ubicación
                        </label>
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        >
                            <option>Todas</option>
                            <option>General</option>
                        </select>
                    </div>

                    {/* Provider Filter */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <User className="w-3.5 h-3.5" /> Proveedor
                        </label>
                        <select
                            value={providerFilter}
                            onChange={(e) => setProviderFilter(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                        >
                            <option>Todos</option>
                        </select>
                    </div>

                    {/* Clear Button */}
                    <div className="xl:col-span-2">
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-6 py-3.5 text-slate-400 hover:text-rose-500 transition-colors font-bold text-xs uppercase tracking-widest"
                        >
                            <X className="w-4 h-4" /> Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Display: Table for larger screens, list for mobile */}
            <div className="bg-white dark:bg-slate-950">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-[80px_1fr_200px_150px_150px_150px_120px] gap-4 px-8 py-4 border-b border-slate-50 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 items-center">
                    <div>#</div>
                    <div>Descripción</div>
                    <div>Ubicación</div>
                    <div className="text-center">Estado</div>
                    <div className="text-center">Prioridad</div>
                    <div className="text-center">SLA</div>
                    <div className="text-right">Fecha</div>
                </div>

                {/* List Body */}
                <div className="divide-y divide-slate-50 dark:divide-white/5">
                    {loading ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-slate-500 font-extrabold uppercase tracking-widest text-xs">Cargando...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="py-20 text-center">
                            <AlertCircle className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron resultados</p>
                        </div>
                    ) : (
                        filteredTickets.map((ticket: any) => {
                            const status = statusDisplayMap[ticket.status || 'pendiente'] || statusDisplayMap.pendiente;
                            const priority = priorityDisplayMap[ticket.priority || 'media'] || priorityDisplayMap.media;
                            const sla = calculateSLA(ticket.created_at);

                            return (
                                <div
                                    key={ticket.id}
                                    className="group lg:grid lg:grid-cols-[80px_1fr_200px_150px_150px_150px_120px] gap-4 px-6 sm:px-8 py-6 items-center hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer rounded-2xl border-transparent border hover:border-slate-100 dark:hover:border-white/5"
                                    onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)}
                                >
                                    {/* Mobile ID and Status header */}
                                    <div className="flex items-center justify-between mb-4 lg:mb-0">
                                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">#{ticket.id}</div>
                                        <div className="lg:hidden">
                                            <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider ${status.classes}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="lg:pr-10 mb-4 lg:mb-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                                            {ticket.title} - {ticket.description || 'Sin descripción'}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 mb-4 lg:mb-0">
                                        <MapPin className="w-4 h-4 text-slate-300" />
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {ticket.space_location || (ticket.property_id ? 'Unidad de Vivienda' : 'Área Común')}
                                        </span>
                                    </div>

                                    {/* Status (Desktop only) */}
                                    <div className="hidden lg:flex justify-center">
                                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border border-transparent ${status.classes}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Priority */}
                                    <div className="flex lg:justify-center mb-4 lg:mb-0 gap-3 items-center">
                                        <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioridad:</span>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5 ${priority.classes}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                            {priority.label}
                                        </span>
                                    </div>

                                    {/* SLA */}
                                    <div className="flex lg:justify-center mb-4 lg:mb-0 gap-3 items-center">
                                        <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA:</span>
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black text-center leading-none border ${sla.classes}`}>
                                            {sla.label}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="text-right lg:pl-4">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                            {format(new Date(ticket.created_at), 'dd MMM yyyy', { locale: es })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
