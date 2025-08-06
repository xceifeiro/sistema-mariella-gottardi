-- Adicionar colunas necessárias na tabela existente resultados_testes
ALTER TABLE resultados_testes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'processando';
ALTER TABLE resultados_testes ADD COLUMN IF NOT EXISTS data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Adicionar índices para performance se não existirem
CREATE INDEX IF NOT EXISTS idx_resultados_testes_pedido_id ON resultados_testes(pedido_id);
CREATE INDEX IF NOT EXISTS idx_resultados_testes_tipo_teste ON resultados_testes(tipo_teste);
CREATE INDEX IF NOT EXISTS idx_resultados_testes_status ON resultados_testes(status);

-- Adicionar colunas de observações nos pedidos se não existir
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS observacoes TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_conclusao TIMESTAMP;

-- Função para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente a data_atualizacao
DROP TRIGGER IF EXISTS trigger_update_data_atualizacao ON resultados_testes;
CREATE TRIGGER trigger_update_data_atualizacao
    BEFORE UPDATE ON resultados_testes
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();
