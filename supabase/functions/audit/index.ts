import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { domain, queries, model, tokens } = await req.json()
    
    // Lógica Técnica Jairo Amaya
    const hasSchema = Math.random() > 0.3;
    const hasLLMs = domain.includes('jairoamaya') ? true : Math.random() > 0.6;
    let score = domain.includes('jairoamaya') ? 98 : (hasLLMs ? 60 : 25 + (hasSchema ? 15 : 0));

    // LA ECUACIÓN DE JAIRO (Benchmark 150)
    const pesoReal = score > 80 ? 150 : (hasLLMs ? 1500 : (tokens || 12000));
    const wasteAnual = Math.max(0, ((queries * pesoReal * model) - (queries * 150 * model)) * 12);
    const gap = 87 - score;

    // Persistencia en DB
    const supabase = createClient(Deno.env.get('PROJECT_URL') ?? '', Deno.env.get('SERVICE_ROLE_KEY') ?? '')
    await supabase.from('audit_results').insert([{ domain, wrs_score: score, waste_cop: wasteAnual, queries_simulated: queries }])

    // RESPUESTA SINCRONIZADA (Evita el 'undefined')
    return new Response(
      JSON.stringify({ 
        waste: wasteAnual, 
        score, 
        hasLLMs, 
        hasSchema, 
        pesoReal, // Este nombre debe ser exacto al HTML
        q: queries, 
        p: model, 
        gap,
        status: score < 50 ? "CRÍTICO" : "OPTIMIZADO"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) { return new Response(JSON.stringify({error: e.message}), { status: 400, headers: corsHeaders }) }
})
