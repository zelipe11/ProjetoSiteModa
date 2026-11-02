# CLAMA — Moda · Memória · Resistência

Site local da coleção CLAMA com Angular 21 e ASP.NET Core 8.

## Executar no Visual Studio

1. Abra ProjetoSiteModa.sln no Visual Studio 2022 (17.8 ou superior), com ASP.NET e desenvolvimento Web instalado.
2. Se o projeto já estiver rodando, clique em Parar depuração (Shift+F5).
3. Defina ProjetoSiteModa.Server como projeto de inicialização, selecione o perfil http e pressione F5.
4. Abra http://localhost:5115.

O build compila Angular para a pasta gerada ProjetoSiteModa.Server/wwwroot. Não edite wwwroot. Na primeira execução, as dependências npm são restauradas se necessário.

## Conteúdo

- Página inicial com apresentação da CLAMA e acesso à coleção.
- Telas independentes: /colecao, /manifesto, /historia, /realidade, /editorial, /vozes e /contato.
- Páginas próprias para Silêncio, Ferida, Ruptura, Resistência, Florescer e Voz.
- API GET /api/looks, GET /api/looks/{slug} e GET /api/health.
- Os conceitos dos looks são propostas editoriais. Materiais, técnicas e construção aguardam a ficha técnica real.
- Imagens e vídeos foram deixados vazios a pedido. O contato também aguarda definição.
- O espaço de escrita é privado e temporário: não envia, não salva e não publica relatos. As frases exibidas são mensagens da marca, não depoimentos reais.

## Adicionar imagens depois

Coloque os arquivos em ProjetoSiteModa.Client/public/images. A URL pública será /images/nome-do-arquivo.jpg.

- Hero: ProjetoSiteModa.Client/src/app/app.html. As demais páginas usam collection.html, manifesto.html, historia.html, realidade.html, editorial.html, vozes.html e contato.html em src/app.
- Fotos da página de cada look: ProjetoSiteModa.Client/src/app/look-page.ts. Use o slug para compor os nomes, por exemplo /images/silencio-frente.jpg e /images/silencio-costas.jpg.
- Dados e conceitos dos looks: ProjetoSiteModa.Client/public/data/looks.json (compartilhado com a API .NET).
- Estilos globais e responsivos: ProjetoSiteModa.Client/src/app/app.scss.

Substitua os espaços .image-space por imagens com descrição alternativa adequada. O hero pode receber background-image ou vídeo sem áudio e com opção de pausar. Recompile após alterações.

A fonte Cormorant Garamond é carregada do Google Fonts, com Georgia como alternativa quando offline.

## Desenvolvimento com recarga

Terminal 1 na raiz: dotnet run --project ProjetoSiteModa.Server --launch-profile http

Terminal 2 em ProjetoSiteModa.Client: npm start

Acesse http://localhost:4200. /api é encaminhado para localhost:5115.

## Compilar e publicar

```powershell
dotnet build ProjetoSiteModa.sln
dotnet publish ProjetoSiteModa.Server -c Release -o artifacts/publish
```

## Fontes

Dado de 1.568 vítimas de feminicídio em 2025: Fórum Brasileiro de Segurança Pública, Retrato dos feminicídios no Brasil, março de 2026.
https://forumseguranca.org.br/wp-content/uploads/2026/03/infografico-dia-mulher-2026.pdf

Ligue 180 (orientação e denúncias, gratuito, 24h) e 190 (emergência): Ministério das Mulheres.
https://www.gov.br/mulheres/pt-br/ligue180

Consulta em 02/11/2026. Dados podem sofrer revisão; mantenha as referências atualizadas.


## GitHub Pages

O workflow .github/workflows/github-pages.yml publica o Angular a cada push para master. O .NET continua disponível localmente; não é executado pelo GitHub Pages.

1. Envie as alterações ao repositório zelipe11/ProjetoSiteModa.
2. No GitHub, abra Settings → Pages → Build and deployment → Source e selecione GitHub Actions.
3. Na aba Actions, execute Publicar CLAMA no GitHub Pages ou envie um novo commit à branch principal.
4. O endereço definitivo aparece no resultado do deploy. Para esse repositório, o endereço esperado é https://zelipe11.github.io/ProjetoSiteModa/.

A configuração `pages` usa rotas com #, por exemplo /ProjetoSiteModa/#/colecao/silencio, para permitir recarregar e abrir links diretos sem erro 404. O workflow obtém o caminho base do GitHub, incluindo suporte ao domínio personalizado configurado em Pages.

Os dados da coleção, tanto no Pages quanto na API .NET, vêm de ProjetoSiteModa.Client/public/data/looks.json. Edite esse arquivo para alterar os looks. Os dados de produção são públicos.

Para gerar localmente:

```powershell
cd ProjetoSiteModa.Client
npm ci
npm run build:pages -- --base-href /ProjetoSiteModa/
```

Saída: ProjetoSiteModa.Client/dist/github-pages. Use caminhos relativos para futuras imagens (images/arquivo.jpg), sem barra inicial, para respeitar o subdiretório do Pages.

## Cloudflare Pages

Para publicar com o endereço gratuito desejado clamamoda.pages.dev, siga [o guia de configuração](docs/CLOUDFLARE-PAGES.md). O nome depende de disponibilidade. A integração Git deve ser conectada no painel Cloudflare uma vez; depois publica a cada push na master.

Build: `npm run build:cloudflare` em ProjetoSiteModa.Client. Saída: dist/cloudflare.

## Identidade visual

As quatro pranchas fornecidas estão em ProjetoSiteModa.Client/public/images/identity. Os arquivos originais foram preservados. O componente brand-mark.ts usa o logotipo vetorizado clama.svg no cabeçalho, na abertura e no rodapé; historia.html apresenta os esboços, embalagens, etiquetas e estudos de ambientação.

Os enquadramentos e a neutralização do vermelho são feitos por CSS em app.scss. Os estudos de espaço são apresentados como conceitos, sem indicar uma loja física existente. Para substituir as pranchas por arquivos finais individuais, atualize os enquadramentos .identity-frame. O logotipo SVG tem fundo transparente e pode ser ampliado sem pixelização. A referência atual de maior resolução está em images/identity/logotipo-referencia.jpg.

As imagens individuais sacola.jpg, caixa.jpg, tags.jpg e etiqueta.jpg substituem os recortes das pranchas na seção de materiais da marca. São exibidas na proporção original; .identity-photo mantém a harmonização de cor em CSS.
