-- ATENÇÃO: Substitua os hashes abaixo pelos hashes REAIS gerados para 'password123'

-- Usuário Administrador
INSERT INTO usuarios (id, nome, email, senha_hash, tipo_usuario)
VALUES (
    gen_random_uuid(),
    'Admin Fulano',
    'admin@example.com',
    '$2a$10$YOUR_REAL_BCRYPT_HASH_FOR_ADMIN_HERE', -- << SUBSTITUA ESTE HASH!
    'admin'
)
ON CONFLICT (email) DO NOTHING; -- Esta linha para o admin geralmente funciona bem sozinha.

-- Usuário Cliente
DO $$
DECLARE
    cliente_user_id UUID;
    cliente_email TEXT := 'cliente@example.com';
    cliente_nome TEXT := 'Cliente Ciclano';
    cliente_senha_hash TEXT := '$2a$10$YOUR_REAL_BCRYPT_HASH_FOR_CLIENT_HERE'; -- << SUBSTITUA ESTE HASH!
BEGIN
    -- Tenta inserir o usuário cliente. Se o email já existir, não faz nada.
    INSERT INTO usuarios (id, nome, email, senha_hash, tipo_usuario)
    VALUES (gen_random_uuid(), cliente_nome, cliente_email, cliente_senha_hash, 'cliente')
    ON CONFLICT (email) DO NOTHING;

    -- Agora, busca o ID do usuário cliente (seja ele recém-inserido ou já existente)
    SELECT id INTO cliente_user_id FROM usuarios WHERE email = cliente_email;

    -- Se o usuário cliente existe (tem um ID), tenta inserir na tabela clientes
    IF cliente_user_id IS NOT NULL THEN
        -- Garante que o cliente não exista na tabela 'clientes' antes de inserir
        IF NOT EXISTS (SELECT 1 FROM clientes WHERE id = cliente_user_id) THEN
            INSERT INTO clientes (id, telefone, data_nascimento, genero, documento, status)
            VALUES (
                cliente_user_id,
                '11987654321',
                '1990-05-15',
                'masculino',
                '123.456.789-00',
                'ativo'
            );
        END IF;
    END IF;
END $$;

-- Alguns Serviços de Exemplo
INSERT INTO servicos (nome, descricao, slug, ativo)
VALUES
    ('Teste dos 4 Temperamentos', 'Descubra seu temperamento dominante: Sanguíneo, Colérico, Melancólico ou Fleumático.', 'teste-4-temperamentos', true),
    ('Análise Comportamental DISC', 'Entenda seus padrões de comportamento através da metodologia DISC.', 'analise-disc', true),
    ('Mapeamento Facial (Visagismo)', 'Análise dos traços faciais para autoconhecimento e imagem pessoal.', 'mapeamento-facial', false),
    ('Coaching de Carreira Express', 'Sessão rápida para direcionamento profissional.', 'coaching-carreira-express', true)
ON CONFLICT (slug) DO NOTHING; -- Esta também deve funcionar bem.

-- Confirmação final
SELECT 'Dados inseridos (ou já existentes e mantidos). Verifique a saída abaixo.' AS status;
SELECT * FROM usuarios;
SELECT * FROM clientes;
SELECT * FROM servicos;
