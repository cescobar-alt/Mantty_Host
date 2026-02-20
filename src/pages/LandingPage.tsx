import { NavLink } from 'react-router-dom';
import {
    HousePlus,
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
    Moon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { PLANS } from '../lib/business-rules';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
    const { theme, setTheme } = useTheme();
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

    useEffect(() => {
        const checkConn = async () => {
            try {
                const { error } = await supabase.from('profiles').select('id').limit(1);
                if (error) {
                    console.error('Supabase Connection Error:', error);
                    if (error.message.includes('relation "public.profiles" does not exist')) {
                        console.warn('The "profiles" table is missing. Did you run the SQL schema?');
                        setDbStatus('connected'); // Treat as connected for UI purposes if it's just a missing table
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
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-mantty-primary selection:text-white transition-colors duration-300">
            <SEO
                title="Gestión Inteligente de Mantenimiento | Mantty Host"
                description="Simplifica la administración de tu Unidad Habitacional (UH) con Mantty Host. Inteligencia artificial, reportes por voz y control operacional total."
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 mantty-gradient rounded-xl flex items-center justify-center shadow-lg shadow-mantty-primary/20">
                            <HousePlus className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white italic">
                            MANTTY<span className="text-mantty-primary font-light">HOST</span>
                        </span>
                    </NavLink>

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

                    <div className="absolute -bottom-12 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 text-[10px] font-bold tracking-widest uppercase">
                        <Radio className={`w-3 h-3 ${dbStatus === 'connected' ? 'text-emerald-500 animate-pulse' : dbStatus === 'error' ? 'text-red-500' : 'text-slate-500'}`} />
                        <span className={dbStatus === 'connected' ? 'text-emerald-500' : dbStatus === 'error' ? 'text-red-500' : 'text-slate-500'}>
                            System: {dbStatus === 'connected' ? 'Online' : dbStatus === 'error' ? 'Offline' : 'Checking'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="pt-40 pb-24 px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-mantty-primary/10 rounded-full blur-[120px] -z-10" />

                    <div className="container mx-auto max-w-5xl text-center space-y-10 animate-mantty-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-mantty-primary text-xs font-black tracking-widest uppercase">
                            <Zap className="w-4 h-4" />
                            Nueva Generación en Mantenimiento
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-slate-100">
                            TU UNI<span className="text-mantty-primary underline decoration-mantty-secondary/30">DAD</span> <br />
                            BAJO CONTROL.
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            Simplifica la gestión de tu <span className="text-slate-900 dark:text-white font-bold italic">UH</span> con IA, reportes por voz y una interfaz diseñada para la eficiencia.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <NavLink to="/login" className="w-full sm:w-auto px-10 py-5 rounded-2xl mantty-gradient text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-2xl shadow-mantty-primary/40">
                                EMPEZAR GRATIS <ArrowRight className="w-6 h-6" />
                            </NavLink>
                            <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200/20 dark:shadow-none">
                                <MousePointer2 className="w-5 h-5" /> DOCUMENTACIÓN
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, i) => (
                                <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 hover:border-mantty-primary/30 dark:hover:border-mantty-primary/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-mantty-primary/5">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-24 bg-white/2">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">¿CÓMO OPERA?</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Eficiencia en tres pasos</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-[60px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

                            {steps.map((step, i) => (
                                <div key={i} className="text-center group">
                                    <div className="w-20 h-20 rounded-full mantty-gradient text-white text-3xl font-black flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-mantty-primary/30 group-hover:scale-110 transition-transform ring-8 ring-slate-50 dark:ring-slate-950">
                                        {step.number}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Preview */}
                <section id="pricing" className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-mantty-primary/5 -skew-y-3" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 dark:text-white">PLANES QUE ESCALAN</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16">
                            Desde el plan <span className="text-mantty-primary font-bold">Base</span> gratuito hasta el plan <span className="text-mantty-secondary font-bold">Max</span> ilimitado. Complementa con paquetes de expansión de 10 UH.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((planKey) => {
                                const p = PLANS[planKey];
                                return (
                                    <div key={planKey} className={`p-10 rounded-[3rem] border transition-all ${planKey === 'plus' ? 'bg-slate-900 border-mantty-primary shadow-2xl shadow-mantty-primary/20 scale-105 z-10' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}>
                                        <div className="text-xs font-black tracking-[0.2em] uppercase text-slate-500 mb-4">{p.name}</div>
                                        <div className="text-4xl font-black mb-8 text-slate-900 dark:text-white">
                                            {p.maxUHs > 100 ? 'ILIMITADO' : `${p.maxUHs} UH`}
                                        </div>
                                        <ul className="space-y-4 mb-10 text-left">
                                            {p.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${planKey === 'plus' ? 'text-mantty-primary' : 'text-slate-300 dark:text-slate-600'}`} />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <NavLink to="/login" className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${planKey === 'plus' ? 'mantty-gradient text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                            SELECCIONAR {p.name.toUpperCase()} <ArrowRight className="w-4 h-4" />
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-20">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 mantty-gradient rounded-lg flex items-center justify-center">
                            <HousePlus className="text-white w-5 h-5" />
                        </div>
                        <span className="font-black text-xl italic text-slate-900 dark:text-white">MANTTY<span className="text-mantty-primary font-light text-sm tracking-[0.3em] not-italic ml-2 uppercase">Host</span></span>
                    </NavLink>

                    <div className="flex gap-10 text-sm font-bold text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Soporte</a>
                    </div>

                    <p className="text-slate-600 text-sm font-bold tracking-tight">
                        &copy; {new Date().getFullYear()} MANTTY HOST. TODOS LOS DERECHOS RESERVADOS.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
