import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const MobileFAB = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/dashboard/new')}
            style={{ touchAction: 'manipulation' }}
            className="lg:hidden fixed bottom-20 right-6 z-50 w-14 h-14 mantty-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-mantty-primary/40 hover:scale-110 active:scale-90 transition-all group"
            aria-label="Nuevo Ticket"
        >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
            <div className="absolute -inset-1 mantty-gradient opacity-30 blur-lg rounded-2xl group-hover:opacity-50 transition-opacity" />
        </button>
    );
};

