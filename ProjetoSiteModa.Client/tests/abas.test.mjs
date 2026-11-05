import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/abas/[slug].js';

function context({ slug = 'colecao', method = 'POST', origin = 'https://clama.example', fail = false, changes = 1 } = {}) {
  const calls = [];
  return { calls, params: { slug },
    request: new Request('https://clama.example/api/abas/' + slug, { method, headers: { origin } }),
    env: { VOZES_DB: { prepare(sql) { return { bind(...values) { calls.push({ sql, values }); return { async run() {
      if (fail) throw new Error('private detail');
      return { success: true, meta: { changes } };
    } }; } }; } } },
  };
}

test('incrementa somente a aba escolhida com operação atômica e parametrizada', async () => {
  for (const slug of ['colecao','manifesto','historia','realidade','editorial','vozes','sobre-nos','contato']) {
    const ctx = context({ slug });
    const result = await onRequest(ctx);
    assert.equal(result.status, 204);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    assert.deepEqual(ctx.calls[0].values, [slug]);
    assert.match(ctx.calls[0].sql, /UPDATE acessos_abas/);
    assert.match(ctx.calls[0].sql, /total = total \+ 1 WHERE slug = \?/);
  }
});

test('recusa leitura pública, origem externa e abas inválidas e Home sem acessar banco', async () => {
  for (const [options, status] of [[{method:'GET'},405],[{origin:'https://other.example'},403],[{slug:'invalida'},404],[{slug:''},404],[{slug:'home'},404],[{slug:'colecao/dor'},404]]) {
    const ctx = context(options);
    assert.equal((await onRequest(ctx)).status, status);
    assert.equal(ctx.calls.length, 0);
  }
});

test('não confirma registro quando banco ou tabela estão indisponíveis', async () => {
  for (const ctx of [context({ fail:true }), context({ changes:0 }), {...context(), env:{}}]) {
    const result = await onRequest(ctx);
    assert.equal(result.status, 503);
    assert.equal(await result.text(), '');
  }
});
