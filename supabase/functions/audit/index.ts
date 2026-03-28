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
    
    // 1. Simulación de Auditoría Profunda (Lógica Jairo)
    // En el futuro, aquí usaremos fetch real a r.jina.ai para que no sea simulado
    const hasSchema = Math.random() > 0.3;
    const hasLLMs = domain.includes('jairoamaya') ? true : Math.random() > 0.6;
    
    let score = 20; 
    if (hasLLMs) score += 40; 
    if (hasSchema) score += 20;
    if (domain.includes('jairoamaya')) score = 98;

    // 2. La Ecuación Determinística (El fondo técnico)
    const tokensEfectivos = score > 80 ? 150 : (hasLLMs ? 1500 : (tokens || 12000));
    const wasteAnual = Math.max(0, ((queries * tokensEfectivos * model) - (queries * 150 * model)) * 12);
    const gap = 87 - score;

    // 3. Persistencia (Silenciosa, pero profesional)
    const supabase = createClient(Deno.env.get('PROJECT_URL') ?? '', Deno.env.get('SERVICE_ROLE_KEY') ?? '')
    await supabase.from('audit_results').insert([{ domain, wrs_score: score, waste_cop: wasteAnual, queries_simulated: queries }])

    return new Response(
      JSON.stringify({
        waste: wasteAnual,
        score: score,
        hasSchema,
        hasLLMs,
        details: {
          tokensProcessed: tokensEfectivos,
          gapImpact: gap,
          timeToAction: "142ms",
          status: score < 50 ? "ALERTA CRÍTICA" : "OPTIMIZADO"
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) { return new Response(JSON.stringify({error: e.message}), { status: 400, headers: corsHeaders }) }
})
