import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
    User,
    Building2,
    Shield,
    CreditCard,
    Save,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Mail,
    MapPin,
    Package,
    Phone,
    UserCheck,
    Tag
} from 'lucide-react';
import { PLANS } from '../lib/business-rules';
import { useProperties } from '../hooks/useProperties';

type TabType = 'perfil' | 'propiedad' | 'plan';

export const ConfiguracionPage = () => {
    const { user, role, plan, propertyId, extraUhCapacity, refreshProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('perfil');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { propertyData: sbProperty, updateProperty } = useProperties(propertyId || undefined);

    // Profile State
    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
    });

    // Property Form State (local for editing)
    const [propertyForm, setPropertyForm] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        owner_name: '',
        uh_type: 'residencial',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.user_metadata?.full_name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    useEffect(() => {
        if (sbProperty) {
            setPropertyForm({
                name: sbProperty.name || '',
                address: sbProperty.address || '',
                city: sbProperty.city || '',
                phone: sbProperty.phone || '',
                owner_name: sbProperty.owner_name || '',
                uh_type: sbProperty.uh_type || 'residencial',
            });
        }
    }, [sbProperty]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: profileData.full_name })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
            setMessage({ type: 'error', text: message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!propertyId) return;

        setIsSaving(true);
        setMessage(null);

        const result = await updateProperty(propertyId, propertyForm);

        if (result.success) {
            setMessage({ type: 'success', text: 'Datos de la UH actualizados correctamente' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Error al actualizar propiedad' });
        }
        setIsSaving(false);
    };

    const currentPlanInfo = plan ? PLANS[plan] : PLANS.basic;
    const isPro = plan === 'plus' || plan === 'max';

    return (
        <div className="animate-mantty-fade-in max-w-4xl mx-auto pb-24 lg:pb-20">
            <header className="mb-6 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2 transition-colors flex flex-wrap items-center gap-3">
                    Configuración
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-mantty-primary/10 text-mantty-primary rounded-full border border-mantty-primary/20">
                        {role?.replace('_', ' ')}
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Administra tu cuenta y los parámetros de tu propiedad.</p>
            </header>

            {message && (
                <div className={`mb-6 sm:mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-mantty-slide-up ${message.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            {/* Scrollable tabs for mobile */}
            <div className="mb-6 sm:mb-8 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-max min-w-full sm:w-fit">
                    <TabButton
                        active={activeTab === 'perfil'}
                        onClick={() => setActiveTab('perfil')}
                        icon={<User className="w-4 h-4" />}
                        label="Mi Perfil"
                    />
                    {(role === 'admin_uh' || role === 'superadmin') && (
                        <>
                            <TabButton
                                active={activeTab === 'propiedad'}
                                onClick={() => setActiveTab('propiedad')}
                                icon={<Building2 className="w-4 h-4" />}
                                label="Datos UH"
                            />
                            <TabButton
                                active={activeTab === 'plan'}
                                onClick={() => setActiveTab('plan')}
                                icon={<CreditCard className="w-4 h-4" />}
                                label="Suscripción"
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
                {activeTab === 'perfil' && (
                    <div className="glassmorphism rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 dark:border-white/5 space-y-6 sm:space-y-8 bg-white dark:bg-transparent shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-mantty-primary/10 flex items-center justify-center text-mantty-primary shrink-0">
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Información Personal</h3>
                                <p className="text-slate-500 text-xs sm:text-sm">Actualiza tus datos de contacto.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-5 sm:space-y-6">
                            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium text-sm"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-slate-500 cursor-not-allowed font-medium text-sm"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 ml-1 italic">* El correo no se puede cambiar</p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-xl bg-mantty-gradient text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-mantty-primary/20 active:scale-[0.98]"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'propiedad' && (
                    <div className="glassmorphism rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 dark:border-white/5 space-y-6 sm:space-y-8 bg-white dark:bg-transparent shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-mantty-secondary/10 flex items-center justify-center text-mantty-secondary shrink-0">
                                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Información de la UH</h3>
                                <p className="text-slate-500 text-xs sm:text-sm">Gestiona los datos de tu copropiedad.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProperty} className="space-y-5 sm:space-y-6">
                            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nombre de la UH</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={propertyForm.name}
                                            onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-secondary/50 transition-all font-medium text-sm"
                                            placeholder="Nombre de la UH"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Dirección Física</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={propertyForm.address}
                                            onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-secondary/50 transition-all font-medium text-sm"
                                            placeholder="Ej: Calle 123 # 45-67"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Ciudad</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={propertyForm.city}
                                            onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-secondary/50 transition-all font-medium text-sm"
                                            placeholder="Ej: Envigado"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={propertyForm.phone}
                                            onChange={(e) => setPropertyForm({ ...propertyForm, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-secondary/50 transition-all font-medium text-sm"
                                            placeholder="Teléfono de contacto"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Representante / Propietario</label>
                                    <div className="relative">
                                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={propertyForm.owner_name}
                                            onChange={(e) => setPropertyForm({ ...propertyForm, owner_name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-secondary/50 transition-all font-medium text-sm"
                                            placeholder="Nombre del responsable"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Tipo de UH</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            value={propertyForm.uh_type}
                                            onChange={(e) => setPropertyForm({ ...propertyForm, uh_type: e.target.value })}
                                            className="w-full pl-12 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-secondary/50 transition-all font-medium text-sm appearance-none"
                                        >
                                            <option value="residencial">Residencial</option>
                                            <option value="comercial">Comercial</option>
                                            <option value="mixto">Mixto</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-xl bg-mantty-secondary text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-mantty-secondary/20 active:scale-[0.98]"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Actualizar Propiedad
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div className="space-y-6">
                        <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border relative overflow-hidden ${plan === 'basic' ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5' :
                            plan === 'plus' ? 'bg-mantty-primary/5 border-mantty-primary/20 shadow-xl shadow-mantty-primary/5' :
                                'bg-mantty-secondary/5 border-mantty-secondary/20 shadow-xl shadow-mantty-secondary/5'
                            }`}>
                            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10">
                                <Shield className="w-20 h-20 sm:w-32 sm:h-32" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Plan Actual</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                                                {currentPlanInfo.name}
                                            </span>
                                            {isPro && (
                                                <span className="bg-mantty-primary text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                                                    PRO
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white font-black text-xs hover:bg-slate-50 transition-all uppercase tracking-widest active:scale-[0.98]">
                                        Cambiar Plan
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                                    <PlanDetailCard
                                        label="Base"
                                        value={`${currentPlanInfo.maxUHs} UH`}
                                        icon={<Building2 className="w-4 h-4" />}
                                    />
                                    <PlanDetailCard
                                        label="Extra"
                                        value={`${extraUhCapacity} UH`}
                                        icon={<Package className="w-4 h-4" />}
                                    />
                                    <PlanDetailCard
                                        label="Total"
                                        value={`${currentPlanInfo.maxUHs + (extraUhCapacity || 0)} UH`}
                                        icon={<CheckCircle2 className="w-4 h-4" />}
                                        highlight
                                    />
                                </div>

                                <div className="mt-6 sm:mt-10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-sm font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">Funciones Incluidas</h4>
                                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                                        {currentPlanInfo.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 className="w-4 h-4 text-mantty-primary shrink-0" />
                                                <span className="text-xs sm:text-sm">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap active:scale-[0.97] ${active
            ? 'bg-white dark:bg-slate-800 text-mantty-primary shadow-sm ring-1 ring-slate-200 dark:ring-white/10'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
    >
        {icon}
        {label}
    </button>
);

const PlanDetailCard = ({ label, value, icon, highlight = false }: { label: string, value: string, icon: React.ReactNode, highlight?: boolean }) => (
    <div className={`p-3 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col gap-1 sm:gap-2 ${highlight
        ? 'bg-mantty-primary/10 border-mantty-primary/20 text-mantty-primary'
        : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-500'
        }`}>
        <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{label}</span>
            {icon}
        </div>
        <span className={`text-lg sm:text-2xl font-black ${highlight ? 'text-mantty-primary' : 'text-slate-900 dark:text-white'}`}>
            {value}
        </span>
    </div>
);
