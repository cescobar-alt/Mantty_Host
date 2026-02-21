import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface IProperty {
    id: string;
    name: string;
    address: string | null;
    admin_id: string;
    logo_url?: string;
    created_at: string;
}

export const useProperties = (propertyId?: string) => {
    const [propertyData, setPropertyData] = useState<IProperty | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProperty = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (sbError) throw sbError;
            setPropertyData(data as IProperty);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProperty = async (id: string, updates: Partial<IProperty>) => {
        setLoading(true);
        setError(null);
        try {
            const { error: sbError } = await supabase
                .from('properties')
                .update(updates)
                .eq('id', id);

            if (sbError) throw sbError;
            await fetchProperty(id);
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (propertyId) {
            fetchProperty(propertyId);
        }
    }, [propertyId, fetchProperty]);

    return {
        propertyData,
        loading,
        error,
        fetchProperty,
        updateProperty
    };
};
