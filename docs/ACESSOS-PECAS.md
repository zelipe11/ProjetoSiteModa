# Ranking de acessos às peças

Cada abertura bem-sucedida dos detalhes de uma peça registra um acesso. Entradas diretas, recarregamentos e navegação por “Próximo momento” também contam. Não é uma contagem de visitantes únicos nem de cliques nas setas das fotos. Falhas de carregamento não contam. O registro é discreto e não impede a leitura se o banco estiver indisponível.

O banco armazena somente o identificador, o nome e o total de cada peça, sem IP, cookies ou dados pessoais. O endpoint permite apenas incrementar as seis peças conhecidas; o ranking é consultado pelo painel privado do banco. Como toda métrica de acesso sem identificação, pode incluir repetições e acessos automatizados.

## Ativação na Cloudflare

No painel Cloudflare, abra D1 → banco conectado ao binding `VOZES_DB` → Console. Execute o conteúdo de `ProjetoSiteModa.Client/migrations/0002_acessos_pecas.sql`. Pode executar novamente sem apagar os totais. Se o binding ainda não existir, siga `docs/VOZES-PRIVADAS.md` para conectar o banco ao site.

A contagem começa depois que a tabela estiver criada e esta versão estiver publicada. Não recupera acessos anteriores. GitHub Pages e o servidor .NET local não executam essa Function.

## Consultar ranking

No Console do D1:

```sql
SELECT nome AS peca, total AS acessos
FROM acessos_pecas
ORDER BY total DESC, nome ASC;
```

Para conferir o funcionamento, consulte o ranking, abra os detalhes de uma peça no site Cloudflare e consulte novamente: o total dessa peça deve aumentar em um. Navegar pelas fotos sem sair da peça não altera o total.
