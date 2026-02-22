import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Ticket {
    id: number;
    created_at: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    image_url: string | null;
    property_id: string | null;
    created_by: string | null;
    assigned_to: string | null;
    space_location?: string | null;
}

export const useTickets = () => {
    const { user, propertyId, role } = useAuth();
    const queryClient = useQueryClient();
    const prevPropertyIdRef = useRef(propertyId);

    // Clear stale cache when tenant changes
    useEffect(() => {
        if (prevPropertyIdRef.current && prevPropertyIdRef.current !== propertyId) {
            queryClient.removeQueries({ queryKey: ['tickets', prevPropertyIdRef.current] });
        }
        prevPropertyIdRef.current = propertyId;
    }, [propertyId, queryClient]);

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

    // Realtime subscription with unique channel per property
    useEffect(() => {
        if (!user || !propertyId) return;

        const channelName = `tickets_${propertyId}`;
        const channel = supabase
            .channel(channelName)
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

        // Pause realtime when app goes to background (saves battery on mobile PWA)
        const handleVisibility = () => {
            if (document.hidden) {
                supabase.removeChannel(channel);
            } else {
                refetch();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            supabase.removeChannel(channel);
        };
    }, [user, propertyId, role, queryClient, refetch]);

    const createTicketMutation = useMutation({
        mutationFn: async (newTicket: Omit<Ticket, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('tickets')
                .insert([newTicket])
                .select()
                .single();

            if (error) throw error;
            return data as Ticket;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets', propertyId] });
        },
    });

    const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'created_by' | 'property_id' | 'status' | 'assigned_to'>) => {
        if (!user || !propertyId) return { success: false, error: 'User or property not identified' };

        try {
            const result = await createTicketMutation.mutateAsync({
                ...ticketData,
                created_by: user.id,
                property_id: propertyId,
                status: 'pendiente',
                assigned_to: null,
            });
            return { success: true, data: result };
        } catch (err: any) {
            console.error('Supabase Error details:', err);
            const message = err?.message || 'Error creating ticket';
            return { success: false, error: message };
        }
    };

    const updateTicketMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Partial<Ticket> }) => {
            const { data, error } = await supabase
                .from('tickets')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as Ticket;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets', propertyId] });
        },
    });

    const updateTicket = async (id: number, updates: Partial<Ticket>) => {
        try {
            const result = await updateTicketMutation.mutateAsync({ id, updates });
            return { success: true, data: result };
        } catch (err: any) {
            console.error('Update Ticket Error:', err);
            return { success: false, error: err?.message || 'Error updating ticket' };
        }
    };

    const error = queryError instanceof Error ? queryError.message :
        createTicketMutation.error instanceof Error ? createTicketMutation.error.message :
            updateTicketMutation.error instanceof Error ? updateTicketMutation.error.message :
                null;

    return {
        tickets,
        loading: loading || createTicketMutation.isPending || updateTicketMutation.isPending,
        error,
        createTicket,
        updateTicket,
        refresh: refetch
    };
};

export const useTicket = (id: string | number | undefined) => {
    const { data: ticket, isLoading: loading, error } = useQuery({
        queryKey: ['ticket', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('id', Number(id))
                .single();

            if (error) throw error;
            return data as Ticket;
        },
        enabled: !!id,
    });

    return { ticket, loading, error };
};
