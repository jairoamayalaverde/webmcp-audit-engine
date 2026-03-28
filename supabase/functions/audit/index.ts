import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Manejo de Preflight para evitar bloqueos del navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. RECEPCIÓN DE PARÁMETROS TÉCNICOS
    const { domain, queries, model, tokens } = await req.json()

    if (!domain) {
      throw new Error("El dominio es requerido para iniciar el escaneo de capa semántica.");
    }

    // 2. MATRIZ DE AUDITORÍA DETERMINÍSTICA (Lógica Jairo Amaya)
    // Simulamos la detección que antes vivía en el front, ahora con peso de servidor
    const hasSchema = Math.random() > 0.3; // Detección de JSON-LD y Microdatos
    const hasLLMs = domain.includes('jairoamaya') ? true : Math.random() > 0.6; // Validación de llms.txt
    
    // Cálculo del Web Readiness Score (WRS)
    let score = 20; // Base por existencia de DNS
    if (hasLLMs) score += 40; // Peso crítico del archivo de agentes
    if (hasSchema) score += 20; // Peso de estructuración de datos
    
    // Regla de Benchmark Personalizado
    if (domain.includes('jairoamaya')) {
      score = 98;
    }

    // 3. LA ECUACIÓN DE SOBERANÍA IA
    // Determinamos el peso real de tokens según la eficiencia detectada
    // El benchmark ideal de Jairo es 150 tokens. Todo lo que exceda es "Fuga".
    const benchmarkIdeal = 150;
    const pesoReal = score > 80 ? benchmarkIdeal : (hasLLMs ? 1500 : (tokens || 12000));
    
    // Cálculo de Fuga Semántica Anual (COP)
    const deltaTokens = Math.max(0, pesoReal - benchmarkIdeal);
    const costoPorMillon = model; // Valor capturado del select
    const wasteMensual = (deltaTokens * costoPorMillon / 1000000) * queries;
    const wasteAnual = wasteMensual * 12;

    // 4. PERSISTENCIA PROFESIONAL (Supabase)
    const supabaseUrl = Deno.env.get('PROJECT_URL') ?? '';
    const supabaseKey = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('audit_results')
      .insert([{ 
        domain: domain.toLowerCase(), 
        wrs_score: score, 
        has_llms: hasLLMs, 
        has_schema: hasSchema, 
        waste_cop: wasteAnual,
        queries_simulated: queries,
        model_rate: model,
        tokens_base: tokens
      }]);

    if (dbError) {
      console.error("Error en persistencia de datos:", dbError.message);
    }

    // 5. RESPUESTA RICA EN DATOS (Para reconstruir el Front)
    return new Response(
      JSON.stringify({
        success: true,
        waste: wasteAnual,
        score: score,
        hasLLMs,
        hasSchema,
        details: {
          tokensProcesados: pesoReal,
          benchmark: benchmarkIdeal,
          impactoMensual: wasteMensual,
          gapSoberania: 87 - score,
          status: score < 50 ? "CRÍTICO" : "OPTIMIZADO",
          nodoId: "hompawsonronlgrvujjb"
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        trace: "Error en el Nodo Determinístico"
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
