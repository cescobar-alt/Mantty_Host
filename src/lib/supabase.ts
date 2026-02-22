import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. ' +
        'Copy .env.example to .env and fill in your project credentials.'
    );
}

export const supabase = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            // Bypass Navigator LockManager to prevent NavigatorLockAcquireTimeoutError
            // especially common in development with HMR or multiple tabs
            lock: async (_name, _timeout, fn) => {
                return await fn();
            }
        }
    }
);
