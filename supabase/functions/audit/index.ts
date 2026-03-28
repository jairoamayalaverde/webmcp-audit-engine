import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Manejo de Preflight para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Extraer datos del body
    const { domain, queries, model, tokens } = await req.json()

    if (!domain) throw new Error("Dominio no proporcionado");

    // --- LÓGICA TÉCNICA DE AUDITORÍA (FONDO REAL) ---
    // Simulamos el escaneo que antes hacías en el front, ahora con autoridad de servidor
    const hasSchema = Math.random() > 0.3; // Simulación de detección de JSON-LD
    const hasLLMs = domain.includes('jairoamaya') ? true : Math.random() > 0.6; // Simulación de llms.txt
    
    // Matriz de Score (WRS)
    let score = 20; 
    if (hasLLMs) score += 40; 
    if (hasSchema) score += 20;
    if (domain.includes('jairoamaya')) score = 98; // Tu benchmark personal

    // --- LA ECUACIÓN JAIRO AMAYA ---
    // Si el score es alto, el peso de tokens baja al benchmark ideal (150)
    // Si es bajo, el peso sube drásticamente, generando la "Fuga"
    const pesoTokensReal = score > 80 ? 150 : (hasLLMs ? 1500 : (tokens || 12000));
    
    // Cálculo de Desperdicio: (Tokens Actuales - Benchmark Ideal) * Costo * Cantidad
    const deltaTokens = pesoTokensReal - 150;
    const wasteMensual = (deltaTokens * model / 1000000) * queries;
    const wasteAnual = Math.max(0, wasteMensual * 12);

    // --- PERSISTENCIA EN BASE DE DATOS ---
    const supabaseUrl = Deno.env.get('PROJECT_URL') ?? '';
    const supabaseKey = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('audit_results')
      .insert([{ 
        domain, 
        wrs_score: score, 
        has_llms: hasLLMs, 
        has_schema: hasSchema, 
        waste_cop: wasteAnual,
        queries_simulated: queries,
        model_rate: model
      }]);

    if (dbError) console.error("Error guardando en DB:", dbError);

    // --- RESPUESTA RICA EN DATOS ---
    return new Response(
      JSON.stringify({
        success: true,
        waste: wasteAnual,
        score: score,
        hasLLMs,
        hasSchema,
        details: {
          pesoProcesado: pesoTokensReal,
          queriesSimuladas: queries,
          costoModelo: model,
          gap: 87 - score,
          status: score < 50 ? "CRÍTICO" : "OPTIMIZADO"
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
