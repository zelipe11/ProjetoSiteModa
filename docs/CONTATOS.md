# Formulário de contato

O formulário em `/contato` recebe nome, celular brasileiro com DDD, e-mail e mensagem. Exibe confirmação somente após o D1 aceitar os dados. Em erro, mantém os campos para nova tentativa; um identificador aleatório evita duplicar o envio em tentativas repetidas. Não envia e-mails, WhatsApp nem notificações automaticamente.

## Ativar em produção

No Console do banco D1 conectado ao binding `VOZES_DB`, execute `ProjetoSiteModa.Client/migrations/0004_contatos.sql` (se a tabela ainda não existir) e depois `ProjetoSiteModa.Client/migrations/0005_contatos_nome_mensagem.sql` uma única vez. Depois de publicar esta versão na Cloudflare, envie um contato de teste e confirme o registro no Console. A ferramenta local não está autenticada para aplicar a tabela no banco remoto.

## Consultar contatos

No Console privado do D1:

```sql
SELECT nome, celular, email, mensagem, criado_em FROM contatos ORDER BY criado_em DESC;
```

Os dados não são publicados e o endpoint `/api/contato` aceita apenas POST. O aviso do formulário explica a finalidade de retorno. Restrinja o acesso ao banco à equipe responsável e remova os contatos quando não forem mais necessários. A aplicação não registra celular ou e-mail nos logs e recebe o nome informado no formulário. O identificador é exclusivo do envio, não do visitante.

Para desenvolvimento: `npm run db:local`, `npm run build:cloudflare` e `npm run dev:cloudflare` na pasta do cliente. O servidor .NET e o GitHub Pages não executam essa Function.
