import { Mic } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';

export const VoiceReporter = () => {
    const { isRecording, transcript, startRecording, stopRecording } = useVoice();

    return (
        <div className="glassmorphism rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                <Mic className="w-24 h-24 text-slate-900 dark:text-white" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-mantty-primary/10 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-mantty-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reporte Inteligente</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                    Graba un audio describiendo el incidente y nuestra IA generará la solicitud técnica por ti.
                </p>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isRecording
                            ? 'bg-red-500 shadow-red-500/40 scale-110 animate-pulse'
                            : 'mantty-gradient shadow-mantty-primary/40 hover:scale-105 active:scale-95'
                            }`}
                    >
                        <Mic className={`w-10 h-10 text-white ${isRecording ? 'animate-bounce' : ''}`} />
                    </button>

                    <div className="w-full min-h-[120px] bg-slate-100 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 italic">
                        {transcript || (isRecording ? "Capturando audio..." : "Mantén presionado para reportar...")}
                    </div>
                </div>
            </div>
        </div>
    );
};
