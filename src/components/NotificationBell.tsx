import { useEffect, useState } from 'react';
import { Bell, Check, Clock, Inbox, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Tables } from '../types/database.types';

export type Notification = Tables<'notifications'>;

export const NotificationBell = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        data: notifications = [],
    } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data as Notification[];
        },
        enabled: !!user,
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            if (!user) return;
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
        },
    });

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('notifications_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, queryClient]);

    useEffect(() => {
        if (isOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-mantty-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group shadow-sm active:scale-95"
                aria-label="Notificaciones"
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-mantty-swing' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/20 lg:bg-transparent"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="
                        fixed lg:absolute
                        bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-0 lg:top-full
                        lg:mt-3 lg:w-80
                        glassmorphism
                        border-0 lg:border border-slate-200 dark:border-white/10
                        rounded-t-[1.5rem] lg:rounded-[1.5rem]
                        shadow-2xl z-50 animate-slide-up-panel lg:animate-mantty-slide-up
                        overflow-hidden max-h-[80vh] lg:max-h-[500px]
                    ">
                        <div className="lg:hidden flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                        </div>

                        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-mantty-primary" />
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="text-xs font-black bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsReadMutation.mutate()}
                                        className="text-[10px] font-black uppercase tracking-wider text-mantty-primary hover:opacity-80 transition-opacity px-2 py-1"
                                    >
                                        marcar todo
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[60vh] lg:max-h-[400px]">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                        <Inbox className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No tienes notificaciones</p>
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 border-b border-slate-50 dark:border-white/5 flex gap-4 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 dark:active:bg-white/10 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-mantty-primary/5' : ''}`}
                                        onClick={() => markAsReadMutation.mutate(n.id)}
                                    >
                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.type === 'assignment' ? 'bg-blue-500/10 text-blue-500' : 'bg-mantty-primary/10 text-mantty-primary'
                                            }`}>
                                            {n.type === 'assignment' ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className={`text-sm leading-tight mb-1 ${!n.is_read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 mb-1">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                {n.created_at ? (() => {
                                                    try {
                                                        return formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es });
                                                    } catch {
                                                        return 'hace un momento';
                                                    }
                                                })() : 'hace un momento'}
                                            </p>
                                        </div>
                                        {!n.is_read && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-white/5 safe-area-bottom">
                                <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-mantty-primary transition-colors py-2">
                                    Ver todas las notificaciones
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
