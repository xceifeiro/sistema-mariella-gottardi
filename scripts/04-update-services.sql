-- Limpar serviços existentes e inserir os novos serviços específicos
DELETE FROM servicos;

-- Inserir os novos serviços com informações detalhadas
INSERT INTO servicos (nome, descricao, slug, ativo) VALUES
(
    'Teste de Temperamentos',
    'Descubra seu temperamento dominante através de uma análise completa baseada nos 4 temperamentos clássicos: Sanguíneo, Colérico, Melancólico e Fleumático. Este teste ajuda você a entender suas características comportamentais, pontos fortes e áreas de desenvolvimento.',
    'teste-temperamentos',
    true
),
(
    'Teste DISC',
    'Análise comportamental profunda utilizando a metodologia DISC (Dominância, Influência, Estabilidade, Conformidade). Ideal para desenvolvimento profissional, liderança e melhoria das relações interpessoais no ambiente de trabalho.',
    'teste-disc',
    true
),
(
    'Análise Facial',
    'Mapeamento facial personalizado que revela traços de personalidade através da análise dos seus traços faciais. Inclui orientações de visagismo e dicas para potencializar sua imagem pessoal e profissional.',
    'analise-facial',
    true
),
(
    'Pacote FULL',
    'Acesso completo a todos os nossos serviços! Inclui Teste de Temperamentos, Teste DISC e Análise Facial. A opção mais completa para um autoconhecimento profundo e desenvolvimento pessoal abrangente.',
    'pacote-full',
    true
);

-- Verificar os serviços inseridos
SELECT id, nome, slug, ativo FROM servicos ORDER BY id;
