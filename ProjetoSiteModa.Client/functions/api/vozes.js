const MAX_BYTES = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const unavailable = 'O envio está temporariamente indisponível. Seu texto foi mantido; tente novamente mais tarde.';

function response(status, mensagem, extraHeaders = {}) {
  return Response.json({ mensagem }, { status, headers: {
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders,
  }});
}

async function readBody(request) {
  if (Number(request.headers.get('content-length') || 0) > MAX_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

// Apenas escrita: não há endpoint público para listar ou consultar relatos.
export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return response(405, 'Método não permitido.', { Allow: 'POST' });
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') {
    return response(403, 'Origem não permitida.');
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return response(415, 'Formato de envio inválido.');
  }
  let payload;
  try {
    const body = await readBody(request);
    if (body === null) return response(413, 'A mensagem ultrapassou o tamanho permitido.');
    payload = JSON.parse(body);
  } catch { return response(400, 'Não foi possível ler a mensagem.'); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return response(400, 'Envio inválido.');
  const { id, texto, website } = payload;
  if (typeof id !== 'string' || !UUID.test(id)) return response(400, 'Identificador de envio inválido.');
  if (website) return response(400, 'Envio inválido.');
  if (typeof texto !== 'string' || texto.trim().length < 3 || texto.trim().length > 1000) {
    return response(400, 'Escreva entre 3 e 1.000 caracteres.');
  }
  if (!env?.VOZES_DB) return response(503, unavailable);
  try {
    const result = await env.VOZES_DB.prepare(
      'INSERT INTO mensagens (id, texto, criado_em) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING'
    ).bind(id, texto.trim(), new Date().toISOString()).run();
    if (!result.success) return response(503, unavailable);
  } catch {
    // Não registrar texto nem detalhes do banco nos logs públicos da aplicação.
    return response(503, unavailable);
  }
  return response(201, 'Sua mensagem foi recebida pela equipe CLAMA. Obrigada por compartilhar sua voz.');
}
