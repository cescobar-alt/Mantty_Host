import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useProperties = (propertyId?: string) => {
    const [propertyData, setPropertyData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProperty = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: sbError } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (sbError) throw sbError;
            setPropertyData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProperty = async (id: string, updates: any) => {
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
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (propertyId) {
            fetchProperty(propertyId);
        }
    }, [propertyId]);

    return {
        propertyData,
        loading,
        error,
        fetchProperty,
        updateProperty
    };
};
