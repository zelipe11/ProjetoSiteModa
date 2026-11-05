# Acessos às abas

Conta visitas às oito abas do menu: A coleção, Manifesto, Nossa história, Dados e realidade, Editorial, Sua voz, Sobre Nós e Contato. A Home nunca é contada. Os detalhes das peças mantêm sua contagem separada em `acessos_pecas`.

Entradas diretas, recarregamentos e retornos a uma aba contam. Trocar somente um fragmento de âncora ou parâmetros na mesma página não conta novamente. Navegações canceladas ou com erro não contam. Não conta visitantes únicos ou abas do navegador e não grava IP, cookies ou identificadores de visitantes. Repetições e acessos automatizados podem influenciar os totais.

## Ativar

No Console do D1 conectado ao binding `VOZES_DB`, execute o conteúdo de `ProjetoSiteModa.Client/migrations/0003_acessos_abas.sql`. Pode executar novamente sem zerar os totais. O registro começa após criar a tabela e publicar a versão na Cloudflare; não recupera visitas antigas. GitHub Pages e o servidor .NET não executam essa Function.

## Consultar

Use o Console privado do D1 para consultar o ranking:

```sql
SELECT nome AS aba, total AS acessos
FROM acessos_abas
ORDER BY total DESC, nome ASC;
```

Total de visitas às abas, excluindo a Home:

```sql
SELECT SUM(total) AS total_acessos FROM acessos_abas;
```

Para verificar, consulte os totais, abra uma aba no site Cloudflare e consulte novamente. A aba deve ganhar um acesso; voltar à Home não deve alterar os totais. O ranking não é exposto por uma API pública. Falhas no registro não interrompem a navegação.
