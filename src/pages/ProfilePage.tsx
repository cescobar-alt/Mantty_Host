import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Shield, Save, Loader2, LogOut } from 'lucide-react';

export const ProfilePage = () => {
    const { user, role, plan, signOut, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
        } else {
            // Fetch from profile table if metadata is missing
            const fetchProfile = async () => {
                if (!user?.id) return;
                const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
                if (data?.full_name) setFullName(data.full_name);
            };
            if (user?.id) fetchProfile();
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (authError) throw authError;

            if (!user?.id) throw new Error('Usuario no autenticado');

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (profileError) throw profileError;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-mantty-fade-in max-w-2xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Mi Perfil</h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Administra tu información personal y cuenta.</p>
            </header>

            <div className="space-y-8">
                {/* Profile Form */}
                <form onSubmit={handleUpdateProfile} className="glassmorphism rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-mantty-primary transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mantty-primary/20 focus:border-mantty-primary transition-all font-medium"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                            <div className="relative opacity-60">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-500 cursor-not-allowed font-medium"
                                />
                            </div>
                            <p className="mt-2 text-[10px] text-slate-400 ml-1">El correo no puede ser modificado por seguridad.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rol</label>
                                <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                                    <Shield className="w-4 h-4 text-mantty-primary" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{role?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Plan</label>
                                <div className="flex items-center gap-2 p-4 bg-mantty-primary/5 rounded-2xl border border-mantty-primary/10">
                                    <div className="w-2 h-2 rounded-full bg-mantty-primary animate-pulse" />
                                    <span className="text-sm font-bold text-mantty-primary capitalize">{plan}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`mt-6 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4 rotate-180" />}
                            {message.text}
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mantty-gradient text-white font-black py-4 rounded-2xl shadow-xl shadow-mantty-primary/25 hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Guardar Cambios
                        </button>
                    </div>
                </form>

                {/* Account Actions */}
                <div className="glassmorphism rounded-[2.5rem] p-8 border border-red-500/10 bg-red-500/[0.02]">
                    <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">Zona Peligrosa</h3>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 text-red-500 font-bold hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión en este dispositivo
                    </button>
                </div>
            </div>
        </div>
    );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);
