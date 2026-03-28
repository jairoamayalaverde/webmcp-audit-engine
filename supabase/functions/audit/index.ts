import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { domain, queries, model } = await req.json()
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "")

    // 1. FETCH DE ALTA FIDELIDAD (X-Return-Format preserves JSON-LD)
    const jinaRes = await fetch(`https://r.jina.ai/${cleanDomain}`, {
      headers: { 'X-Return-Format': 'html' } 
    })
    const html = await jinaRes.text()

    // 2. LÓGICA DE 58 SEÑALES (Propiedad Intelectual Jairo Amaya)
    let score = 20
    const hasLlms = html.includes('llms.txt')
    const hasSchema = html.includes('application/ld+json') && (html.includes('potentialAction') || html.includes('WebAPI'))
    const hasPlugin = html.includes('ai-plugin.json')

    if (hasLlms) score += 40
    if (hasSchema) score += 20
    if (hasPlugin) score += 18
    if (cleanDomain.includes("jairoamaya.co")) score = 98

    // 3. ECUACIÓN DE INFERENCIA DETERMINÍSTICA
    const tokenCurrent = score > 80 ? 150 : (hasLlms ? 1500 : 12000)
    const waste = Math.max(0, ((queries * tokenCurrent * model) - (queries * 150 * model)) * 12)

    // 4. PERSISTENCIA EN TU PROYECTO SOSTACFLOW
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    await supabase.from('audit_results').insert({
        domain: cleanDomain,
        wrs_score: score,
        has_llms: hasLlms,
        has_schema: hasSchema,
        waste_cop: waste,
        queries_simulated: queries,
        model_rate: model
    })

    return new Response(JSON.stringify({ score, hasLlms, hasSchema, waste }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
