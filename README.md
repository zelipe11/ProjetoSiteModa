# CLAMA — Moda · Memória · Resistência

Site local da coleção CLAMA com Angular 21 e ASP.NET Core 8.

## Executar no Visual Studio

1. Abra ProjetoSiteModa.sln no Visual Studio 2022 (17.8 ou superior), com ASP.NET e desenvolvimento Web instalado.
2. Se o projeto já estiver rodando, clique em Parar depuração (Shift+F5).
3. Defina ProjetoSiteModa.Server como projeto de inicialização, selecione o perfil http e pressione F5.
4. Abra http://localhost:5115.

O build compila Angular para a pasta gerada ProjetoSiteModa.Server/wwwroot. Não edite wwwroot. Na primeira execução, as dependências npm são restauradas se necessário.

## Conteúdo

- Página inicial: coleção, manifesto, história, dados, editorial, vozes e contato.
- Páginas próprias para Silêncio, Ferida, Ruptura, Resistência, Florescer e Voz.
- API GET /api/looks, GET /api/looks/{slug} e GET /api/health.
- Os conceitos dos looks são propostas editoriais. Materiais, técnicas e construção aguardam a ficha técnica real.
- Imagens e vídeos foram deixados vazios a pedido. O contato também aguarda definição.
- O espaço de escrita é privado e temporário: não envia, não salva e não publica relatos. As frases exibidas são mensagens da marca, não depoimentos reais.

## Adicionar imagens depois

Coloque os arquivos em ProjetoSiteModa.Client/public/images. A URL pública será /images/nome-do-arquivo.jpg.

- Hero, história e editorial: ProjetoSiteModa.Client/src/app/app.html.
- Fotos da página de cada look: ProjetoSiteModa.Client/src/app/look-page.ts. Use o slug para compor os nomes, por exemplo /images/silencio-frente.jpg e /images/silencio-costas.jpg.
- Dados e conceitos dos looks: ProjetoSiteModa.Server/Program.cs.
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
