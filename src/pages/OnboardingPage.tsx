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
        phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Create the Unidad Habitacional (UH) via Edge Function
            const { data, error } = await supabase.functions.invoke('create-uh', {
                body: {
                    name: uhData.name,
                    address: uhData.address,
                    city: uhData.city,
                    phone: uhData.phone
                }
            });

            if (error) throw error;
            console.log('UH created:', data);

            await refreshProfile();
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al crear la UH');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mantty-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mantty-primary/30 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mantty-secondary/20 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-xl w-full relative z-10">
                <div className="text-center mb-10">
                    <img src="/vite.svg" alt="Mantty Host" className="w-16 h-16 mx-auto mb-6 drop-shadow-2xl" />
                    <h1 className="text-4xl font-black text-white mb-3">¡Bienvenido a Mantty!</h1>
                    <p className="text-slate-400 font-medium px-4">
                        Para comenzar, configuremos tu primera Unidad Habitacional (UH) Remanufactura.
                    </p>
                </div>

                <div className="glassmorphism rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-xl">
                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nombre de la UH</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mantty-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={uhData.name}
                                    onChange={(e) => setUhData({ ...uhData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium"
                                    placeholder="Ej: Residencial Horizonte"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Dirección Exacta</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mantty-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={uhData.address}
                                    onChange={(e) => setUhData({ ...uhData, address: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium"
                                    placeholder="Calle 123 # 45-67"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Ciudad</label>
                                <input
                                    type="text"
                                    required
                                    value={uhData.city}
                                    onChange={(e) => setUhData({ ...uhData, city: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium"
                                    placeholder="Bogotá"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Teléfono UH</label>
                                <input
                                    type="tel"
                                    required
                                    value={uhData.phone}
                                    onChange={(e) => setUhData({ ...uhData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-mantty-primary/50 transition-all font-medium"
                                    placeholder="601..."
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl mantty-gradient text-white font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-mantty-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        Crear UH y Comenzar
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-4">
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
