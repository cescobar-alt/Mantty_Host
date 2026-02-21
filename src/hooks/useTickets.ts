import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'pendiente' | 'en_progreso' | 'completado' | 'cancelado';
    priority: 'baja' | 'media' | 'alta' | 'critica';
    created_by: string;
    property_id: string;
    assigned_to?: string;
    image_url?: string;
    created_at: string;
}

export const useTickets = () => {
    const { user, propertyId, role } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        if (!user || !propertyId) return;

        setLoading(true);
        try {
            let query = supabase
                .from('tickets')
                .select('*')
                .eq('property_id', propertyId);

            // Filter for residents
            if (role === 'residente') {
                query = query.eq('created_by', user.id);
            }

            const { data, error: sbError } = await query.order('created_at', { ascending: false });

            if (sbError) throw sbError;
            setTickets((data || []) as Ticket[]);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user, propertyId, role]);

    useEffect(() => {
        if (user && propertyId) {
            fetchTickets();

            // Realtime subscription
            const channel = supabase
                .channel('tickets_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'tickets',
                        filter: `property_id=eq.${propertyId}`
                    },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            const newTicket = payload.new as Ticket;
                            // For residents, only add if they created it
                            if (role !== 'residente' || newTicket.created_by === user.id) {
                                setTickets((prev) => [newTicket, ...prev]);
                            }
                        } else if (payload.eventType === 'UPDATE') {
                            setTickets((prev) =>
                                prev.map((t) => (t.id === payload.new.id ? { ...t, ...payload.new as Partial<Ticket> } : t))
                            );
                        } else if (payload.eventType === 'DELETE') {
                            setTickets((prev) => prev.filter((t) => t.id !== payload.old.id));
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user, propertyId, role, fetchTickets]);

    return { tickets, loading, error, refresh: fetchTickets };
};
