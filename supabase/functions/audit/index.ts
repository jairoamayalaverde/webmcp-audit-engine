import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// Importación corregida para evitar el error de "Module not found"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { domain, queries, model, tokens } = await req.json()
    
    // 1. Simulación de Escaneo (Recuperando la lógica original)
    const hasSchema = Math.random() > 0.3;
    const hasLLMs = domain.includes('jairoamaya') ? true : Math.random() > 0.6;
    
    // 2. Lógica WRS Senior (Tu Benchmark personalizado)
    let score = 20;
    if (hasLLMs) score += 40;
    if (hasSchema) score += 20;
    if (domain.includes('jairoamaya')) score = 98;

    // 3. LA ECUACIÓN JAIRO AMAYA (Transferida al Nodo)
    const pesoReal = score > 80 ? 150 : (hasLLMs ? 1500 : (tokens || 12000));
    const wasteAnual = Math.max(0, ((queries * pesoReal * model) - (queries * 150 * model)) * 12);

    // 4. Conexión a Base de Datos (Usando tus llaves de proyecto)
    const supabase = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    // Guardar el registro para tu base de datos
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
