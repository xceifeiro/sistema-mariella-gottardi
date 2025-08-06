-- Script para testar a funcionalidade de Análise Facial
-- Baseado na estrutura atual do banco de dados

-- 1. Primeiro, vamos garantir que o serviço de Análise Facial existe
INSERT INTO servicos (nome, descricao, slug, ativo) 
VALUES (
    'Análise Facial',
    'Análise completa da personalidade através de características faciais usando técnicas de visagismo e morfopsicologia.',
    'analise-facial',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao = EXCLUDED.descricao,
    ativo = EXCLUDED.ativo;

-- 2. Criar um cliente de teste se não existir
DO $$
DECLARE
    cliente_test_id UUID;
    servico_analise_id INT;
    pedido_test_id UUID;
BEGIN
    -- Inserir usuário cliente de teste
    INSERT INTO usuarios (id, nome, email, senha_hash, tipo_usuario)
    VALUES (
        gen_random_uuid(),
        'Maria Silva Santos',
        'maria.teste@example.com',
        '$2a$10$dummy.hash.for.testing.purposes.only',
        'cliente'
    )
    ON CONFLICT (email) DO NOTHING;

    -- Obter o ID do cliente
    SELECT id INTO cliente_test_id 
    FROM usuarios 
    WHERE email = 'maria.teste@example.com';

    -- Garantir que existe na tabela clientes
    INSERT INTO clientes (id, telefone, data_nascimento, genero, documento, status)
    VALUES (
        cliente_test_id,
        '(11) 98765-4321',
        '1985-03-15',
        'feminino',
        '123.456.789-01',
        'ativo'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Obter o ID do serviço de Análise Facial
    SELECT id INTO servico_analise_id 
    FROM servicos 
    WHERE slug = 'analise-facial';

    -- Criar um pedido de teste em andamento
    INSERT INTO pedidos (id, cliente_id, servico_id, status, data_pedido, atualizado_em)
    VALUES (
        gen_random_uuid(),
        cliente_test_id,
        servico_analise_id,
        'em_andamento',
        timezone('utc', now()) - INTERVAL '2 days',
        timezone('utc', now()) - INTERVAL '1 day'
    )
    RETURNING id INTO pedido_test_id;

    -- Inserir log de ação
    INSERT INTO logs (usuario_id, acao, descricao, criado_em)
    VALUES (
        cliente_test_id,
        'contratacao_servico',
        'Contratou o serviço: Análise Facial - DADOS DE TESTE',
        timezone('utc', now()) - INTERVAL '2 days'
    );

    -- Inserir log de envio de imagens (simulado)
    INSERT INTO logs (usuario_id, acao, descricao, criado_em)
    VALUES (
        cliente_test_id,
        'envio_imagens_analise_facial',
        'Enviou imagens para análise facial - DADOS DE TESTE',
        timezone('utc', now()) - INTERVAL '1 day'
    );

    RAISE NOTICE 'Dados de teste criados com sucesso!';
    RAISE NOTICE 'Cliente: Maria Silva Santos (ID: %)', cliente_test_id;
    RAISE NOTICE 'Pedido: % (Status: em_andamento)', pedido_test_id;
    RAISE NOTICE 'Serviço: Análise Facial (ID: %)', servico_analise_id;

END $$;

-- 3. Criar um segundo cliente de teste para ter mais dados
DO $$
DECLARE
    cliente_test2_id UUID;
    servico_analise_id INT;
    pedido_test2_id UUID;
BEGIN
    -- Inserir segundo usuário cliente de teste
    INSERT INTO usuarios (id, nome, email, senha_hash, tipo_usuario)
    VALUES (
        gen_random_uuid(),
        'João Carlos Oliveira',
        'joao.teste@example.com',
        '$2a$10$dummy.hash.for.testing.purposes.only',
        'cliente'
    )
    ON CONFLICT (email) DO NOTHING;

    -- Obter o ID do segundo cliente
    SELECT id INTO cliente_test2_id 
    FROM usuarios 
    WHERE email = 'joao.teste@example.com';

    -- Garantir que existe na tabela clientes
    INSERT INTO clientes (id, telefone, data_nascimento, genero, documento, status)
    VALUES (
        cliente_test2_id,
        '(11) 91234-5678',
        '1990-07-22',
        'masculino',
        '987.654.321-02',
        'ativo'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Obter o ID do serviço de Análise Facial
    SELECT id INTO servico_analise_id 
    FROM servicos 
    WHERE slug = 'analise-facial';

    -- Criar segundo pedido de teste em andamento
    INSERT INTO pedidos (id, cliente_id, servico_id, status, data_pedido, atualizado_em)
    VALUES (
        gen_random_uuid(),
        cliente_test2_id,
        servico_analise_id,
        'em_andamento',
        timezone('utc', now()) - INTERVAL '3 days',
        timezone('utc', now()) - INTERVAL '2 days'
    )
    RETURNING id INTO pedido_test2_id;

    -- Inserir logs para o segundo cliente
    INSERT INTO logs (usuario_id, acao, descricao, criado_em)
    VALUES (
        cliente_test2_id,
        'contratacao_servico',
        'Contratou o serviço: Análise Facial - DADOS DE TESTE',
        timezone('utc', now()) - INTERVAL '3 days'
    );

    INSERT INTO logs (usuario_id, acao, descricao, criado_em)
    VALUES (
        cliente_test2_id,
        'envio_imagens_analise_facial',
        'Enviou imagens para análise facial - DADOS DE TESTE',
        timezone('utc', now()) - INTERVAL '2 days'
    );

    RAISE NOTICE 'Segundo conjunto de dados de teste criado!';
    RAISE NOTICE 'Cliente: João Carlos Oliveira (ID: %)', cliente_test2_id;
    RAISE NOTICE 'Pedido: % (Status: em_andamento)', pedido_test2_id;

END $$;

-- 4. Criar um terceiro cliente com pedido concluído (para testar visualização de resultados)
DO $$
DECLARE
    cliente_test3_id UUID;
    servico_analise_id INT;
    pedido_test3_id UUID;
    resultado_test_id UUID;
BEGIN
    -- Inserir terceiro usuário cliente de teste
    INSERT INTO usuarios (id, nome, email, senha_hash, tipo_usuario)
    VALUES (
        gen_random_uuid(),
        'Ana Paula Costa',
        'ana.teste@example.com',
        '$2a$10$dummy.hash.for.testing.purposes.only',
        'cliente'
    )
    ON CONFLICT (email) DO NOTHING;

    -- Obter o ID do terceiro cliente
    SELECT id INTO cliente_test3_id 
    FROM usuarios 
    WHERE email = 'ana.teste@example.com';

    -- Garantir que existe na tabela clientes
    INSERT INTO clientes (id, telefone, data_nascimento, genero, documento, status)
    VALUES (
        cliente_test3_id,
        '(11) 95555-1234',
        '1988-12-10',
        'feminino',
        '456.789.123-03',
        'ativo'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Obter o ID do serviço de Análise Facial
    SELECT id INTO servico_analise_id 
    FROM servicos 
    WHERE slug = 'analise-facial';

    -- Criar terceiro pedido já concluído
    INSERT INTO pedidos (id, cliente_id, servico_id, status, data_pedido, atualizado_em)
    VALUES (
        gen_random_uuid(),
        cliente_test3_id,
        servico_analise_id,
        'concluido',
        timezone('utc', now()) - INTERVAL '7 days',
        timezone('utc', now()) - INTERVAL '1 day'
    )
    RETURNING id INTO pedido_test3_id;

    -- Criar resultado de teste para este pedido
    INSERT INTO resultados_testes (id, pedido_id, tipo_teste, resultado, criado_em)
    VALUES (
        gen_random_uuid(),
        pedido_test3_id,
        'Análise Facial',
        '{
            "formato_geral_rosto": {
                "classificacao": "Oval",
                "justificativa_visual": "Rosto harmonioso com proporções equilibradas",
                "temperamento_associado": "Sanguíneo",
                "interpretacao": "Pessoa comunicativa e sociável"
            },
            "terco_superior": {
                "testa": {
                    "classificacao": "Média e proporcional",
                    "justificativa_visual": "Testa bem definida sem ser muito alta ou baixa",
                    "temperamento_associado": "Sanguíneo",
                    "interpretacao": "Equilibrio entre razão e emoção"
                }
            },
            "perfil_resumido": {
                "temperamento_predominante": "Sanguíneo",
                "descricao_geral": "Pessoa extrovertida, comunicativa e otimista. Gosta de estar em grupo e tem facilidade para se relacionar."
            }
        }'::jsonb,
        timezone('utc', now()) - INTERVAL '1 day'
    )
    RETURNING id INTO resultado_test_id;

    -- Inserir logs para o terceiro cliente
    INSERT INTO logs (usuario_id, acao, descricao, criado_em)
    VALUES (
        cliente_test3_id,
        'contratacao_servico',
        'Contratou o serviço: Análise Facial - DADOS DE TESTE',
        timezone('utc', now()) - INTERVAL '7 days'
    );

    INSERT INTO logs (usuario_id, acao, descricao, criado_em)
    VALUES (
        cliente_test3_id,
        'finalizacao_analise_facial',
        'Análise facial finalizada - DADOS DE TESTE',
        timezone('utc', now()) - INTERVAL '1 day'
    );

    RAISE NOTICE 'Terceiro conjunto de dados de teste criado!';
    RAISE NOTICE 'Cliente: Ana Paula Costa (ID: %)', cliente_test3_id;
    RAISE NOTICE 'Pedido: % (Status: concluido)', pedido_test3_id;
    RAISE NOTICE 'Resultado: % (Tipo: Análise Facial)', resultado_test_id;

END $$;

-- 5. Verificar os dados criados
SELECT 
    '=== RESUMO DOS DADOS DE TESTE CRIADOS ===' as info;

SELECT 
    u.nome as cliente_nome,
    u.email as cliente_email,
    p.id as pedido_id,
    p.status as pedido_status,
    p.data_pedido,
    s.nome as servico_nome,
    CASE 
        WHEN rt.id IS NOT NULL THEN 'SIM' 
        ELSE 'NÃO' 
    END as tem_resultado
FROM pedidos p
JOIN usuarios u ON p.cliente_id = u.id
JOIN servicos s ON p.servico_id = s.id
LEFT JOIN resultados_testes rt ON rt.pedido_id = p.id
WHERE u.email IN ('maria.teste@example.com', 'joao.teste@example.com', 'ana.teste@example.com')
ORDER BY p.data_pedido DESC;

-- 6. Mostrar contagem de logs criados
SELECT 
    COUNT(*) as total_logs_teste,
    'logs de teste criados' as descricao
FROM logs 
WHERE descricao LIKE '%DADOS DE TESTE%';

-- 7. Mostrar instruções para teste
SELECT 
    '=== INSTRUÇÕES PARA TESTE ===' as instrucoes;

SELECT 
    '1. Faça login como admin em /login' as passo_1;
SELECT 
    '2. Navegue para /admin/analise-facial' as passo_2;
SELECT 
    '3. Você verá 2 pedidos pendentes (Maria e João)' as passo_3;
SELECT 
    '4. Clique em "Analisar e Criar Resultado" para testar' as passo_4;
SELECT 
    '5. Preencha os campos e salve para finalizar' as passo_5;
SELECT 
    '6. Para ver resultado pronto, faça login como ana.teste@example.com' as passo_6;
SELECT 
    '7. Navegue para /dashboard/resultados para ver o resultado da Ana' as passo_7;

-- 8. Mostrar dados de login para teste
SELECT 
    '=== DADOS PARA LOGIN DE TESTE ===' as login_info;

SELECT 
    'maria.teste@example.com' as email_cliente_1,
    'password123' as senha_sugerida_1,
    'Pedido EM ANDAMENTO' as status_1;

SELECT 
    'joao.teste@example.com' as email_cliente_2,
    'password123' as senha_sugerida_2,
    'Pedido EM ANDAMENTO' as status_2;

SELECT 
    'ana.teste@example.com' as email_cliente_3,
    'password123' as senha_sugerida_3,
    'Pedido CONCLUÍDO com resultado' as status_3;
