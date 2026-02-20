import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const OnboardingPage = () => {
    const { refreshProfile, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [phData, setPhData] = useState({
        name: '',
        address: '',
        city: '',
        phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            // 1. Create the Property Horizontal (PH) via Edge Function
            const { data, error } = await supabase.functions.invoke('create-ph', {
                body: {
                    name: phData.name,
                    address: phData.address,
                    city: phData.city,
                    phone: phData.phone
                }
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            await refreshProfile();
            toast.success('¡Propiedad creada exitosamente!');
            navigate('/dashboard');

        } catch (error: any) {
            console.error('Onboarding Error:', error);
            toast.error('Error al crear la propiedad', {
                description: error.message || 'Intenta nuevamente más tarde.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 transition-colors">
            <div className="w-full max-w-2xl animate-mantty-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        ¡Bienvenido a Mantty, {user?.user_metadata?.full_name?.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Para comenzar, configuremos tu primera Unidad Habitacional (UH).
                    </p>
                </div>

                <div className="glassmorphism rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nombre de la Copropiedad</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={phData.name}
                                        onChange={(e) => setPhData({ ...phData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                        placeholder="Ej: Edificio Mirador"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Dirección Física</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={phData.address}
                                        onChange={(e) => setPhData({ ...phData, address: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                        placeholder="Ej: Calle 123 # 45-67"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Ciudad</label>
                                <input
                                    type="text"
                                    required
                                    value={phData.city}
                                    onChange={(e) => setPhData({ ...phData, city: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="Ej: Bogotá D.C."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Teléfono Administración</label>
                                <input
                                    type="tel"
                                    value={phData.phone}
                                    onChange={(e) => setPhData({ ...phData, phone: e.target.value })}
                                    className="w-full px-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="Opcional"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl mantty-gradient text-white font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-mantty-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        Crear Propiedad y Comenzar
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
