import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen mantty-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-mantty-primary/20 blur-[120px] rounded-full animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <img src="/vite.svg" alt="Mantty Host" className="w-20 h-20 mb-8 animate-bounce" />
                <div className="flex items-center gap-3 text-white font-bold text-lg mb-2">
                    <Loader2 className="w-6 h-6 animate-spin text-mantty-primary" />
                    Cargando Mantty...
                </div>
                <p className="text-slate-400 text-sm font-medium">Preparando tu experiencia inteligente</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
