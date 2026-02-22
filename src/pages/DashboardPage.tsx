import { Routes, Route, useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { ResidentView } from '../components/dashboard/ResidentView';
import { ProviderView } from '../components/dashboard/ProviderView';
import { ConfiguracionPage } from './ConfiguracionPage';
import { UserManagement } from '../components/UserManagement';
import { AdminUHView } from '../components/dashboard/AdminUHView';
import { NewTicketPage } from './NewTicketPage';
import { GestionSolicitudesPage } from './GestionSolicitudesPage';
import { TicketDetailPage } from './TicketDetailPage';
import LoadingScreen from '../components/LoadingScreen';

const DashboardHome = () => {
    const { role, propertyId } = useAuth();
    const navigate = useNavigate();

    // New User Flow: No property assigned yet for admin_uh
    if (!propertyId && role === 'admin_uh') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-mantty-fade-in">
                <div className="w-20 h-20 bg-mantty-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Building2 className="w-10 h-10 text-mantty-primary" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Configuración Requerida
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium">
                    Aún no tienes una Unidad Habitacional Remanufactura configurada. Crea tu primera UH para comenzar a administrar.
                </p>
                <button
                    onClick={() => navigate('/onboarding')}
                    className="px-8 py-3 rounded-xl mantty-gradient text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-mantty-primary/20 flex items-center gap-2 group"
                >
                    Configurar mi primera UH
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        );
    }

    switch (role) {
        case 'admin_uh':
        case 'superadmin':
            return <AdminUHView />;
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

export const DashboardPage = () => {
    const { isLoading: authLoading } = useAuth();

    if (authLoading) return <LoadingScreen />;

    return (
        <DashboardLayout>
            <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="new" element={<NewTicketPage />} />
                <Route path="alerts" element={<DashboardHome />} />
                <Route path="settings" element={<ConfiguracionPage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="requests" element={<GestionSolicitudesPage />} />
                <Route path="tickets/:id" element={<TicketDetailPage />} />
                <Route path="*" element={<DashboardHome />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DashboardPage;
