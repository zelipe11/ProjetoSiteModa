# Ativar o armazenamento privado de Sua voz

A implementação está pronta e foi testada com um banco D1 local. É necessário criar e conectar o banco da conta Cloudflare para receber mensagens reais. A ferramenta local não está autenticada nessa conta.

## 1. Aguarde o deploy desta atualização

O arquivo wrangler.toml anterior foi renomeado para wrangler.example.toml, permitindo configurar os bindings pelo painel. A Cloudflare preserva a configuração do último deploy quando o arquivo deixa de ser utilizado. Espere este deploy terminar antes de editar os bindings.

O site continua usando o mesmo comando npm run build:cloudflare e a mesma pasta dist/cloudflare. As Functions são compiladas pela integração Git a partir da pasta ProjetoSiteModa.Client/functions.

## 2. Criar o banco

No painel Cloudflare, abra Storage & databases → D1 SQL Database → Create database. Nome sugerido: clama-vozes. Não é necessário tornar o banco público.

Abra o banco, entre em Console e execute o conteúdo de ProjetoSiteModa.Client/migrations/0001_mensagens.sql:

```sql
CREATE TABLE IF NOT EXISTS mensagens (
  id TEXT PRIMARY KEY NOT NULL,
  texto TEXT NOT NULL CHECK(length(trim(texto)) BETWEEN 3 AND 1000),
  criado_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mensagens_criado_em ON mensagens(criado_em);
```

## 3. Conectar ao site

Workers & Pages → projeto CLAMA → Settings → Bindings → Add → D1 database.

- Ambiente: Production.
- Variable name / Binding: VOZES_DB (exatamente assim).
- Database: clama-vozes, o banco criado acima.

Salve. Em Deployments, execute Retry deployment / Redeploy na última versão para o binding entrar em vigor. Se os campos ainda estiverem bloqueados pelo Wrangler, confirme que o deploy do passo 1 terminou.

Não conecte o banco de produção aos deploys de preview; use outro banco se quiser testar previews.

## 4. Conferir e ler

No site publicado, abra Sua voz, escreva uma mensagem de teste e clique em Enviar mensagem. A confirmação aparece apenas depois de o banco aceitar o envio.

Para ler as mensagens, use sua conta Cloudflare: Storage & databases → D1 → clama-vozes → Console:

```sql
SELECT texto, criado_em FROM mensagens ORDER BY criado_em DESC;
```

O site não possui consulta, listagem nem área pública de relatos. O endereço /api/vozes aceita somente POST; GET e outros métodos retornam 405. Dê acesso ao painel somente às pessoas da equipe que devem ler as mensagens.

## O que é armazenado

Texto, data de envio em UTC e identificador aleatório do envio para evitar duplicatas em tentativas repetidas. O formulário não pede nome, e-mail ou telefone e não grava o rascunho no navegador. O código da aplicação não salva IP nem registra o texto nos logs. A Cloudflare pode manter logs operacionais próprios da plataforma.

O aviso de privacidade é exibido acima do botão. A mensagem é enviada somente ao clicar em Enviar mensagem. Em caso de erro, o rascunho permanece na tela. Antes de configurar o banco, o envio retorna indisponível, sem confirmar um armazenamento que não ocorreu.

## Desenvolvimento local

Na pasta ProjetoSiteModa.Client:

```powershell
npm ci
npm run test:api
npm run build:cloudflare
npm run check:functions
npm run db:local
npm run dev:cloudflare
```

Abra http://127.0.0.1:5121/#/vozes. O banco de teste fica em .wrangler/state, ignorado pelo Git. O ID no wrangler.local.toml é fictício e usado apenas pelo banco local. Não é necessário autenticar para esses testes.

No Visual Studio, o restante do site continua funcionando com .NET. O endpoint local .NET informa que o envio deve ser testado pelo ambiente Cloudflare acima; ele não finge ter armazenado a mensagem.

No GitHub Pages puro, o formulário não armazena mensagens, pois essa hospedagem não executa Pages Functions. Use o endereço Cloudflare.

## Referências

- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/pages/functions/wrangler-configuration/#source-of-truth
- https://developers.cloudflare.com/d1/get-started/
