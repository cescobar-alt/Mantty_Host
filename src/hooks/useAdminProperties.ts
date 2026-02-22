import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PLANS } from '../lib/business-rules';
import type { PlanType } from '../lib/business-rules';
import type { Tables } from '../types/database.types';

export type AdminProperty = Tables<'properties'>;

export const useAdminProperties = () => {
    const { user, propertyId, setPropertyId, plan, extraUhCapacity, refreshProfile } = useAuth();

    const {
        data: properties = [],
        isLoading: loading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: ['admin_properties', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('admin_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as AdminProperty[];
        },
        enabled: !!user,
    });

    const switchMutation = useMutation({
        mutationFn: async (newPropertyId: string) => {
            if (!user) throw new Error('User not authenticated');
            const { error } = await supabase
                .from('profiles')
                .update({ property_id: newPropertyId })
                .eq('id', user.id);

            if (error) throw error;
            await refreshProfile();
        },
    });

    // Calculate plan limits
    const planConfig = plan ? PLANS[plan as PlanType] : PLANS.basic;
    const maxUHs = planConfig.maxUHs + (extraUhCapacity || 0);
    const canCreateMore = properties.length < maxUHs;
    const slotsUsed = properties.length;

    const switchProperty = async (newPropertyId: string) => {
        if (!user || newPropertyId === propertyId) return { success: true };
        try {
            await switchMutation.mutateAsync(newPropertyId);
            setPropertyId(newPropertyId); // Manually update local state for immediate response
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error switching property';
            return { success: false, error: message };
        }
    };

    const error = queryError instanceof Error ? queryError.message :
        switchMutation.error instanceof Error ? switchMutation.error.message :
            null;

    const activeProperty = properties.find(p => p.id === propertyId) || null;

    return {
        properties,
        activeProperty,
        loading: loading || switchMutation.isPending,
        error,
        maxUHs,
        slotsUsed,
        canCreateMore,
        switchProperty,
        refresh: refetch,
    };
};
