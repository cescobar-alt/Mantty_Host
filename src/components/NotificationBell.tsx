import { useEffect, useState } from 'react';
import { Bell, Check, Clock, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    ticket_id: number;
    is_read: boolean;
    created_at: string;
}

export const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (!user) return;

        // Realtime subscription
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
                (payload) => {
                    setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 10));
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (!error) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-mantty-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group shadow-sm"
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-mantty-swing' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-50 animate-mantty-slide-up overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-mantty-primary" />
                                Notificaciones
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-black uppercase tracking-wider text-mantty-primary hover:opacity-80 transition-opacity"
                                >
                                    marcar todo
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
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
                                        className={`p-4 border-b border-slate-50 dark:border-white/5 flex gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-mantty-primary/5' : ''}`}
                                        onClick={() => markAsRead(n.id)}
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
                                                    } catch (e) {
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
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-white/5">
                                <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-mantty-primary transition-colors">
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
