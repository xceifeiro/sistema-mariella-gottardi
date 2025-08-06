-- Adicionar colunas para análise facial na tabela pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS url_perfil_normal TEXT,
ADD COLUMN IF NOT EXISTS url_perfil_sorrindo TEXT,
ADD COLUMN IF NOT EXISTS url_perfil_lado TEXT,
ADD COLUMN IF NOT EXISTS url_boca_sorrindo TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_public_ids TEXT,
ADD COLUMN IF NOT EXISTS data_envio_imagens TIMESTAMP,
ADD COLUMN IF NOT EXISTS webhook_enviado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS webhook_response TEXT;

-- Atualizar o serviço de Análise Facial se não existir
INSERT INTO servicos (nome, descricao, preco, ativo) 
VALUES ('Análise Facial', 'Análise completa da personalidade através de características faciais', 150.00, true)
ON CONFLICT (nome) DO NOTHING;
