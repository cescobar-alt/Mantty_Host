import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { HousePlus, Mail, Lock, Loader2, Sun, Moon, User, Building2, Ticket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();

    // Invite Params
    const inviteCode = searchParams.get('code');
    const invitePhName = searchParams.get('ph');
    const invitePhId = searchParams.get('join');

    // Redirect if already logged in (unless it's an invite flow, might want to handle differently, but standard is redirect)
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
        // Auto-switch to register if there is an invite code
        if (inviteCode && invitePhId) {
            setIsLogin(false);
        }
    }, [user, navigate, inviteCode, invitePhId]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isLogin) {
                // LOGIN FLOW
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Navigation happens in useEffect when user state changes
            } else {
                // REGISTER FLOW
                const metaData: any = {
                    full_name: fullName,
                };

                // If Invitation Flow
                if (inviteCode && invitePhId) {
                    metaData.invite_code = inviteCode;
                    metaData.invite_ph_id = invitePhId;
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: metaData,
                        // Redirect to dashboard after email confirmation if needed
                        // emailRedirectTo: `${window.location.origin}/dashboard`
                    }
                });

                if (error) throw error;

                if (data.user && data.session) {
                    // Immediate login (if email confirmation is disabled or auto-confirm)
                    navigate('/dashboard', { replace: true });
                } else if (data.user && !data.session) {
                    // Email confirmation triggered
                    setSuccessMessage('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
                    setIsLogin(true); // Switch back to login to show the message nicely or wait
                }
            }
        } catch (err: any) {
            console.error('Auth Error:', err);
            setError(err.message === 'Invalid login credentials'
                ? 'Credenciales inválidas.'
                : err.message || 'Ocurrió un error al procesar tu solicitud.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center items-center px-4 transition-colors duration-300 relative">
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-mantty-primary transition-all"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-full max-w-md animate-mantty-fade-in">
                <div className="text-center mb-8">
                    <NavLink to="/" className="inline-flex items-center justify-center w-16 h-16 mantty-gradient rounded-2xl shadow-xl shadow-mantty-primary/20 mb-6 hover:scale-105 transition-transform">
                        <HousePlus className="text-white w-8 h-8" />
                    </NavLink>

                    {inviteCode && invitePhName ? (
                        <div className="mb-4 animate-bounce-in">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                                <Ticket className="w-3 h-3" />
                                Invitación Especial
                            </span>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Unirse a {invitePhName}</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Crea tu cuenta para acceder a la propiedad.</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {isLogin ? 'Bienvenido a Mantty' : 'Comienza con Mantty'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">
                                {isLogin ? 'Ingresa a tu panel de gestión' : 'La plataforma inteligente para tu PH'}
                            </p>
                        </>
                    )}
                </div>

                <div className="glassmorphism rounded-3xl p-8 border border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                    {/* Toggle Login/Register */}
                    {!inviteCode && (
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-950/50 rounded-xl mb-6">
                            <button
                                onClick={() => { setIsLogin(true); setError(null); }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin
                                        ? 'bg-white dark:bg-slate-800 text-mantty-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(null); }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin
                                        ? 'bg-white dark:bg-slate-800 text-mantty-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                Registrarse
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2 animate-mantty-slide-up">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required={!isLogin}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-mantty-primary/50 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold p-3 rounded-xl text-center animate-shake">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold p-3 rounded-xl text-center animate-pulse">
                                {successMessage}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-3.5 rounded-2xl mantty-gradient text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-mantty-primary/20 mt-4"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                        </button>
                    </form>

                    {!inviteCode && (
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
                            {!isLogin ? (
                                <p className="text-center text-xs text-slate-500">
                                    ¿Buscas administrar tu PH? <br />
                                    Crea tu cuenta y configura tu propiedad en minutos.
                                </p>
                            ) : (
                                <p className="text-center text-xs text-slate-500">
                                    ¿Olvidaste tu contraseña? <span className="text-mantty-secondary font-bold cursor-pointer hover:underline">Recuperar</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <NavLink to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2">
                        &larr; Volver al inicio
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
