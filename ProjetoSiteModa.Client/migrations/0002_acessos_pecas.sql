CREATE TABLE IF NOT EXISTS acessos_pecas (
  slug TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0 CHECK(total >= 0)
);

INSERT INTO acessos_pecas (slug, nome) VALUES
  ('dor', 'Dor'), ('danos', 'Danos'), ('culpa', 'Culpa'),
  ('resistencia', 'Resistência'), ('heranca', 'Herança'), ('libertacao', 'Libertação')
ON CONFLICT(slug) DO NOTHING;
