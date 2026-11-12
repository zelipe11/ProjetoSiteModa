const TABLES = [
  ['mensagens', 'SELECT id, texto, criado_em FROM mensagens ORDER BY criado_em, id LIMIT 10001'],
  ['contatos', 'SELECT id, nome, celular, email, mensagem, criado_em FROM contatos ORDER BY criado_em, id LIMIT 10001'],
  ['acessos_pecas', 'SELECT slug, nome, total FROM acessos_pecas ORDER BY slug LIMIT 10001'],
  ['acessos_abas', 'SELECT slug, nome, total FROM acessos_abas ORDER BY slug LIMIT 10001'],
];

function response(status, body, headers = {}) {
  return Response.json(body, { status, headers: {
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers,
  } });
}

async function matchesToken(received, expected) {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([received, expected].map(value =>
    crypto.subtle.digest('SHA-256', encoder.encode(value))));
  const left = new Uint8Array(a), right = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

// Exportação privada, autorizada somente por segredo no cabeçalho. Nunca usar no frontend.
export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return response(405, { erro: 'Método não permitido.' }, { Allow: 'GET' });
  const secret = env?.PLANILHAS_TOKEN;
  if (typeof secret !== 'string' || secret.length < 32 || !env?.VOZES_DB) {
    return response(503, { erro: 'Integração não configurada.' });
  }
  const authorization = request.headers.get('authorization') || '';
  if (authorization.length > 4096 || !authorization.startsWith('Bearer ') ||
      !await matchesToken(authorization.slice(7), secret)) {
    return response(401, { erro: 'Não autorizado.' });
  }
  try {
    // Um batch mantém as quatro consultas no mesmo snapshot do banco.
    const results = await env.VOZES_DB.batch(TABLES.map(([, sql]) => env.VOZES_DB.prepare(sql)));
    if (results.length !== TABLES.length || results.some(result => !result.success || !Array.isArray(result.results))) {
      throw new Error('Consulta indisponível');
    }
    if (results.some(result => result.results.length > 10000)) {
      return response(413, { erro: 'Exportação acima de 10.000 registros por tabela. É necessário implementar paginação.' });
    }
    return response(200, {
      versao: 1,
      atualizado_em: new Date().toISOString(),
      tabelas: Object.fromEntries(TABLES.map(([name], index) => [name, results[index].results])),
    });
  } catch {
    // Não retornar SQL, credenciais, contatos ou relatos nos erros.
    return response(503, { erro: 'Não foi possível consultar os dados. Confira o binding e as migrações do D1.' });
  }
}
