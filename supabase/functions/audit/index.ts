import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-client@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { domain, queries, model, tokens } = await req.json()
    
    // 1. Simulación de Escaneo Técnico (Riqueza de Datos)
    const hasSchema = Math.random() > 0.3;
    const hasLLMs = domain.includes('jairoamaya') ? true : Math.random() > 0.6;
    
    // 2. Lógica WRS Senior
    let score = 20;
    if (hasLLMs) score += 40;
    if (hasSchema) score += 20;
    if (domain.includes('jairoamaya')) score = 98;

    // 3. LA ECUACIÓN JAIRO AMAYA (Ejecutada en el Nodo)
    const pesoReal = score > 80 ? 150 : (hasLLMs ? 1500 : tokens);
    const wasteAnual = Math.max(0, ((queries * pesoReal * model) - (queries * 150 * model)) * 12);

    // 4. Conexión a Base de Datos
    const supabase = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    await supabase.from('audit_results').insert([
      { 
        domain, 
        wrs_score: score, 
        has_llms: hasLLMs, 
        has_schema: hasSchema, 
        waste_cop: wasteAnual,
        queries_simulated: queries,
        model_rate: model
      }
    ])

    return new Response(
      JSON.stringify({ 
        waste: wasteAnual, 
        score: score, 
        hasSchema, 
        hasLLMs, 
        pesoReal,
        queries,
        modelPrice: model,
        tokensBase: tokens
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
