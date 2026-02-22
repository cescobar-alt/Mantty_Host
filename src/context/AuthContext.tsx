import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { UserRole, PlanType } from '../lib/permissions';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: UserRole | null;
    plan: PlanType | null;
    propertyId: string | null;
    extraUhCapacity: number;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    setPropertyId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [plan, setPlan] = useState<PlanType | null>(null);
    const [propertyId, setPropertyId] = useState<string | null>(() => localStorage.getItem('mantty_property_id'));
    const [extraUhCapacity, setExtraUhCapacity] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async (userId: string) => {
        try {
            console.log('Fetching profile for:', userId);
            const { data, error } = await supabase
                .from('profiles')
                .select('role, plan, property_id, extra_uh_capacity')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('Profile not found yet, likely being initialized.');
                } else {
                    console.error('Error fetching profile:', error);
                }
                setIsLoading(false); // Ensure loading stops even on error
                return;
            }

            if (data) {
                console.log('Profile fetched successfully. Current property:', data.property_id);
                setRole(data.role as UserRole);
                setPlan(data.plan as PlanType);
                setExtraUhCapacity(data.extra_uh_capacity || 0);

                // Only update propertyId if it's different to avoid redundant re-renders
                // or if we want to ensure sync with DB. 
                // Note: manual setPropertyId might have already updated this.
                if (data.property_id !== propertyId) {
                    setPropertyId(data.property_id);
                    if (data.property_id) {
                        localStorage.setItem('mantty_property_id', data.property_id);
                    } else {
                        localStorage.removeItem('mantty_property_id');
                    }
                }
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 1. Initial Load
        const initAuth = async () => {
            // Safety timeout: ensure loading finishes even if Supabase hangs
            const timeout = setTimeout(() => {
                if (isLoading) {
                    setIsLoading(false);
                    console.warn('Auth initialization timed out (15s), forcing loading to finish.');
                }
            }, 15000);

            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchUserProfile(session.user.id);
                }
            } catch (err) {
                console.error('Initial auth failed:', err);
            } finally {
                clearTimeout(timeout);
                setIsLoading(false);
            }
        };

        initAuth();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchUserProfile(session.user.id);
            } else {
                setRole(null);
                setPlan(null);
                setPropertyId(null);
                localStorage.removeItem('mantty_property_id');
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (user) await fetchUserProfile(user.id);
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            console.log('Attempting sign out...');
            localStorage.removeItem('mantty_property_id');
            await supabase.auth.signOut();

            // Explicit state cleanup in case listener is slow
            setUser(null);
            setSession(null);
            setRole(null);
            setPlan(null);
            setPropertyId(null);
        } catch (err) {
            console.error('Error during signOut:', err);
        } finally {
            // Give system a tiny moment to settle then force loading off
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const updatePropertyId = (id: string | null) => {
        setPropertyId(id);
        if (id) {
            localStorage.setItem('mantty_property_id', id);
        } else {
            localStorage.removeItem('mantty_property_id');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            role,
            plan,
            propertyId,
            extraUhCapacity,
            isLoading,
            signOut,
            refreshProfile,
            setPropertyId: updatePropertyId
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
