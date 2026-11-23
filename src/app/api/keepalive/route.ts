import { serverClient } from "@/lib/supabase";

/**
 * Lo llama Vercel una vez al día (vercel.json → crons). Hace una consulta mínima para
 * que el plan gratuito de Supabase no pause el proyecto por inactividad (pausa a los 7 días).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const sb = serverClient();
  if (!sb) return Response.json({ ok: true, supabase: false });
  const { error } = await sb.from("settings").select("id").eq("id", 1).maybeSingle();
  return Response.json({ ok: !error }, { status: error ? 500 : 200, headers: { "Cache-Control": "no-store" } });
}
