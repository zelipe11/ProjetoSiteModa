# Sincronizar o D1 com a planilha Data CLAMA

Usa a conta Google do responsável pela planilha e um acionador do Apps Script a cada 5 minutos. Não precisa de conta de serviço, implantação do Apps Script como web app, Worker separado ou Cron Trigger no Cloudflare.

## 1. Publicar a API no site

Publique as alterações deste projeto no Cloudflare Pages pelo fluxo Git existente. O novo endpoint é `https://SEU-SITE.pages.dev/api/planilhas`.

No projeto Pages do site, abra Settings > Variables and Secrets e adicione um **Secret** chamado `PLANILHAS_TOKEN`. Use um valor aleatório com pelo menos 32 caracteres. Para gerar uma chave no PowerShell:

```powershell
$clamaTokenBytes = New-Object byte[] 32
$clamaRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$clamaRng.GetBytes($clamaTokenBytes)
$clamaRng.Dispose()
[Convert]::ToBase64String($clamaTokenBytes)
```

Guarde o resultado diretamente no secret do Cloudflare e nas propriedades do Apps Script; não adicione ao Git, frontend, URL ou células da planilha.

Confirme que o binding `VOZES_DB` aponta para o banco do site e que as migrações 0001 a 0005 já foram aplicadas. Execute um novo deploy para ativar o secret. Uma consulta sem chave a `/api/planilhas` deve retornar HTTP 401; HTTP 503 indica configuração incompleta. Não copie o ID fictício do banco local para produção.

## 2. Colar o script

Na planilha, abra Extensões > Apps Script. Renomeie o projeto para `Sincronizacao CLAMA`. Apague o conteúdo inicial de Code.gs e cole todo o conteúdo de `integracoes/google-planilhas/Code.gs` deste repositório. Salve.

Na engrenagem **Configurações do projeto / Project Settings**, procure **Propriedades do script / Script properties** e cadastre:

| Propriedade | Valor |
| --- | --- |
| API_URL | URL completa do site publicado, terminando em `/api/planilhas` |
| API_TOKEN | Exatamente o mesmo valor do secret `PLANILHAS_TOKEN` do Cloudflare |

## 3. Executar uma vez e autorizar

Volte ao Editor, selecione `instalarSincronizacao` na lista de funções e clique Executar / Run. Autorize o acesso com sua conta Google quando solicitado. Essa função captura a planilha vinculada, importa os dados e só então cria o acionador de 5 minutos. Reexecutá-la não cria outro acionador para o mesmo usuário quando ele já existe.

As abas gerenciadas são `CLAMA - Mensagens`, `CLAMA - Contatos`, `CLAMA - Acessos pecas` e `CLAMA - Acessos abas`. Elas espelham o banco, sem acrescentar cópias repetidas a cada execução. O conteúdo dessas abas é substituído pela sincronização; use outras abas para anotações e análises. O arquivo Code.gs deve estar num projeto vinculado à planilha, não num projeto independente.

O acionador continua funcionando com a planilha fechada, sob a conta que o instalou, sujeito à disponibilidade e às cotas do Apps Script. Os horários não são uma garantia de execução no segundo exato. Consulte **Acionadores / Triggers** para confirmar o intervalo e **Execuções / Executions** para investigar falhas. Cada responsável deve evitar instalar outro acionador com uma segunda conta.

## Dados privados e limites

Compartilhe a planilha e o projeto Apps Script somente com pessoas autorizadas a ler os relatos e contatos. Editores do script podem acessar as propriedades, inclusive o token. A exportação exige autenticação e não altera os endpoints públicos existentes. Dados recebidos de visitantes são tratados como texto para impedir sua execução como fórmulas.

O endpoint retorna até 10.000 registros por tabela e falha explicitamente acima disso; será necessário adicionar paginação se esse limite for atingido. Falhas de HTTP ou formato não apagam os dados anteriores. As quatro abas são escritas em sequência; uma falha de escrita no Google pode deixar parte delas atualizada até a próxima sincronização bem-sucedida. O último snapshot importado integralmente fica na propriedade `ULTIMA_SINCRONIZACAO`.

## Referências

- https://developers.google.com/apps-script/reference/script/clock-trigger-builder
- https://developers.google.com/apps-script/guides/properties
- https://developers.cloudflare.com/pages/functions/bindings/
