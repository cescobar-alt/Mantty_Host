import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteRequest {
    email: string
    inviteLink: string
    uhName: string
    role: string
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { email, inviteLink, uhName, role }: InviteRequest = await req.json()

        if (!email || !inviteLink || !uhName) {
            return new Response(
                JSON.stringify({ error: 'Faltan campos requeridos (email, inviteLink, uhName)' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        console.log(`Procesando invitación para: ${email} en ${uhName} (${role})`)

        // Check for API Key
        if (!RESEND_API_KEY) {
            console.log(`[MOCK MODE] Simulating email to ${email}`)
            console.log(`Link: ${inviteLink}`)

            return new Response(
                JSON.stringify({
                    message: 'Email simulado (Falta RESEND_API_KEY)',
                    success: true,
                    mock: true
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // Send via Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Mantty Host <noreply@mantty.co>', // Update with your verify domain or use 'onboarding@resend.dev' for testing
                to: [email],
                subject: `Invitación a ${uhName} - Mantty Host`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Bienvenido a Mantty</h1>
            <p>Has sido invitado a formar parte de la administración y gestión de <strong>${uhName}</strong> con el rol de <strong>${role}</strong>.</p>
            
            <div style="margin: 30px 0;">
              <a href="${inviteLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Aceptar Invitación y Crear Cuenta
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia este enlace en tu navegador:</p>
            <p style="color: #666; font-size: 14px; word-break: break-all;">${inviteLink}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Enviado por Mantty Host Platform
            </p>
          </div>
        `,
            }),
        })

        if (!res.ok) {
            const errorData = await res.text()
            throw new Error(`Error de Resend: ${errorData}`)
        }

        const data = await res.json()

        return new Response(
            JSON.stringify({ message: 'Invitación enviada correctamente', id: data.id, success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        console.error('Error sending invite:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
