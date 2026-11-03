CREATE TABLE IF NOT EXISTS mensagens (
  id TEXT PRIMARY KEY NOT NULL,
  texto TEXT NOT NULL CHECK(length(trim(texto)) BETWEEN 3 AND 1000),
  criado_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mensagens_criado_em ON mensagens(criado_em);
