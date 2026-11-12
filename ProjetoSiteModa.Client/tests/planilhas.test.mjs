import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/planilhas.js';

const token = 'a'.repeat(64);
function context({ authorization = 'Bearer ' + token, method = 'GET', fail = false, count = 1 } = {}) {
  const queries = [];
  let batches = 0;
  return {
    queries, get batches() { return batches; },
    request: new Request('https://clama.example/api/planilhas', { method, headers: { authorization } }),
    env: { PLANILHAS_TOKEN: token, VOZES_DB: {
      prepare(sql) { queries.push(sql); return sql; },
      async batch(statements) {
        batches++;
        if (fail) throw new Error('private SQL and contact details');
        return statements.map(() => ({ success: true, results: Array.from({ length: count }, () => ({ id: 'example' })) }));
      },
    } },
  };
}

test('exportação exige autenticação e não consulta banco para token incorreto', async () => {
  for (const authorization of ['', 'Bearer wrong', token, 'Bearer ' + token + 'x']) {
    const ctx = context({ authorization });
    const result = await onRequest(ctx);
    assert.equal(result.status, 401);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    assert.equal(ctx.queries.length, 0);
  }
});

test('falha fechada sem configuração e recusa métodos de escrita', async () => {
  for (const env of [{}, { PLANILHAS_TOKEN: 'short', VOZES_DB: {} }, { PLANILHAS_TOKEN: token }]) {
    assert.equal((await onRequest({ ...context(), env })).status, 503);
  }
  const ctx = context({ method: 'POST' });
  assert.equal((await onRequest(ctx)).status, 405);
  assert.equal(ctx.queries.length, 0);
});

test('exporta as quatro tabelas em um batch e sem cache', async () => {
  const ctx = context();
  const result = await onRequest(ctx);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  const body = await result.json();
  assert.equal(body.versao, 1);
  assert.deepEqual(Object.keys(body.tabelas), ['mensagens', 'contatos', 'acessos_pecas', 'acessos_abas']);
  assert.equal(ctx.batches, 1);
  assert.equal(ctx.queries.length, 4);
});

test('erro do D1 não revela detalhes e limite não gera exportação truncada', async () => {
  const result = await onRequest(context({ fail: true }));
  assert.equal(result.status, 503);
  assert.doesNotMatch(await result.text(), /private SQL/);
  assert.equal((await onRequest(context({ count: 10001 }))).status, 413);
});
