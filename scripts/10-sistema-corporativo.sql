-- Atualizar restrição para permitir o tipo 'corporativo' na tabela usuarios
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_tipo_usuario_check;

ALTER TABLE usuarios ADD CONSTRAINT usuarios_tipo_usuario_check
CHECK (tipo_usuario IN ('admin', 'cliente', 'corporativo'));

-- Criar tabela de empresas corporativas
CREATE TABLE IF NOT EXISTS empresas_corporativas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    endereco TEXT,
    telefone VARCHAR(20),
    limite_colaboradores INTEGER NOT NULL DEFAULT 10,
    colaboradores_cadastrados INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de colaboradores corporativos
CREATE TABLE IF NOT EXISTS colaboradores_corporativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_corporativas(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    departamento VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativo', 'inativo')),
    token_convite VARCHAR(255) UNIQUE,
    convite_expira_em TIMESTAMP WITH TIME ZONE,
    cadastrado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empresa_id, email)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_empresas_corporativas_usuario_id ON empresas_corporativas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_corporativos_empresa_id ON colaboradores_corporativos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_corporativos_usuario_id ON colaboradores_corporativos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_colaboradores_corporativos_token ON colaboradores_corporativos(token_convite);

-- Função para atualizar contador de colaboradores
CREATE OR REPLACE FUNCTION atualizar_contador_colaboradores()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE empresas_corporativas 
        SET colaboradores_cadastrados = colaboradores_cadastrados + 1,
            atualizado_em = NOW()
        WHERE id = NEW.empresa_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE empresas_corporativas 
        SET colaboradores_cadastrados = colaboradores_cadastrados - 1,
            atualizado_em = NOW()
        WHERE id = OLD.empresa_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador automaticamente
DROP TRIGGER IF EXISTS trigger_atualizar_contador_colaboradores ON colaboradores_corporativos;
CREATE TRIGGER trigger_atualizar_contador_colaboradores
    AFTER INSERT OR DELETE ON colaboradores_corporativos
    FOR EACH ROW EXECUTE FUNCTION atualizar_contador_colaboradores();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER update_empresas_corporativas_updated_at 
    BEFORE UPDATE ON empresas_corporativas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colaboradores_corporativos_updated_at 
    BEFORE UPDATE ON colaboradores_corporativos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Adicionar relacionamento entre pedidos e colaboradores corporativos
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS colaborador_id UUID REFERENCES colaboradores_corporativos(id);
CREATE INDEX IF NOT EXISTS idx_pedidos_colaborador_id ON pedidos(colaborador_id);

-- Adicionar relacionamento entre resultados_testes e colaboradores corporativos  
ALTER TABLE resultados_testes ADD COLUMN IF NOT EXISTS colaborador_id UUID REFERENCES colaboradores_corporativos(id);
CREATE INDEX IF NOT EXISTS idx_resultados_testes_colaborador_id ON resultados_testes(colaborador_id);
