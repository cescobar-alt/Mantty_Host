import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Loader2, ArrowRight } from 'lucide-react';

const OnboardingPage = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uhData, setUhData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        owner_name: '',
        uh_type: 'residencial'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Create the Unidad Habitacional (UH) via Edge Function
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                console.error('No session found for onboarding. Is user logged in?');
                throw new Error('Sesión no encontrada. Por favor, inicia sesión de nuevo.');
            }

            console.log('Invocando create-uh con sesión activa:', session.user.email);

            const { data, error } = await supabase.functions.invoke('create-uh', {
                body: {
                    name: uhData.name,
                    address: uhData.address,
                    city: uhData.city,
                    phone: uhData.phone,
                    owner_name: uhData.owner_name,
                    uh_type: uhData.uh_type
                },
                headers: {
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
                }
            });

            if (error) throw error;
            console.log('UH created:', data);

            await refreshProfile();
            navigate('/dashboard');
        } catch (err: unknown) {
            console.error('Onboarding Error:', err);
            const message = err instanceof Error ? err.message : 'Error al crear la UH';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mantty-primary/30 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mantty-secondary/20 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-xl border border-white/20">
                        <img src="/favicon.svg" alt="Mantty Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">¡Bienvenido!</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-semibold px-4 text-xs sm:text-sm">
                        Configura tu primera Unidad Habitacional (UH).
                    </p>
                </div>

                <div className="glassmorphism rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                    {error && (
                        <div className="mb-4 sm:mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre de la UH</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mantty-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={uhData.name}
                                    onChange={(e) => setUhData({ ...uhData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/30 transition-all font-medium text-sm"
                                    placeholder="Ej: Residencial Horizonte"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Dirección Exacta</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mantty-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={uhData.address}
                                    onChange={(e) => setUhData({ ...uhData, address: e.target.value })}
                                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/30 transition-all font-medium text-sm"
                                    placeholder="Ej: Calle 123 # 45-67"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ciudad</label>
                                <input
                                    type="text"
                                    required
                                    value={uhData.city}
                                    onChange={(e) => setUhData({ ...uhData, city: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/30 transition-all font-medium text-sm"
                                    placeholder="Ej: Envigado"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Teléfono</label>
                                <input
                                    type="tel"
                                    required
                                    value={uhData.phone}
                                    onChange={(e) => setUhData({ ...uhData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/30 transition-all font-medium text-sm"
                                    placeholder="604..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Propietario</label>
                                <input
                                    type="text"
                                    required
                                    value={uhData.owner_name}
                                    onChange={(e) => setUhData({ ...uhData, owner_name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/30 transition-all font-medium text-sm"
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tipo de UH</label>
                                <select
                                    required
                                    value={uhData.uh_type}
                                    onChange={(e) => setUhData({ ...uhData, uh_type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/30 transition-all font-medium text-sm appearance-none"
                                >
                                    <option value="residencial">Residencial</option>
                                    <option value="comercial">Comercial</option>
                                    <option value="mixto">Mixto</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2 sm:pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-2xl mantty-gradient text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-mantty-primary/20 active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Crear UH y Comenzar
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-4 px-2">
                                Al continuar, aceptas los términos de servicio de Mantty Host.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
