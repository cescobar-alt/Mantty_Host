import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight,
    Shield,
    Radio,
    CheckCircle2,
    Clock,
    FileText,
    Users,
    Zap,
    MousePointer2,
    Sun,
    Moon,
    Menu,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { PLANS } from '../lib/business-rules';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';
import { ManttyLogo } from '../components/common/ManttyLogo';

const LandingPage = () => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkConn = async () => {
            try {
                const { error } = await supabase.from('profiles').select('id').limit(1);
                if (error) {
                    console.error('Supabase Connection Error:', error);
                    if (error.message.includes('relation "public.profiles" does not exist')) {
                        console.warn('The "profiles" table is missing. Did you run the SQL schema?');
                        setDbStatus('connected');
                    } else {
                        setDbStatus('error');
                    }
                } else {
                    setDbStatus('connected');
                }
            } catch {
                setDbStatus('error');
            }
        };
        checkConn();
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const features = [
        {
            icon: <FileText className="w-6 h-6 text-mantty-primary" />,
            title: "Gestión de Solicitudes",
            description: "Reporta daños con fotos y seguimiento en tiempo real para cada UH."
        },
        {
            icon: <Clock className="w-6 h-6 text-mantty-secondary" />,
            title: "Tiempos de Respuesta",
            description: "Métricas y SLAs definidos para el control total de la administración."
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            title: "Seguridad Bancaria",
            description: "Autenticación robusta y cifrado de datos para proteger tu información."
        },
        {
            icon: <Users className="w-6 h-6 text-mantty-accent" />,
            title: "Multi-usuario",
            description: "Perfiles optimizados para administradores, residentes y proveedores."
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Configura tu UH",
            description: "Crea tu cuenta y registra tu Unidad Habitacional en segundos."
        },
        {
            number: "02",
            title: "Invita a tu equipo",
            description: "Suma residentes y proveedores para centralizar la comunicación."
        },
        {
            number: "03",
            title: "Optimiza procesos",
            description: "Gestiona reportes por voz o texto y genera informes automáticos."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-50 font-sans selection:bg-mantty-primary selection:text-white transition-colors duration-500">
            <SEO
                title="Gestión Inteligente de Mantenimiento | Mantty Host"
                description="Simplifica la administración de tu Unidad Habitacional (UH) con Mantty Host. Inteligencia artificial, reportes por voz y control operacional total."
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl safe-area-top">
                <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                        <ManttyLogo size="md" />
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white italic">
                            MANTTY<span className="text-mantty-primary font-light">HOST</span>
                        </span>
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
                        <a href="#features" className="hover:text-mantty-primary transition-colors">Características</a>
                        <a href="#pricing" className="hover:text-mantty-primary transition-colors">Planes</a>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-mantty-primary transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <NavLink to="/login" className="px-6 py-2.5 rounded-full mantty-gradient text-white hover:shadow-lg hover:shadow-mantty-primary/30 transition-all">
                            Acceder
                        </NavLink>
                    </div>

                    {/* Mobile Nav Controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-3 text-slate-400 hover:text-mantty-primary transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                            aria-label="Menú"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* System status — only on desktop */}
                    <div className="hidden lg:flex absolute -bottom-10 right-6 items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-[10px] font-bold tracking-widest uppercase">
                        <Radio className={`w-3 h-3 ${dbStatus === 'connected' ? 'text-emerald-500 animate-pulse' : dbStatus === 'error' ? 'text-red-500' : 'text-slate-500'}`} />
                        <span className={dbStatus === 'connected' ? 'text-emerald-500' : dbStatus === 'error' ? 'text-red-500' : 'text-slate-500'}>
                            System: {dbStatus === 'connected' ? 'Online' : dbStatus === 'error' ? 'Offline' : 'Checking'}
                        </span>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden glassmorphism border-t border-slate-100 dark:border-white/5 px-4 py-6 space-y-4 animate-mantty-slide-up">
                        <a
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 transition-colors"
                        >
                            Características
                        </a>
                        <a
                            href="#pricing"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 transition-colors"
                        >
                            Planes
                        </a>
                        <NavLink
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3.5 rounded-xl mantty-gradient text-white text-center font-bold shadow-lg shadow-mantty-primary/20"
                        >
                            Acceder
                        </NavLink>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <main>
                <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[600px] bg-mantty-primary/10 rounded-full blur-[120px] -z-10" />

                    <div className="container mx-auto max-w-5xl text-center space-y-8 sm:space-y-10 animate-mantty-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mantty-primary/5 border border-mantty-primary/10 text-mantty-primary text-xs font-black tracking-widest uppercase">
                            <Zap className="w-4 h-4" />
                            Nueva Generación
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-slate-100">
                            TU UNI<span className="text-mantty-primary underline decoration-mantty-secondary/30">DAD</span> <br />
                            BAJO CONTROL.
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium px-4">
                            Simplifica la gestión de tu <span className="text-slate-900 dark:text-white font-bold italic">UH</span> con IA, reportes por voz y una interfaz diseñada para la eficiencia.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
                            <NavLink to="/login" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl mantty-gradient text-white font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-2xl shadow-mantty-primary/40 active:scale-[0.98]">
                                EMPEZAR GRATIS <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </NavLink>
                            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white font-black text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200/20 dark:shadow-none active:scale-[0.98]">
                                <MousePointer2 className="w-5 h-5" /> DOCS
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 sm:py-24 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                            {features.map((feature, i) => (
                                <div key={i} className="p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 hover:border-mantty-primary/30 dark:hover:border-mantty-primary/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-mantty-primary/5">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-4 sm:mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-16 sm:py-24 bg-white/2">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">¿CÓMO OPERA?</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs sm:text-sm">Eficiencia en tres pasos</p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 relative">
                            {/* Connector Line */}
                            <div className="hidden sm:block absolute top-[60px] left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent -z-10" />

                            {steps.map((step, i) => (
                                <div key={i} className="text-center group flex sm:flex-col items-center sm:items-center gap-6 sm:gap-0">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mantty-gradient text-white text-2xl sm:text-3xl font-black flex items-center justify-center shrink-0 sm:mx-auto sm:mb-8 shadow-2xl shadow-mantty-primary/30 group-hover:scale-110 transition-transform ring-4 sm:ring-8 ring-slate-50 dark:ring-slate-950">
                                        {step.number}
                                    </div>
                                    <div className="text-left sm:text-center">
                                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-slate-900 dark:text-white uppercase tracking-tight">{step.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm sm:text-base">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Preview */}
                <section id="pricing" className="py-20 sm:py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-mantty-primary/5 -skew-y-3" />
                    <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 text-slate-900 dark:text-white">PLANES QUE ESCALAN</h2>
                        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-16 px-4">
                            Desde el plan <span className="text-mantty-primary font-bold">Base</span> gratuito hasta el plan <span className="text-mantty-secondary font-bold">Max</span> ilimitado.
                        </p>

                        {/* Horizontal scroll on mobile */}
                        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto overflow-x-auto pb-4 -mx-4 px-4 lg:mx-auto lg:px-0 snap-x snap-mandatory">
                            {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((planKey) => {
                                const p = PLANS[planKey];
                                return (
                                    <div key={planKey} className={`min-w-[280px] lg:min-w-0 snap-center p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border transition-all shrink-0 ${planKey === 'plus'
                                        ? 'bg-slate-800 dark:bg-slate-800 border-mantty-primary shadow-2xl shadow-mantty-primary/20 lg:scale-105 z-10'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                                        }`}>
                                        <div className={`text-xs font-black tracking-[0.2em] uppercase mb-3 sm:mb-4 ${planKey === 'plus' ? 'text-mantty-primary' : 'text-slate-500'}`}>
                                            {p.name}
                                        </div>
                                        <div className={`text-3xl sm:text-4xl font-black mb-6 sm:mb-8 ${planKey === 'plus' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                            {p.maxUHs > 100 ? 'ILIMITADO' : `${p.maxUHs} UH`}
                                        </div>
                                        <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 text-left">
                                            {p.features.map((f, i) => (
                                                <li key={i} className={`flex items-start gap-3 text-sm font-medium ${planKey === 'plus' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${planKey === 'plus' ? 'text-mantty-primary' : 'text-slate-300 dark:text-slate-600'}`} />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <NavLink to="/login" className={`w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${planKey === 'plus'
                                            ? 'mantty-gradient text-white shadow-lg shadow-mantty-primary/30'
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                                            }`}>
                                            SELECCIONAR <ArrowRight className="w-4 h-4" />
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-white/5 py-12 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center gap-8 sm:gap-10 md:flex-row md:justify-between">
                    <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <ManttyLogo size="sm" />
                        <span className="font-black text-xl italic text-slate-900 dark:text-white">MANTTY<span className="text-mantty-primary font-light text-sm tracking-[0.3em] not-italic ml-2 uppercase">Host</span></span>
                    </NavLink>

                    <div className="flex gap-8 sm:gap-10 text-sm font-bold text-slate-500">
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Soporte</a>
                    </div>

                    <p className="text-slate-500 dark:text-slate-600 text-xs sm:text-sm font-bold tracking-tight text-center">
                        &copy; {new Date().getFullYear()} MANTTY HOST.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
