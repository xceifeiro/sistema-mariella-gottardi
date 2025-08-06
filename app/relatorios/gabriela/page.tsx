export default function GabrielaReport() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatório de Análise Facial e Temperamentos</h1>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Nome:</strong> Gabriela
              </div>
              <div>
                <strong>Cargo:</strong> Gerente de Marketing
              </div>
              <div>
                <strong>Setor:</strong> Marketing
              </div>
              <div>
                <strong>Data do relatório:</strong> [Inserir data atual]
              </div>
              <div className="col-span-2">
                <strong>Consultor responsável:</strong> [Inserir nome do consultor]
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">APRESENTAÇÃO DO MÉTODO</h2>
              <p className="text-gray-700 leading-relaxed">
                O rosto humano é um mapa simbólico, onde cada linha, curva e relevo narra a história silenciosa de quem
                somos e de como nos movemos no mundo. A leitura facial simbólica, aliada à compreensão dos temperamentos
                clássicos – colérico, melancólico, sanguíneo e fleumático –, permite acessar camadas profundas da
                personalidade, revelando não apenas o que se mostra à superfície, mas também os fluxos subterrâneos que
                impulsionam escolhas, relações e performance profissional. No contexto corporativo, essa abordagem
                transcende o diagnóstico superficial: ela ilumina potenciais, antecipa riscos psicossociais e orienta o
                desenvolvimento individual com precisão terapêutica.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                O método aqui apresentado parte da análise detalhada dos terços faciais – superior, médio e inferior –,
                cruzando suas mensagens simbólicas com os resultados do questionário de temperamentos e a função
                exercida. O objetivo é construir um retrato integrativo, onde forma e essência dialogam, apontando
                caminhos para a excelência, o equilíbrio emocional e a realização vocacional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">A LEITURA DA FACE POR TERÇOS</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">
                    TERÇO SUPERIOR – INTELECTO E VISÃO ESTRATÉGICA
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A testa de Gabriela, estreita e inclinada, com laterais de base reta, revela uma mente que opera em
                    profundidade, mas dentro de limites bem definidos. A inclinação sugere uma inclinação natural à
                    introspecção e ao planejamento estratégico, enquanto a base reta indica objetividade e clareza de
                    raciocínio. O formato estreito pode apontar para uma seletividade intelectual: Gabriela filtra
                    informações, priorizando qualidade à quantidade, e tende a se aprofundar apenas naquilo que
                    considera relevante para o contexto.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    O predomínio do temperamento melancólico nesta região reforça a imagem de uma pensadora analítica,
                    dotada de grande capacidade de concentração, senso crítico e habilidade para criar e inovar a partir
                    de uma base sólida de conhecimento. No entanto, essa mesma configuração pode gerar um excesso de
                    autoexigência e uma tendência ao isolamento mental, especialmente quando as ideias não encontram eco
                    ou espaço para expressão criativa no ambiente de trabalho.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    O cabelo escuro e liso, associado ao temperamento colérico, adiciona uma camada de intensidade e
                    direcionamento à expressão intelectual. Gabriela não apenas pensa, mas também busca transformar
                    pensamento em ação, imprimindo energia e foco aos projetos que lidera.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-green-800 mb-2">Potenciais visíveis:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Capacidade de planejamento estratégico e inovação fundamentada.</li>
                      <li>Foco e seletividade intelectual.</li>
                      <li>Direcionamento e clareza de objetivos.</li>
                    </ul>

                    <h4 className="font-semibold text-green-800 mb-2 mt-4">Potenciais ocultos:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Riqueza de ideias que podem permanecer não verbalizadas por receio de julgamento.</li>
                      <li>Necessidade de ambientes seguros para compartilhar visões inovadoras.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">
                    TERÇO MÉDIO – EMOÇÕES, RELACIONAMENTOS E EXPRESSIVIDADE
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    No terço médio, as sobrancelhas arredondadas e ligeiramente espessas, com predominância melancólica
                    e traços coléricos, sugerem uma sensibilidade emocional aliada à assertividade. Gabriela sente
                    profundamente, mas não se deixa dominar pelas emoções: ela as canaliza para o trabalho,
                    transformando sensibilidade em percepção aguçada das necessidades do outro e do mercado.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Os olhos amendoados, marcados por rugas e pequenas bolsas, são janelas de uma alma que observa,
                    analisa e absorve. O olhar melancólico é atento, detalhista, capaz de captar nuances e antecipar
                    movimentos, mas pode carregar o peso da preocupação e da responsabilidade. As rugas e bolsas indicam
                    vivências intensas, noites de reflexão e um compromisso visceral com os resultados.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    O nariz sanguíneo introduz uma nota de sociabilidade e adaptabilidade, suavizando a rigidez
                    melancólica e colérica. Gabriela possui, assim, uma capacidade de transitar entre a análise profunda
                    e a comunicação leve, adaptando-se às demandas do ambiente e das relações.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-green-800 mb-2">Potenciais visíveis:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Sensibilidade estratégica para captar tendências e necessidades.</li>
                      <li>Assertividade na comunicação emocional.</li>
                      <li>Capacidade de adaptação relacional.</li>
                    </ul>

                    <h4 className="font-semibold text-green-800 mb-2 mt-4">Potenciais ocultos:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Vulnerabilidade ao desgaste emocional.</li>
                      <li>Dificuldade em pedir ajuda ou compartilhar fragilidades.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">
                    TERÇO INFERIOR – AÇÃO, DECISÃO E EXECUÇÃO
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A boca em arco do cupido, de natureza melancólica, revela uma expressão verbal cuidadosa, marcada
                    pela busca de precisão e beleza na comunicação. Gabriela fala com intenção, escolhendo palavras que
                    transmitam não apenas informação, mas também significado e emoção. O queixo melancólico reforça a
                    imagem de uma profissional determinada, mas que pondera antes de agir, avaliando riscos e
                    consequências.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    A análise dentária revela uma interessante dualidade: incisivos e caninos direitos coléricos,
                    incisivo lateral e canino esquerdos fleumáticos. Isso sugere que, ao se posicionar no mundo (lado
                    direito, ação externa), Gabriela é assertiva, decidida e capaz de liderar com firmeza. No entanto,
                    em seu universo interno (lado esquerdo, ação interna), ela busca harmonia, estabilidade e evita
                    conflitos desnecessários.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-green-800 mb-2">Potenciais visíveis:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Comunicação precisa e impactante.</li>
                      <li>Capacidade de liderança assertiva.</li>
                      <li>Decisão ponderada, com avaliação de riscos.</li>
                    </ul>

                    <h4 className="font-semibold text-green-800 mb-2 mt-4">Potenciais ocultos:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Tendência à autocrítica excessiva.</li>
                      <li>Dificuldade em delegar tarefas por perfeccionismo.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">A TRÍADE DOS TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                Gabriela apresenta uma tríade composta por melancólico (dominante), colérico (secundário) e traços
                fleumáticos (complementares). O temperamento melancólico domina sua essência, conferindo-lhe
                criatividade, inovação, organização e planejamento. O colérico, como força secundária, imprime
                objetividade, clareza e firmeza na condução de equipes e projetos. O fleumático, mais sutil,
                manifesta-se na busca por equilíbrio e harmonia, especialmente nas relações interpessoais e na gestão de
                conflitos internos.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                No comportamento, essa tríade se traduz em uma profissional que planeja com profundidade, executa com
                determinação e busca, ainda que de forma reservada, ambientes de estabilidade emocional. Nas relações,
                Gabriela tende a ser seletiva, valorizando vínculos autênticos e evitando superficialidades. Sua tomada
                de decisão é pautada por análise criteriosa, mas, uma vez convencida, age com rapidez e firmeza.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Na gestão de tarefas, alia visão estratégica à capacidade de execução, mas pode se sobrecarregar ao
                tentar controlar todos os detalhes. O desafio está em equilibrar o desejo de perfeição com a necessidade
                de delegar e confiar na equipe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RESULTADO DO QUESTIONÁRIO DE TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                O questionário confirma a predominância melancólica, seguida do colérico, em total consonância com a
                leitura facial. A convergência entre autoimagem e expressão inconsciente indica um alto grau de
                autoconhecimento e autenticidade: Gabriela reconhece e integra suas forças e vulnerabilidades.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                No entanto, a presença de traços fleumáticos nos dentes sugere que, em situações de estresse ou pressão,
                pode emergir uma necessidade de proteção, busca por estabilidade ou até mesmo uma tendência à acomodação
                temporária. Essa incongruência sutil aponta para a importância de criar espaços de escuta e acolhimento,
                onde Gabriela possa expressar dúvidas e inseguranças sem receio de julgamento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">PERFIL DE POTENCIAL PROFISSIONAL</h2>
              <p className="text-gray-700 leading-relaxed">
                No cargo de Gerente de Marketing, Gabriela encontra terreno fértil para manifestar seus talentos. Sua
                criatividade e capacidade de inovação são potencializadas pela organização e pelo planejamento rigoroso,
                permitindo-lhe desenvolver campanhas originais, mas sempre ancoradas em dados e estratégias sólidas.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Seu estilo de liderança é direto e objetivo, mas não agressivo: ela orienta a equipe com clareza,
                posiciona-se com firmeza e valoriza a transparência. Na comunicação, alia precisão melancólica à
                assertividade colérica, tornando-se uma referência de confiança e inspiração.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Sob pressão, Gabriela tende a intensificar o controle e a autocrítica, podendo se isolar ou assumir
                responsabilidades excessivas. Sua força reside na capacidade de transformar desafios em oportunidades de
                crescimento, mas o risco está em não reconhecer os próprios limites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">MAPA DE RISCOS PSICOSSOCIAIS</h2>
              <p className="text-gray-700 leading-relaxed">
                O principal ponto de tensão para Gabriela é o risco de burnout, decorrente da combinação entre alta
                autoexigência melancólica e o impulso colérico por resultados. A busca incessante por perfeição pode
                levá-la a jornadas extenuantes, dificultando o equilíbrio entre vida pessoal e profissional.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Há também o risco de rigidez emocional, especialmente quando ideias inovadoras não são acolhidas ou
                quando enfrenta resistência da equipe. A tendência a internalizar frustrações pode gerar sentimentos de
                inadequação ou apatia temporária.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Por fim, a presença de traços fleumáticos indica uma possível fuga para zonas de conforto em momentos de
                exaustão, o que pode comprometer a performance e a motivação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RECOMENDAÇÕES DE PERFORMANCE</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-700">Para ativar o dominante (melancólico):</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Estimular espaços de criação coletiva, onde Gabriela possa compartilhar ideias sem medo de
                      julgamento.
                    </li>
                    <li>
                      Valorizar o processo, não apenas o resultado, reconhecendo pequenas conquistas ao longo do
                      caminho.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-700">Para canalizar o secundário (colérico):</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Delegar tarefas operacionais, focando energia em decisões estratégicas e liderança inspiradora.
                    </li>
                    <li>Praticar a escuta ativa, equilibrando firmeza com abertura ao diálogo.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-700">Para equilibrar o complementar (fleumático):</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Reservar momentos de pausa e autocuidado, prevenindo o desgaste emocional.</li>
                    <li>Buscar feedbacks construtivos, fortalecendo a autoconfiança e a sensação de pertencimento.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-700">Comunicação com liderança e equipe:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Adotar uma postura transparente, compartilhando não apenas metas, mas também desafios e
                      aprendizados.
                    </li>
                    <li>
                      Incentivar a cultura do erro como parte do processo criativo, reduzindo a pressão por perfeição.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-700">
                    Caminhos para alinhamento vocacional ou reposicionamento estratégico:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Explorar projetos que unam inovação e impacto social, ampliando o sentido de propósito.</li>
                    <li>
                      Considerar mentorias ou grupos de mastermind para troca de experiências e expansão de repertório.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                PLANO DE DESENVOLVIMENTO INDIVIDUAL – PDI (90 DIAS)
              </h2>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Metas comportamentais específicas:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Praticar a delegação consciente, reduzindo o controle excessivo sobre processos operacionais.</li>
                  <li>
                    Reservar semanalmente um tempo para brainstorm criativo com a equipe, estimulando a leveza e a
                    alegria na inovação.
                  </li>
                  <li>Implementar uma rotina de autocuidado, incluindo pausas regulares e atividades de lazer.</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">KPIs sugeridos:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Redução do tempo dedicado a tarefas operacionais em 30%.</li>
                  <li>Aumento do número de ideias implementadas a partir de brainstorms coletivos.</li>
                  <li>Melhora perceptível no bem-estar emocional, avaliada por auto-relato e feedbacks da equipe.</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">Recurso externo recomendado:</h3>
                <p className="text-gray-700">null.</p>

                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 font-semibold">Frase de ação para ancorar o PDI:</p>
                  <p className="text-blue-700 italic">
                    "Permito-me inovar com leveza, delegar com confiança e cuidar de mim para cuidar do todo."
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">ENCERRAMENTO E FRASE DE ESSÊNCIA</h2>
              <p className="text-gray-700 leading-relaxed">
                Gabriela, tua face é um espelho onde a profundidade do pensamento encontra a força da ação e a busca
                pela beleza se alia ao desejo de transformar. Em ti, a criatividade melancólica dança com a objetividade
                colérica, e o silêncio das ideias amadurece até florescer em projetos que inspiram e renovam. Que tua
                jornada seja marcada não apenas por conquistas, mas pela alegria de inovar em comunhão, celebrando cada
                passo como expressão da tua essência única.
              </p>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-semibold mb-2">Frase de identidade interpretada poeticamente:</p>
                <p className="text-blue-700 italic text-lg">
                  "Inovo com propósito, lidero com clareza e crio beleza onde há desafio."
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
