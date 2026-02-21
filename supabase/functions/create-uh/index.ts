import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Project secrets (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) are missing.')
        }

        const supabaseClient = createClient(
            supabaseUrl,
            supabaseServiceKey
        )

        // Get the user from the token
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Falta el encabezado de autorización')

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
        if (userError || !user) throw new Error('No autorizado: ' + (userError?.message || 'Usuario no encontrado'))

        // Parse body
        const { name, address } = await req.json()

        if (!name || !address) {
            throw new Error('Faltan campos obligatorios: nombre y dirección')
        }

        // 1. Get user plan and current UH count
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('plan, role, extra_uh_capacity')
            .eq('id', user.id)
            .single()

        if (profileError) throw profileError

        // 2. Validate limits (basic=1, plus=5, max=infinite)
        const { count, error: countError } = await supabaseClient
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('admin_id', user.id)

        if (countError) throw countError

        const planLimits: Record<string, number> = {
            'basic': 1,
            'plus': 5,
            'max': 999
        }

        const baseLimit = planLimits[profile.plan] || 1
        const totalLimit = baseLimit + (profile.extra_uh_capacity || 0)

        if (count !== null && count >= totalLimit) {
            throw new Error(`Has alcanzado el límite de Unidades Habitacionales para tu plan (${profile.plan}). Límite actual: ${totalLimit}.`)
        }

        // 3. Create the UH
        const { data: property, error: propError } = await supabaseClient
            .from('properties')
            .insert({
                name,
                address,
                admin_id: user.id,
                // metadata: { city, phone } // if we want to store extra info
            })
            .select()
            .single()

        if (propError) throw propError

        // 4. Update profile with role and property_id
        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
                role: 'admin_uh',
                property_id: property.id
            })
            .eq('id', user.id)

        if (updateError) throw updateError

        return new Response(
            JSON.stringify({ success: true, property }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error create-uh:', error)
        return new Response(
            JSON.stringify({ error: message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
