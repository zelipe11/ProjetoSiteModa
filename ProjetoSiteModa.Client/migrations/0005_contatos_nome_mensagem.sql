ALTER TABLE contatos ADD COLUMN nome TEXT NOT NULL DEFAULT '' CHECK(length(nome) <= 120);
ALTER TABLE contatos ADD COLUMN mensagem TEXT NOT NULL DEFAULT '' CHECK(length(mensagem) <= 2000);
