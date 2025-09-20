-- Adicionar campos para dossiê na tabela de resultados
ALTER TABLE resultados_testes 
ADD COLUMN IF NOT EXISTS dossie_gerado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dossie_conteudo TEXT,
ADD COLUMN IF NOT EXISTS dossie_status VARCHAR(20) DEFAULT 'pendente' CHECK (dossie_status IN ('pendente', 'aprovado', 'rejeitado')),
ADD COLUMN IF NOT EXISTS dossie_data_geracao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dossie_data_aprovacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS dossie_aprovado_por UUID REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS dossie_observacoes TEXT;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_resultados_dossie_status ON resultados_testes (dossie_status);
CREATE INDEX IF NOT EXISTS idx_resultados_dossie_gerado ON resultados_testes (dossie_gerado);

-- Atualizar logs para incluir ações de dossiê
INSERT INTO logs (usuario_id, acao, descricao, ip_address) 
SELECT 
    '00000000-0000-0000-0000-000000000000'::uuid,
    'sistema_dossie_criado',
    'Sistema de dossiê implementado',
    '127.0.0.1'
WHERE NOT EXISTS (
    SELECT 1 FROM logs WHERE acao = 'sistema_dossie_criado'
);
