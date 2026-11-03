# Publicar CLAMA no Cloudflare Pages

Configuração preparada para o endereço desejado https://clamamoda.pages.dev, sujeito à disponibilidade do nome no momento da criação. Este arquivo não significa que o projeto já foi criado ou publicado.

## Conectar uma vez

1. Entre na sua conta Cloudflare e abra Workers & Pages.
2. Escolha criar uma aplicação **Pages** e conectar/importar um repositório Git existente. Use a integração com GitHub, e não Direct Upload, para manter deploy automático.
3. Autorize acesso ao repositório zelipe11/ProjetoSiteModa e selecione-o.
4. Preencha:

| Campo | Valor |
| --- | --- |
| Nome do projeto | clamamoda |
| Branch de produção | master |
| Framework preset | None |
| Root directory | ProjetoSiteModa.Client |
| Build command | npm run build:cloudflare |
| Build output directory | dist/cloudflare |
| NODE_VERSION (se solicitado) | 24.13.0 |

5. Salve e inicie o deploy. Se clamamoda já estiver ocupado, escolha outro nome no painel.
6. Abra o endereço retornado pelo Cloudflare quando o deploy concluir. Não é necessário registrar um domínio .com.br para usar pages.dev.

A integração Git fará novos builds e publicações a cada push na master. Confirme nas configurações de Build / Branch control que os deploys automáticos de produção estão habilitados.

O Cloudflare instala as dependências do package-lock.json. A versão do Node está definida em .node-version. A configuração de produção, incluindo o binding do banco, é feita pelo painel. wrangler.example.toml é apenas uma referência, sem aplicação automática.

## Funcionamento

O site publicado é estático e usa os dados públicos de public/data/looks.json, sem depender da API .NET. O formulário Sua voz utiliza uma Pages Function e um banco D1 privado; siga VOZES-PRIVADAS.md para ativar. O Visual Studio continua usando a API local. As URLs públicas usam /#/colecao, /#/manifesto e as outras rotas existentes, permitindo recarregar links diretos.

Para futuras imagens, prefira URLs relativas como images/arquivo.jpg, sem barra inicial.

## Build local

Na pasta ProjetoSiteModa.Client:

```powershell
npm ci
npm run build:cloudflare
```

A pasta dist/cloudflare contém index.html, JavaScript, CSS e data/looks.json. É ela que será publicada, sem arquivos do backend.

O workflow do GitHub Pages continua disponível durante a transição. Depois de confirmar o site no Cloudflare, ele pode ser desativado na aba Actions do GitHub.

## Referências

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/functions/wrangler-configuration/
