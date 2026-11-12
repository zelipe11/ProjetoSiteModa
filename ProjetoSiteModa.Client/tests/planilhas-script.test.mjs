import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../integracoes/google-planilhas/Code.gs', import.meta.url), 'utf8');
function setup({ status = 200, missing = false } = {}) {
  const writes = [], clears = [], triggers = [];
  const properties = { API_URL: 'https://clama.example/api/planilhas', API_TOKEN: 'x'.repeat(64) };
  const campos = {
    mensagens: [{ id: '1', texto: '=IMPORTXML("https://example.com", "//p")', criado_em: '2026-11-12' }],
    contatos: [], acessos_pecas: [{ slug: 'dor', nome: 'Dor', total: 42 }], acessos_abas: [],
  };
  if (missing) delete campos.contatos;
  const sheet = {
    getLastRow: () => 4, getMaxRows: () => 100, getMaxColumns: () => 26,
    getRange: (...range) => ({ setValues: values => writes.push({ range, values }), clearContent: () => clears.push(range) }),
    setFrozenRows() {},
  };
  const workbook = { getId: () => 'sheet-id', getSheetByName: () => sheet };
  let released = false;
  const sandbox = vm.createContext({
    console: { log() {} },
    PropertiesService: { getScriptProperties: () => ({
      getProperties: () => properties, setProperty: (key, value) => { properties[key] = value; },
    }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => workbook, openById: () => workbook },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => { released = true; } }) },
    UrlFetchApp: { fetch: (url, options) => {
      assert.equal(options.headers.Authorization, 'Bearer ' + properties.API_TOKEN);
      assert.equal(options.followRedirects, false);
      return { getResponseCode: () => status, getContentText: () => JSON.stringify({ versao: 1, atualizado_em: 'now', tabelas: campos }) };
    } },
    ScriptApp: {
      getProjectTriggers: () => triggers,
      newTrigger: name => ({ timeBased: () => ({ everyMinutes: minutes => ({ create() {
        assert.equal(minutes, 5);
        triggers.push({ getHandlerFunction: () => name });
      } }) }) }),
    },
  });
  vm.runInContext(source, sandbox);
  return { sandbox, writes, clears, triggers, properties, released: () => released };
}

test('instala acionador de 5 minutos uma vez e importa textos sem executar fórmulas', () => {
  const ctx = setup();
  ctx.sandbox.instalarSincronizacao();
  ctx.sandbox.instalarSincronizacao();
  assert.equal(ctx.triggers.length, 1);
  assert.equal(ctx.writes.length, 8);
  assert.match(ctx.writes[0].values[1][1], /^'=IMPORTXML/);
  assert.equal(ctx.writes[2].values[1][2], 42);
  assert.equal(ctx.properties.ULTIMA_SINCRONIZACAO, 'now');
  assert.equal(ctx.released(), true);
});

test('erro HTTP e resposta incompleta preservam abas e não instalam acionador', () => {
  for (const options of [{ status: 401 }, { status: 503 }, { missing: true }]) {
    const ctx = setup(options);
    assert.throws(() => ctx.sandbox.instalarSincronizacao());
    assert.equal(ctx.writes.length, 0);
    assert.equal(ctx.clears.length, 0);
    assert.equal(ctx.triggers.length, 0);
    assert.equal(ctx.properties.ULTIMA_SINCRONIZACAO, undefined);
    assert.equal(ctx.released(), true);
  }
});
