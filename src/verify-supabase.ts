/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from './lib/supabase';

async function verifyConnection() {
    console.log('Verificando conexión a Supabase...');
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL);

    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            if (error.message.includes('relation "public.profiles" does not exist')) {
                console.log('✅ Conexión exitosa, pero la tabla "profiles" no existe aún. (Asegúrate de ejecutar el script SQL)');
            } else {
                console.error('❌ Error de conexión:', error.message);
            }
        } else {
            console.log('✅ Conexión exitosa y tabla "profiles" detectada.');
        }
    } catch (err) {
        console.error('❌ Error inesperado:', err);
    }
}

// verifyConnection(); 
