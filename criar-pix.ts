import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const NOTIFICATION_URL = "https://ejapatxehmxondjqsgvv.supabase.co/functions/v1/webhook-mercadopago";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Preflight do navegador
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { produto, nome, email, valor, descricao } = await req.json();

    if (!email || !produto || !valor) {
      return new Response(
        JSON.stringify({ error: "Dados incompletos (email, produto e valor são obrigatórios)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Chave única por tentativa — evita cobrança duplicada se o navegador reenviar a requisição
    const idempotencyKey = `${produto}-${email}-${Date.now()}`;

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + MP_TOKEN,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        transaction_amount: Number(valor),
        description: descricao || produto,
        payment_method_id: "pix",
        payer: { email, first_name: nome || undefined },
        external_reference: produto,
        metadata: { produto },
        notification_url: NOTIFICATION_URL,
      }),
    });

    const payment = await mpRes.json();

    if (!mpRes.ok) {
      console.error("Erro Mercado Pago:", JSON.stringify(payment));
      return new Response(
        JSON.stringify({ error: "Erro ao criar pagamento no Mercado Pago", detalhe: payment }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const td = payment.point_of_interaction?.transaction_data;

    return new Response(
      JSON.stringify({
        id: payment.id,
        status: payment.status,
        qr_code: td?.qr_code || null,
        qr_code_base64: td?.qr_code_base64 || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("Erro interno criar-pix:", e);
    return new Response(
      JSON.stringify({ error: "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
