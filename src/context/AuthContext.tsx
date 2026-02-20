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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [plan, setPlan] = useState<PlanType | null>(null);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [extraUhCapacity, setExtraUhCapacity] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, plan, property_id, extra_uh_capacity')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('Profile not found yet, might be being created by trigger.');
                } else {
                    console.error('Error fetching profile:', error);
                }
                return;
            }

            if (data) {
                setRole(data.role as UserRole);
                setPlan(data.plan as PlanType);
                setPropertyId(data.property_id);
                setExtraUhCapacity(data.extra_uh_capacity || 0);
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error);
        }
    };

    useEffect(() => {
        // 1. Initial Load
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchUserProfile(session.user.id);
            }
            setIsLoading(false);
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
        await supabase.auth.signOut();
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
            refreshProfile
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
