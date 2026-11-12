// Cole este arquivo no Apps Script aberto a partir da planilha Data CLAMA.
// Em Configurações do projeto > Propriedades do script, cadastre API_URL e API_TOKEN.
const ABAS_CLAMA = [
  { tabela: 'mensagens', aba: 'CLAMA - Mensagens', campos: ['id', 'texto', 'criado_em'] },
  { tabela: 'contatos', aba: 'CLAMA - Contatos', campos: ['id', 'nome', 'celular', 'email', 'mensagem', 'criado_em'] },
  { tabela: 'acessos_pecas', aba: 'CLAMA - Acessos pecas', campos: ['slug', 'nome', 'total'] },
  { tabela: 'acessos_abas', aba: 'CLAMA - Acessos abas', campos: ['slug', 'nome', 'total'] },
];

function instalarSincronizacao() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  if (!planilha) throw new Error('Abra este projeto por Extensões > Apps Script na planilha de destino.');
  PropertiesService.getScriptProperties().setProperty('PLANILHA_ID', planilha.getId());
  sincronizarClama(); // Só agenda depois de uma importação bem-sucedida.
  const existentes = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'sincronizarClama');
  if (!existentes.length) ScriptApp.newTrigger('sincronizarClama').timeBased().everyMinutes(5).create();
  console.log('Sincronização instalada. Consulte as quatro abas CLAMA na planilha.');
}

function sincronizarClama() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) throw new Error('Outra sincronização está em andamento. Aguarde a próxima execução.');
  try {
    const config = PropertiesService.getScriptProperties().getProperties();
    if (!config.API_URL || !config.API_TOKEN || !config.PLANILHA_ID) {
      throw new Error('Cadastre API_URL e API_TOKEN nas propriedades do script e execute instalarSincronizacao.');
    }
    if (!/^https:\/\/[^/?#]+\/api\/planilhas$/.test(config.API_URL) || config.API_TOKEN.length < 32) {
      throw new Error('Use a URL HTTPS completa terminada em /api/planilhas e um token de pelo menos 32 caracteres.');
    }
    const resposta = UrlFetchApp.fetch(config.API_URL, {
      method: 'get', headers: { Authorization: 'Bearer ' + config.API_TOKEN },
      muteHttpExceptions: true, followRedirects: false,
    });
    const status = resposta.getResponseCode();
    if (status !== 200) throw new Error('API retornou HTTP ' + status + '. Confira o deploy, o token, o binding D1 e as migrações.');
    let dados;
    try { dados = JSON.parse(resposta.getContentText()); }
    catch (erro) { throw new Error('A URL não retornou JSON. Confira se a API foi publicada.'); }
    if (dados.versao !== 1 || !dados.tabelas) throw new Error('Formato inesperado da API. Nenhuma aba foi atualizada.');

    // Validar toda a resposta antes de escrever qualquer aba.
    const importacoes = ABAS_CLAMA.map(def => {
      const registros = dados.tabelas[def.tabela];
      if (!Array.isArray(registros)) throw new Error('Tabela ausente: ' + def.tabela);
      const linhas = registros.map(registro => def.campos.map(campo => {
        const valor = registro && registro[campo];
        if (typeof valor !== 'string' && typeof valor !== 'number') throw new Error('Campo inválido: ' + def.tabela + '.' + campo);
        // Textos enviados por visitantes nunca devem virar fórmulas da planilha.
        return typeof valor === 'string' && /^[=+\-@']/.test(valor) ? "'" + valor : valor;
      }));
      return { def: def, valores: [def.campos].concat(linhas) };
    });
    const planilha = SpreadsheetApp.openById(config.PLANILHA_ID);
    importacoes.forEach(({ def, valores }) => {
      const aba = planilha.getSheetByName(def.aba) || planilha.insertSheet(def.aba);
      const anteriores = aba.getLastRow();
      if (aba.getMaxRows() < valores.length) aba.insertRowsAfter(aba.getMaxRows(), valores.length - aba.getMaxRows());
      if (aba.getMaxColumns() < def.campos.length) aba.insertColumnsAfter(aba.getMaxColumns(), def.campos.length - aba.getMaxColumns());
      aba.getRange(1, 1, valores.length, def.campos.length).setValues(valores);
      // Remover sobras somente depois de gravar os dados recebidos.
      if (anteriores > valores.length) aba.getRange(valores.length + 1, 1, anteriores - valores.length, def.campos.length).clearContent();
      aba.setFrozenRows(1);
    });
    PropertiesService.getScriptProperties().setProperty('ULTIMA_SINCRONIZACAO', dados.atualizado_em);
    console.log('Dados CLAMA atualizados com sucesso.');
  } finally {
    lock.releaseLock();
  }
}
