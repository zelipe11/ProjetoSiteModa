CREATE TABLE IF NOT EXISTS acessos_abas (
  slug TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0 CHECK(total >= 0)
);
INSERT INTO acessos_abas (slug, nome) VALUES
  ('colecao', 'A coleção'), ('manifesto', 'Manifesto'),
  ('historia', 'Nossa história'), ('realidade', 'Dados e realidade'),
  ('editorial', 'Editorial'), ('vozes', 'Sua voz'),
  ('sobre-nos', 'Sobre Nós'), ('contato', 'Contato')
ON CONFLICT(slug) DO NOTHING;
