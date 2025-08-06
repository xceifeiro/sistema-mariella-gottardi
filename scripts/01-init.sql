-- Tabela de Usuários: Armazena informações de login e tipo de usuário.
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('admin', 'cliente')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Tabela de Clientes: Estende a tabela de usuários com informações específicas do cliente.
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY,
    telefone TEXT,
    data_nascimento DATE,
    genero TEXT CHECK (genero IN ('masculino', 'feminino', 'outro')),
    documento TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Serviços: Catálogo de serviços/testes oferecidos.
CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    slug TEXT NOT NULL UNIQUE,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Tabela de Pedidos: Registra os serviços que um cliente contratou.
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL,
    servico_id INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

-- Tabela de Resultados dos Testes: Armazena os resultados em JSONB.
CREATE TABLE IF NOT EXISTS resultados_testes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL UNIQUE,
    tipo_teste TEXT NOT NULL,
    resultado JSONB,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- Tabela de Logs: Registra ações importantes para auditoria.
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    usuario_id UUID,
    acao TEXT NOT NULL,
    descricao TEXT,
    ip TEXT,
    user_agent TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Função para atualizar o campo 'atualizado_em' automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para as tabelas
CREATE TRIGGER set_timestamp_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_pedidos
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_servicos
BEFORE UPDATE ON servicos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
