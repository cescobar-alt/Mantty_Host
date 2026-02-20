import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HousePlus, Mail, Lock, Loader2, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login Error:', error);
            setError(error.message === 'Invalid login credentials'
                ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
                : `Error: ${error.message}`);
            setIsLoading(false);
        } else if (data.user) {
            navigate('/dashboard', { replace: true });
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
                <div className="text-center mb-10">
                    <NavLink to="/" className="inline-flex items-center justify-center w-16 h-16 mantty-gradient rounded-2xl shadow-xl shadow-mantty-primary/20 mb-6 hover:scale-105 transition-transform">
                        <HousePlus className="text-white w-8 h-8" />
                    </NavLink>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bienvenido a Mantty</h1>
                    <p className="text-slate-500 dark:text-slate-400">Ingresa a tu panel de gestión</p>
                </div>

                <div className="glassmorphism rounded-3xl p-8 border border-white/5">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 transition-colors">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-mantty-primary/50 focus:border-mantty-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    placeholder="admin@mantty.host"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 transition-colors">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-mantty-primary/50 focus:border-mantty-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-4 rounded-2xl mantty-gradient text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-mantty-primary/20"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        ¿No tienes cuenta? <span className="text-mantty-secondary font-semibold cursor-pointer hover:underline text-balance">Contacta a soporte para registrar tu UH</span>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <NavLink to="/" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                        &larr; Volver al inicio
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
