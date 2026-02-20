/**
 * Mantty Business Rules - Single Source of Truth (SSOT)
 */

export type PlanType = 'basic' | 'plus' | 'max';
export type UserRole = 'superadmin' | 'admin_uh' | 'residente' | 'proveedor';

export const ROLES: Record<UserRole, { description: string }> = {
    superadmin: { description: 'Administración global de la plataforma Mantty Host.' },
    admin_uh: { description: 'Administrador de una Unidad Habitacional Remanufactura específica.' },
    residente: { description: 'Usuarios que viven en la propiedad y pueden crear solicitudes.' },
    proveedor: { description: 'Personal externo encargado de realizar los mantenimientos técnicos.' },
};

interface PlanConfig {
    name: string;
    maxUHs: number;
    features: string[];
}

export const PLANS: Record<PlanType, PlanConfig> = {
    basic: {
        name: 'Basic',
        maxUHs: 1,
        features: ['Gestión de reportes', 'Panel de administración básico', 'Soporte por email'],
    },
    plus: {
        name: 'Plus',
        maxUHs: 5,
        features: [
            'Gestión de reportes avanzada',
            'Panel de reportes PRO',
            'Exportación a Excel/PDF',
            'Múltiples administradores',
            'Soporte prioritario',
        ],
    },
    max: {
        name: 'Max',
        maxUHs: 999, // Ilimitado
        features: [
            'Todas las funciones Plus',
            'Personalización de marca',
            'API access',
            'Integraciones avanzadas',
            'Soporte 24/7',
        ],
    },
};

export const BUSINESS_RULES = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    CURRENCY: 'COP',
    UH_PACKAGE_SIZE: 10, // Default size for add-on packages
};
