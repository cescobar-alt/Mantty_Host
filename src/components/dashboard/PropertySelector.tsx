import { useState, useRef, useEffect } from 'react';
import {
    Building2,
    ChevronDown,
    Check,
    Plus,
    Loader2,
    MapPin,
    Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminProperties } from '../../hooks/useAdminProperties';
import type { AdminProperty } from '../../hooks/useAdminProperties';
import { toast } from 'sonner';

export const PropertySelector = () => {
    const {
        properties,
        activeProperty,
        loading,
        maxUHs,
        slotsUsed,
        canCreateMore,
        switchProperty
    } = useAdminProperties();
    const [isOpen, setIsOpen] = useState(false);
    const [switching, setSwitching] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleSwitch = async (property: AdminProperty) => {
        if (property.id === activeProperty?.id) {
            setIsOpen(false);
            return;
        }

        setSwitching(property.id);
        const result = await switchProperty(property.id);

        if (result?.success) {
            toast.success(`Cambiaste a "${property.name}"`, {
                description: 'Los datos del dashboard se actualizarán automáticamente.'
            });
            setIsOpen(false);
        } else {
            toast.error('Error al cambiar de UH', {
                description: result?.error || 'Intenta de nuevo.'
            });
        }
        setSwitching(null);
    };

    const handleCreateNew = () => {
        setIsOpen(false);
        navigate('/onboarding');
    };

    // Don't render if user has no properties at all
    if (loading && properties.length === 0) {
        return (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                </div>
            </div>
        );
    }

    // If only 1 property (basic plan, no multi-UH), show a simpler badge
    if (properties.length <= 1 && !canCreateMore) {
        return (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="w-10 h-10 rounded-xl mantty-gradient flex items-center justify-center shadow-md shadow-mantty-primary/20 shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {activeProperty?.name || 'Mi UH'}
                    </p>
                    {activeProperty?.address && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {activeProperty.address}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                    bg-white dark:bg-slate-900/60 border shadow-sm
                    hover:shadow-md active:scale-[0.99]
                    ${isOpen
                        ? 'border-mantty-primary/30 ring-2 ring-mantty-primary/10 shadow-mantty-primary/5'
                        : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                    }
                `}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="w-10 h-10 rounded-xl mantty-gradient flex items-center justify-center shadow-md shadow-mantty-primary/20 shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {activeProperty?.name || 'Seleccionar UH'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {slotsUsed} de {maxUHs >= 999 ? '∞' : maxUHs} UH
                        {activeProperty?.address ? ` · ${activeProperty.address}` : ''}
                    </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 z-40 bg-black/10"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="
                        absolute left-0 right-0 top-full mt-2 z-50
                        glassmorphism
                        border border-slate-200 dark:border-white/10
                        rounded-2xl shadow-2xl shadow-black/10
                        overflow-hidden
                        animate-mantty-slide-up
                    ">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    Mis Propiedades
                                </p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${slotsUsed >= maxUHs && maxUHs < 999
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                    : 'bg-mantty-primary/10 text-mantty-primary'
                                    }`}>
                                    {slotsUsed}/{maxUHs >= 999 ? '∞' : maxUHs}
                                </span>
                            </div>
                        </div>

                        {/* Property List */}
                        <div className="max-h-[280px] overflow-y-auto py-1">
                            {properties.map((property) => {
                                const isActive = property.id === activeProperty?.id;
                                const isSwitching = switching === property.id;

                                return (
                                    <button
                                        key={property.id}
                                        onClick={() => handleSwitch(property)}
                                        disabled={isSwitching}
                                        className={`
                                            w-full flex items-center gap-3 px-4 py-3 text-left transition-all
                                            active:bg-slate-100 dark:active:bg-white/5
                                            ${isActive
                                                ? 'bg-mantty-primary/5 dark:bg-mantty-primary/10'
                                                : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                            }
                                        `}
                                        role="option"
                                        aria-selected={isActive}
                                    >
                                        {/* Icon */}
                                        <div className={`
                                            w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                            ${isActive
                                                ? 'mantty-gradient text-white shadow-sm shadow-mantty-primary/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                            }
                                        `}>
                                            {isSwitching
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Building2 className="w-4 h-4" />
                                            }
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isActive ? 'text-mantty-primary' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                {property.name}
                                            </p>
                                            {property.address && (
                                                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                                    {property.address}
                                                </p>
                                            )}
                                        </div>

                                        {/* Active Checkmark */}
                                        {isActive && (
                                            <div className="w-6 h-6 rounded-full bg-mantty-primary/10 flex items-center justify-center shrink-0">
                                                <Check className="w-3.5 h-3.5 text-mantty-primary" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer: Create New UH */}
                        <div className="border-t border-slate-100 dark:border-white/5 p-2">
                            {canCreateMore ? (
                                <button
                                    onClick={handleCreateNew}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-mantty-primary hover:bg-mantty-primary/5 transition-all active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl border-2 border-dashed border-mantty-primary/30 flex items-center justify-center shrink-0">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Crear nueva UH</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {maxUHs - slotsUsed >= 999 ? 'Ilimitado' : `${maxUHs - slotsUsed} disponible${maxUHs - slotsUsed !== 1 ? 's' : ''}`}
                                        </p>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setIsOpen(false); navigate('/dashboard/settings'); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-all active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <Crown className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">Actualizar Plan</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Necesitas más capacidad de UH
                                        </p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
