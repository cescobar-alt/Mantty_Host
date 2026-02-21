import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Tables } from '../types/database.types';

export type Ticket = Tables<'tickets'>;

export const useTickets = () => {
    const { user, propertyId, role } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: tickets = [],
        isLoading: loading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: ['tickets', propertyId, role, user?.id],
        queryFn: async () => {
            if (!user || !propertyId) return [];

            let query = supabase
                .from('tickets')
                .select('*')
                .eq('property_id', propertyId);

            if (role === 'residente') {
                query = query.eq('created_by', user.id);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data as Ticket[];
        },
        enabled: !!user && !!propertyId,
    });

    useEffect(() => {
        if (!user || !propertyId) return;

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
                    const queryKey = ['tickets', propertyId, role, user.id];

                    if (payload.eventType === 'INSERT') {
                        const newTicket = payload.new as Ticket;
                        if (role !== 'residente' || newTicket.created_by === user.id) {
                            queryClient.setQueryData<Ticket[]>(queryKey, (prev) =>
                                prev ? [newTicket, ...prev] : [newTicket]
                            );
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        const updatedTicket = payload.new as Ticket;
                        queryClient.setQueryData<Ticket[]>(queryKey, (prev) =>
                            prev?.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        const oldId = (payload.old as { id: number }).id;
                        queryClient.setQueryData<Ticket[]>(queryKey, (prev) =>
                            prev?.filter((t) => t.id !== oldId)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, propertyId, role, queryClient]);

    const error = queryError instanceof Error ? queryError.message : null;

    return { tickets, loading, error, refresh: refetch };
};
