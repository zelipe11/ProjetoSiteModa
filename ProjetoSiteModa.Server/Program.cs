var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
var looks = new[] {
    new Look(1, "silencio", "Silêncio", "Antes da palavra, o que permanece?", "O início de uma trajetória que torna visível aquilo que foi silenciado.", "O silêncio imposto e o direito de existir.", "#b7b1aa"),
    new Look(2, "ferida", "Ferida", "Há marcas que o tempo não apaga.", "A memória da dor como ponto de partida para a expressão, sem reduzir uma mulher às marcas que carrega.", "A memória e o reconhecimento da dor.", "#71303c"),
    new Look(3, "ruptura", "Ruptura", "Romper também é um começo.", "O instante em que a narrativa imposta é interrompida e abre espaço para a própria história.", "A quebra do ciclo e a possibilidade de mudança.", "#3b3838"),
    new Look(4, "resistencia", "Resistência", "Permanecer é um gesto de força.", "A presença do corpo como manifesto e a força que se constrói também em coletivo.", "A permanência, o amparo e a força coletiva.", "#552631"),
    new Look(5, "florescer", "Florescer", "Reconstruir no próprio tempo.", "A reconstrução como um percurso singular: existir para além da dor, com liberdade para recomeçar.", "O cuidado, a autonomia e o recomeço.", "#c5b9ad"),
    new Look(6, "voz", "Voz", "Nossa história, por nós mesmas.", "A expressão que ocupa espaço e faz da moda uma linguagem para ser vista e ouvida.", "O direito à expressão e ao protagonismo.", "#842c40")
};
app.MapGet("/api/looks", () => looks);
app.MapGet("/api/looks/{slug}", (string slug) => looks.FirstOrDefault(l => l.Slug == slug) is { } look ? Results.Ok(look) : Results.NotFound());
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapFallback("/api/{**path}", () => Results.NotFound());
app.MapFallbackToFile("index.html");
app.Run();
record Look(int Id, string Slug, string Nome, string Frase, string Conceito, string Simbolismo, string Cor);
