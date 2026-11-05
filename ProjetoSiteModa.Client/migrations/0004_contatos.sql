CREATE TABLE IF NOT EXISTS contatos (
 id TEXT PRIMARY KEY NOT NULL,
 celular TEXT NOT NULL CHECK(length(celular) BETWEEN 11 AND 13),
 email TEXT NOT NULL CHECK(length(email) BETWEEN 3 AND 254),
 criado_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contatos_criado_em ON contatos(criado_em);
