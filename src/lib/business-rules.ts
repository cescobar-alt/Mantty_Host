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

export interface RoleDisplayConfig {
    label: string;
    badgeText: string;
    badgeClasses: string;
}

export const ROLE_DISPLAY: Record<UserRole, RoleDisplayConfig> = {
    superadmin: {
        label: 'Super Administrador',
        badgeText: 'SUPER',
        badgeClasses: 'text-purple-600 bg-purple-100',
    },
    admin_uh: {
        label: 'Administrador UH',
        badgeText: 'ADMIN',
        badgeClasses: 'text-mantty-primary bg-mantty-primary/10',
    },
    residente: {
        label: 'Residente',
        badgeText: 'RESIDENTE',
        badgeClasses: 'text-emerald-600 bg-emerald-100',
    },
    proveedor: {
        label: 'Proveedor Técnico',
        badgeText: 'PRO',
        badgeClasses: 'text-amber-600 bg-amber-100',
    },
};

export const getRoleLabel = (role: string | null | undefined): string => {
    if (role && role in ROLE_DISPLAY) {
        return ROLE_DISPLAY[role as UserRole].label;
    }
    return 'Usuario';
};

export const getRoleBadge = (role: string | null | undefined) => {
    if (role && role in ROLE_DISPLAY) {
        const config = ROLE_DISPLAY[role as UserRole];
        return { text: config.badgeText, classes: config.badgeClasses };
    }
    return { text: role?.toUpperCase() || 'USER', classes: 'text-slate-500 bg-slate-100' };
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
