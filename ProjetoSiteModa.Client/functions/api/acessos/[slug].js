const slugs = new Set(['dor', 'danos', 'culpa', 'resistencia', 'heranca', 'libertacao']);

export async function onRequest({ request, env, params }) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const reply = (status) => new Response(null, { status, headers });
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { ...headers, Allow: 'POST' } });
  }
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      request.headers.get('sec-fetch-site') === 'cross-site') return reply(403);
  if (!slugs.has(params.slug)) return reply(404);
  if (!env?.VOZES_DB) return reply(503);
  try {
    const result = await env.VOZES_DB.prepare(
      'UPDATE acessos_pecas SET total = total + 1 WHERE slug = ?'
    ).bind(params.slug).run();
    if (!result.success || result.meta?.changes !== 1) return reply(503);
    return reply(204);
  } catch {
    return reply(503);
  }
}
