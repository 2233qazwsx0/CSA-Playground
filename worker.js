const KV_OBFUSCATIONS = "obfuscations";
const KV_DOWNLOADS = "downloads";

async function incr(env, key) {
  const cur = parseInt(await env.CSA_STATS.get(key) || "0", 10);
  const next = (isNaN(cur) ? 0 : cur) + 1;
  await env.CSA_STATS.put(key, String(next));
  return next;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/api/stats" && request.method === "POST") {
      const n = await incr(env, KV_OBFUSCATIONS);
      return new Response(JSON.stringify({ ok: true, obfuscations: n }), { headers: { "content-type": "application/json" } });
    }
    if (path === "/api/download" && request.method === "POST") {
      const n = await incr(env, KV_DOWNLOADS);
      return new Response(JSON.stringify({ ok: true, downloads: n }), { headers: { "content-type": "application/json" } });
    }
    if (path === "/api/stats" && request.method === "GET") {
      const obf = await env.CSA_STATS.get(KV_OBFUSCATIONS) || "0";
      const dl = await env.CSA_STATS.get(KV_DOWNLOADS) || "0";
      return new Response(JSON.stringify({ obfuscations: parseInt(obf, 10), downloads: parseInt(dl, 10) }), { headers: { "content-type": "application/json" } });
    }
    return new Response("Not found", { status: 404 });
  }
};