import { Routes, Route, useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { AdminPHView } from '../components/dashboard/AdminPHView';
import { ResidentView } from '../components/dashboard/ResidentView';
import { ProviderView } from '../components/dashboard/ProviderView';
import { ConfiguracionPage } from './ConfiguracionPage';
import { UserManagement } from '../components/UserManagement';

const DashboardHome = () => {
    const { role, propertyId } = useAuth();
    const navigate = useNavigate();

    // New User Flow: No property assigned yet
    if (!propertyId && role !== 'superadmin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-mantty-fade-in">
                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Building2 className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">¡Hola! Estás a un paso.</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Aún no tienes una Unidad Habitacional configurada. Crea tu primera PH para comenzar a administrar.
                </p>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="px-8 py-4 rounded-2xl mantty-gradient text-white font-bold shadow-xl shadow-mantty-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Configurar mi primera PH
                </button>
            </div>
        );
    }

    switch (role) {
        case 'superadmin':
        case 'admin_uh':
            return <AdminPHView />;
        case 'residente':
            return <ResidentView />;
        case 'proveedor':
            return <ProviderView />;
        default:
            return (
                <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
                    Selecciona un rol válido para ver el panel.
                </div>
            );
    }
};

const DashboardPage = () => {
    return (
        <DashboardLayout>
            <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="settings" element={<ConfiguracionPage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="*" element={<DashboardHome />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DashboardPage;
