-- 1. Altera a tabela de usuários para permitir que a senha seja nula.
-- Isso é necessário para que o admin possa criar um cliente sem definir uma senha inicial.
ALTER TABLE usuarios
ALTER COLUMN senha_hash DROP NOT NULL;

-- 2. Cria uma tabela para armazenar tokens de primeiro acesso.
-- Estes tokens são de uso único e têm um tempo de expiração.
CREATE TABLE IF NOT EXISTS primeiro_acesso_tokens (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL UNIQUE,
    token TEXT NOT NULL UNIQUE,
    expira_em TIMESTAMP WITH TIME ZONE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Adiciona um índice na coluna de token para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_primeiro_acesso_tokens_token ON primeiro_acesso_tokens(token);
