var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
var looks = System.Text.Json.JsonSerializer.Deserialize<Look[]>(
    File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Data", "looks.json")),
    new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web))
    ?? throw new InvalidOperationException("Catálogo da coleção não encontrado.");
app.MapGet("/api/looks", () => looks);
app.MapGet("/api/looks/{slug}", (string slug) => looks.FirstOrDefault(l => l.Slug == slug) is { } look ? Results.Ok(look) : Results.NotFound());
app.MapPost("/api/vozes", () => Results.Json(new { mensagem = "O envio privado está disponível na hospedagem Cloudflare. Para testar localmente, utilize o comando dev:cloudflare descrito no projeto." }, statusCode: 503));
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapFallback("/api/{**path}", () => Results.NotFound());
app.MapFallbackToFile("index.html");
app.Run();
record Look(int Id, string Slug, string Nome, string Frase, string Conceito, string Simbolismo, string Cor, ImagemLook[]? Imagens = null, Peca[]? Pecas = null);
record ImagemLook(string Src, string Alt, string Legenda, string? Enquadramento = null, int? Largura = null, int? Altura = null);

record Peca(string Nome, decimal Preco);
