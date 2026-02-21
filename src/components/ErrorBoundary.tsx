import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('React Error Boundary:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full glassmorphism rounded-[2.5rem] p-10 border border-red-500/20 shadow-2xl shadow-red-500/10">
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4">¡Ups! Algo salió mal</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            La aplicación encontró un error inesperado. Hemos registrado el incidente para solucionarlo.
                        </p>
                        <div className="bg-slate-900 rounded-2xl p-4 mb-8 text-left overflow-auto max-h-40">
                            <code className="text-xs text-red-400 font-mono">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 rounded-2xl mantty-gradient text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Reiniciar aplicación
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
