import { Users } from 'lucide-react';

interface CommunityWidgetProps {
    residentsCount: number;
    providersCount: number;
}

export const CommunityWidget = ({ residentsCount, providersCount }: CommunityWidgetProps) => {
    return (
        <div className="animate-mantty-slide-up glassmorphism rounded-3xl p-8 border border-slate-100 dark:border-white/5 bg-gradient-to-br from-mantty-primary/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Comunidad</h3>
                <Users className="w-5 h-5 text-mantty-primary" />
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-white/5 rounded-2xl">
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Residentes activos</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{residentsCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-white/5 rounded-2xl">
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Proveedores vinculados</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{providersCount}</span>
                </div>
            </div>
        </div>
    );
};
