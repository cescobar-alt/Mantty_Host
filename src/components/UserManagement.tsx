import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    Copy,
    Check,
    Mail,
    Loader2,
    Download,
    Send
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type AppRole = 'residente' | 'proveedor' | 'admin_uh';

export const UserManagement = () => {
    const { role, plan, propertyId, user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [inviteRole, setInviteRole] = useState<AppRole>('residente');
    const [isGenerating, setIsGenerating] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [emailToObject, setEmailToObject] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const [propertyName, setPropertyName] = useState('Mi Unidad Habitacional');

    React.useEffect(() => {
        const fetchPropertyName = async () => {
            if (propertyId) {
                const { data, error } = await supabase
                    .from('properties')
                    .select('name')
                    .eq('id', propertyId)
                    .single();
                if (data && !error) setPropertyName(data.name);
            }
        };
        fetchPropertyName();
    }, [propertyId]);

    // Fetch users in the current UH
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['uh-users', propertyId],
        queryFn: async () => {
            if (!propertyId) return [];

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('property_id', propertyId)
                .order('full_name', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!propertyId,
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            if (!propertyId) return;
            // For now, we just unlink the user from the property
            const { error } = await supabase
                .from('profiles')
                .update({ property_id: null, role: 'residente' })
                .eq('id', userId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uh-users', propertyId] });
            toast.success("Usuario removido de la propiedad");
        },
        onError: (error: any) => {
            toast.error("Error al remover usuario", { description: error.message });
        }
    });

    const handleDeleteUser = (userId: string, userName: string) => {
        if (confirm(`¿Estás seguro de remover a ${userName} de esta propiedad?`)) {
            deleteUserMutation.mutate(userId);
        }
    };

    const isPro = plan === 'plus' || plan === 'max';

    const generateInvite = async () => {
        if (!propertyId || !role) return;

        if (inviteRole === 'proveedor' && !isPro) {
            toast.error("Funcionalidad Pro", {
                description: "La gestión de proveedores solo está disponible en planes Plus o Max.",
            });
            return;
        }

        setIsGenerating(true);
        try {
            const code = crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();

            // Expiry: 7 days
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            // 1. Create invitation record in Supabase
            // Ensure 'invitations' table exists with correct schema
            const { error } = await supabase
                .from('invitations')
                .insert({
                    property_id: propertyId,
                    role: inviteRole,
                    code,
                    expires_at: expiresAt.toISOString(),
                });

            if (error) throw error;

            // 2. Generate Link
            const baseUrl = window.location.origin;
            // Matches the AuthPage logic we built: /auth?join=PROP_ID&code=CODE&uh=NAME
            const link = `${baseUrl}/auth?join=${propertyId}&code=${code}&uh=${encodeURIComponent(propertyName)}`;

            setInviteLink(link);
            toast.success("Enlace de invitación generado exitosamente");
        } catch (error: unknown) {
            console.error('Error generating invite:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error("Error al generar invitación", { description: message });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        toast.success("Copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
    };

    const sendInviteEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteLink || !emailToObject) return;

        setIsSendingEmail(true);
        try {
            const { error } = await supabase.functions.invoke('send-invite', {
                body: {
                    email: emailToObject,
                    inviteLink,
                    uhName: propertyName, // In production, ensure this is accurate
                    role: inviteRole
                }
            });

            if (error) throw error;

            toast.success(`Invitación enviada a ${emailToObject}`);
            setEmailToObject('');
        } catch (error: unknown) {
            console.error('Error sending email:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error("Error al enviar correo", { description: message });
        } finally {
            setIsSendingEmail(false);
        }
    };

    const downloadQRCode = () => {
        const svg = document.getElementById("invite-qr");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width + 40;
            canvas.height = img.height + 40;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 20, 20);
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `Invitacion-${inviteRole}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="space-y-6 animate-mantty-fade-in">
            {/* Invite Card */}
            <div className="glassmorphism rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-mantty-primary/10 flex items-center justify-center text-mantty-primary">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Invitar Usuarios</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Genera enlaces para residentes o proveedores.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Rol a invitar</label>
                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl overflow-x-auto">
                            {(['residente', 'proveedor', 'admin_uh'] as AppRole[]).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => { setInviteRole(r); setInviteLink(null); }}
                                    style={{ touchAction: 'manipulation' }}
                                    className={`flex-1 py-3.5 text-xs font-bold rounded-lg transition-all capitalize whitespace-nowrap active:scale-[0.97] ${inviteRole === r
                                        ? 'bg-white dark:bg-slate-800 text-mantty-primary shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {r.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateInvite}
                        disabled={isGenerating}
                        className="w-full py-2.5 rounded-xl mantty-gradient text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-mantty-primary/20 active:scale-[0.98] text-sm"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        Generar Enlace
                    </button>

                    {/* Result Section */}
                    {inviteLink && (
                        <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 space-y-6 animate-mantty-slide-up">

                            {/* Link Copy */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Enlace de Invitación</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        value={inviteLink}
                                        className="flex-1 min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 focus:outline-none truncate"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        style={{ touchAction: 'manipulation' }}
                                        className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl hover:text-mantty-primary transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Email Sending */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Enviar por Correo</label>
                                    <form onSubmit={sendInviteEmail} className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={emailToObject}
                                                onChange={(e) => setEmailToObject(e.target.value)}
                                                placeholder="usuario@email.com"
                                                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-1 focus:ring-mantty-primary"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSendingEmail}
                                            style={{ touchAction: 'manipulation' }}
                                            className="p-4 bg-mantty-secondary text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-mantty-secondary/20 min-w-[48px] min-h-[48px] flex items-center justify-center"
                                        >
                                            {isSendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        </button>
                                    </form>
                                    <p className="text-[10px] text-slate-400 italic px-1">Se enviará el enlace directamente a este correo.</p>
                                </div>

                                {/* QR Code */}
                                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/5">
                                    <div className="bg-white p-2 rounded-lg mb-3">
                                        <QRCodeSVG
                                            id="invite-qr"
                                            value={inviteLink}
                                            size={100}
                                            level="M"
                                            includeMargin={false}
                                        />
                                    </div>
                                    <button
                                        onClick={downloadQRCode}
                                        style={{ touchAction: 'manipulation' }}
                                        className="text-xs font-bold text-slate-500 hover:text-mantty-primary flex items-center gap-2 transition-colors py-3 px-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 min-h-[44px]"
                                    >
                                        <Download className="w-4 h-4" /> Descargar QR
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User List */}
            <div className="glassmorphism rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-transparent shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-mantty-primary/10 flex items-center justify-center text-mantty-primary">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lista de Usuarios</h3>
                            <p className="text-slate-500 text-sm">Gestiona los miembros de {propertyName}.</p>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 text-xs font-bold border border-slate-200 dark:border-white/5">
                            {users?.length || 0} Usuarios
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto -mx-5 sm:mx-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {usersLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : users?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <p className="text-slate-400 font-medium italic">No hay otros usuarios en esta propiedad.</p>
                                    </td>
                                </tr>
                            ) : (
                                users?.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-mantty-primary text-white flex items-center justify-center text-xs font-bold uppercase">
                                                    {u.full_name?.charAt(0) || u.email?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                                                    {u.full_name || 'Sin nombre'}
                                                    {u.id === currentUser?.id && <span className="ml-2 text-[10px] text-mantty-primary font-black uppercase">(Tú)</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.role === 'admin_uh' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                    u.role === 'proveedor' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                {u.role?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.full_name || u.email || 'este usuario')}
                                                disabled={u.id === currentUser?.id || deleteUserMutation.isPending}
                                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
