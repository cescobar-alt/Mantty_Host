import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../lib/business-rules';
import type { PlanType } from '../lib/business-rules';

export interface AdminProperty {
    id: string;
    name: string;
    address: string | null;
    logo_url: string | null;
    created_at: string;
}

export const useAdminProperties = () => {
    const { user, propertyId, plan, extraUhCapacity, refreshProfile } = useAuth();
    const [properties, setProperties] = useState<AdminProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate plan limits
    const planConfig = plan ? PLANS[plan as PlanType] : PLANS.basic;
    const maxUHs = planConfig.maxUHs + (extraUhCapacity || 0);
    const canCreateMore = properties.length < maxUHs;
    const slotsUsed = properties.length;

    const fetchProperties = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('properties')
                .select('id, name, address, logo_url, created_at')
                .eq('admin_id', user.id)
                .order('created_at', { ascending: true });

            if (sbError) throw sbError;
            setProperties(data || []);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error fetching admin properties';
            setError(message);
            console.error('Error fetching admin properties:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const switchProperty = async (newPropertyId: string) => {
        if (!user || newPropertyId === propertyId) return;

        try {
            const { error: sbError } = await supabase
                .from('profiles')
                .update({ property_id: newPropertyId })
                .eq('id', user.id);

            if (sbError) throw sbError;

            // Refresh the auth context so the whole app reacts
            await refreshProfile();
            return { success: true };
        } catch (err: unknown) {
            console.error('Error switching property:', err);
            const message = err instanceof Error ? err.message : 'Error switching property';
            return { success: false, error: message };
        }
    };

    // Find the current active property object
    const activeProperty = properties.find(p => p.id === propertyId) || null;

    return {
        properties,
        activeProperty,
        loading,
        error,
        maxUHs,
        slotsUsed,
        canCreateMore,
        switchProperty,
        refresh: fetchProperties,
    };
};
