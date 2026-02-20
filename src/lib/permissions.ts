import { PLANS, type PlanType, type UserRole } from './business-rules';
export type { PlanType, UserRole };

interface PermissionCheck {
    role: UserRole;
    plan?: PlanType;
    extraCapacity?: number;
}

export const calculateTotalUHLimit = (plan: PlanType = 'basic', extraCapacity: number = 0): number => {
    const baseLimit = PLANS[plan]?.maxUHs || 0;
    return baseLimit + extraCapacity;
};

export const canAccessProFeatures = ({ plan }: PermissionCheck): boolean => {
    return plan === 'plus' || plan === 'max';
};

export const canManageUH = ({ role }: PermissionCheck): boolean => {
    return role === 'superadmin' || role === 'admin_uh';
};

export const canCreateTickets = ({ role }: PermissionCheck): boolean => {
    return role === 'residente' || role === 'admin_uh';
};

export const canViewReports = ({ role, plan }: PermissionCheck): boolean => {
    if (role === 'superadmin') return true;
    if (role === 'admin_uh' && (plan === 'plus' || plan === 'max')) return true;
    return false;
};

/**
 * Permission engine that decides what an user can do based on Role and Plan intersection.
 */
export const getPermissions = (role: UserRole, plan: PlanType = 'basic') => {
    return {
        isAdmin: role === 'superadmin' || role === 'admin_uh',
        isSuperAdmin: role === 'superadmin',
        isProvider: role === 'proveedor',
        isResident: role === 'residente',
        hasProAccess: canAccessProFeatures({ role, plan }),
        canExport: canAccessProFeatures({ role, plan }),
        canManageUsers: role === 'superadmin' || role === 'admin_uh',
    };
};
