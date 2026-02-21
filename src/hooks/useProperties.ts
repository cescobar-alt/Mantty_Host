import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database.types';

export type IProperty = Tables<'properties'>;

export const useProperties = (propertyId?: string) => {
    const queryClient = useQueryClient();

    const {
        data: propertyData,
        isLoading: loading,
        error: queryError,
    } = useQuery({
        queryKey: ['property', propertyId],
        queryFn: async () => {
            if (!propertyId) return null;
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', propertyId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!propertyId,
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<IProperty> }) => {
            const { error } = await supabase
                .from('properties')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
        },
    });

    const error = queryError instanceof Error ? queryError.message :
        updateMutation.error instanceof Error ? updateMutation.error.message :
            null;

    const updateProperty = async (id: string, updates: Partial<IProperty>) => {
        try {
            await updateMutation.mutateAsync({ id, updates });
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error updating property';
            return { success: false, error: message };
        }
    };

    return {
        propertyData,
        loading: loading || updateMutation.isPending,
        error,
        updateProperty
    };
};
