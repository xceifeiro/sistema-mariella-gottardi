export default function ChrisReport() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatório de Análise Facial e Temperamentos</h1>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div><strong>Nome:</strong> Chris</div>
              <div><strong>Cargo:</strong> Gerente de Obras</div>
              <div><strong>Setor:</strong> Engenharia/Construção</div>
              <div><strong>Data do relatório:</strong> [Inserir data atual]</div>
              <div className="col-span-2"><strong>Consultor responsável:</strong> [Inserir nome do consultor]</div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">APRESENTAÇÃO DO MÉTODO</h2>
              <p className="text-gray-700 leading-relaxed">
                A leitura facial simbólica é um convite ao mergulho nas águas profundas do autoconhecimento, onde cada traço do rosto revela não apenas a história vivida, mas também as potências latentes e os desafios silenciosos que habitam o ser. No contexto corporativo, essa abordagem se entrelaça com a análise dos temperamentos humanos, permitindo uma compreensão integral do colaborador: suas motivações, modos de agir, padrões emocionais e caminhos de realização. O rosto, dividido em três terços – superior, médio e inferior –, torna-se um mapa simbólico do intelecto, das emoções e da ação. Ao cruzar essa leitura com o resultado do questionário de temperamentos, emergem nuances que transcendem o óbvio, revelando tanto as forças quanto as vulnerabilidades que influenciam a performance profissional. Este relatório é, portanto, um espelho terapêutico e estratégico, desenhado para iluminar o potencial de Chris, antecipar riscos psicossociais e traçar recomendações que favoreçam o florescimento humano e a excelência no ambiente de trabalho.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">A LEITURA DA FACE POR TERÇOS</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">TERÇO SUPERIOR – INTELECTO E VISÃO ESTRATÉGICA</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A testa de Chris, de formato redondo e marcada por uma energia melancólica, sugere uma mente que valoriza a reflexão, o planejamento minucioso e a busca constante por sentido em cada ação. A redondeza da testa indica flexibilidade cognitiva, capacidade de adaptação e abertura para novas ideias, mas a tonalidade melancólica imprime um filtro de cautela, análise e perfeccionismo. O pensamento não é impulsivo: ele se constrói em camadas, como quem ergue uma obra sólida, tijolo por tijolo. O potencial visível reside na habilidade de antever riscos, ponderar alternativas e construir estratégias robustas. No entanto, o excesso de análise pode gerar paralisia decisória ou autocrítica exacerbada, especialmente em ambientes de alta pressão. O temperamento melancólico, dominante neste terço, favorece a concentração e o detalhismo, mas pede espaços de escuta e validação para que a criatividade não se retraia diante do medo de errar.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">TERÇO MÉDIO – EMOÇÕES E RELACIONAMENTOS</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Os olhos de Chris, com pálpebras não aparentes, caídas, e a presença de rugas e bolsas, revelam uma alma que carrega o peso das responsabilidades e a profundidade dos sentimentos. A expressão fleumática e melancólica nesta região indica uma sensibilidade refinada, empatia natural e uma escuta generosa. As sobrancelhas ralas, de natureza fleumática, reforçam a tendência à diplomacia, à ponderação e ao desejo de evitar conflitos. O potencial oculto aqui é a capacidade de criar ambientes de confiança, onde as emoções podem ser expressas sem medo de julgamento. Chris é o gestor que acolhe, que percebe nuances emocionais e que sabe quando silenciar para ouvir o outro. Contudo, a mesma sensibilidade pode se transformar em sobrecarga emocional, especialmente quando há dificuldade em estabelecer limites ou em delegar tarefas. O risco é absorver as dores do time, tornando-se um reservatório de tensões não verbalizadas.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">TERÇO INFERIOR – AÇÃO E EXECUÇÃO</h3>
                  <p className="text-gray-700 leading-relaxed">
                    O nariz redondo, de temperamento melancólico, e a boca simétrica, fleumática, compõem um terço inferior que fala de uma ação pautada pela harmonia, pelo desejo de equilíbrio e pela busca de resultados consistentes. Chris executa com precisão, mas sem pressa; prefere a qualidade à quantidade, o processo bem-feito ao improviso. A simetria da boca revela uma comunicação clara, ponderada, que evita extremos e busca sempre o consenso. O potencial visível é a capacidade de manter a equipe coesa, de garantir que cada etapa da obra seja cumprida com rigor e respeito aos processos. O desafio, porém, está na tendência a acumular funções, a assumir responsabilidades que poderiam ser delegadas, e na dificuldade de impor limites quando a demanda externa excede a capacidade interna. O temperamento fleumático, predominante neste terço, favorece a estabilidade, mas pode gerar acomodação ou resistência a mudanças bruscas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">A TRÍADE DOS TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                A tríade de Chris é composta por um temperamento fleumático dominante, seguido pelo melancólico como secundário e, em menor grau, nuances de adaptação e diplomacia como complemento. Essa combinação se manifesta de forma singular no cotidiano profissional. O fleumático dominante confere uma postura serena, conciliadora e resiliente diante dos desafios. Chris é aquele que, mesmo sob pressão, mantém o equilíbrio, evita reações impulsivas e busca sempre o entendimento mútuo. O melancólico secundário acrescenta profundidade, senso crítico e um desejo constante de aprimoramento. Essa dupla permite que Chris seja um líder que escuta, pondera e age com responsabilidade, mas que também pode se perder em detalhes ou hesitar diante de decisões que exigem rapidez. O complemento diplomático reforça a habilidade de mediar conflitos, construir pontes e promover a coesão do grupo. No entanto, a tríade também aponta para o risco de sobrecarga: ao tentar agradar a todos e evitar confrontos, Chris pode assumir tarefas demais, dificultando a delegação e comprometendo sua própria saúde emocional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RESULTADO DO QUESTIONÁRIO DE TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                O questionário confirma a predominância dos temperamentos fleumático e melancólico, em perfeita consonância com a leitura facial. A autoimagem de Chris é a de alguém adaptável, diplomata e atento às necessidades do grupo, mas que reconhece a tendência a fazer o trabalho dos outros e a dificuldade em delegar. Essa convergência entre expressão inconsciente (face) e percepção consciente (teste) reforça a autenticidade do perfil: Chris se conhece e se reconhece em suas virtudes e limitações. Não há grandes incongruências, mas sim uma confirmação de que o desafio central está no equilíbrio entre acolher e impor limites, entre executar e delegar. O risco, aqui, é a cristalização de padrões de autoexigência e o acúmulo silencioso de tensões, que podem se manifestar em momentos de sobrecarga ou insatisfação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">PERFIL DE POTENCIAL PROFISSIONAL</h2>
              <p className="text-gray-700 leading-relaxed">
                No cargo de Gerente de Obras, Chris encontra terreno fértil para expressar suas potências. O temperamento fleumático favorece a gestão de equipes, a construção de ambientes colaborativos e a resolução pacífica de conflitos. Chris é o líder que inspira confiança, que sabe ouvir e que valoriza o diálogo. O melancólico, por sua vez, garante o rigor técnico, o olhar atento aos detalhes e o compromisso com a excelência. Sob pressão, Chris tende a internalizar as demandas, buscando soluções silenciosas e evitando expor fragilidades. O ponto forte está na capacidade de manter a equipe unida, de garantir a qualidade dos processos e de antecipar riscos operacionais. O estilo de liderança é participativo, com ênfase na escuta e na construção coletiva. A comunicação é clara, mas pode ser excessivamente cautelosa em situações de conflito. O desafio maior é evitar o acúmulo de funções e aprender a confiar mais na equipe, delegando tarefas e compartilhando responsabilidades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">MAPA DE RISCOS PSICOSSOCIAIS</h2>
              <p className="text-gray-700 leading-relaxed">
                O principal ponto de tensão para Chris reside na sobrecarga emocional e funcional. A tendência a assumir o trabalho dos outros, aliada à dificuldade em delegar, pode levar ao esgotamento físico e mental. O risco de burnout é real, especialmente em períodos de alta demanda ou em projetos com prazos apertados. A rigidez emocional, típica do melancólico, pode se manifestar em autocrítica excessiva, sensação de inadequação ou dificuldade em lidar com erros. O fleumático, por sua vez, pode se refugiar na acomodação, evitando confrontos necessários e adiando decisões importantes. O ambiente de obras, com suas exigências constantes e múltiplas interfaces, pode potencializar esses riscos se não houver espaços de escuta, apoio e partilha. É fundamental que Chris aprenda a reconhecer seus limites, a pedir ajuda quando necessário e a praticar o autocuidado como parte integrante de sua rotina profissional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RECOMENDAÇÕES DE PERFORMANCE</h2>
              <p className="text-gray-700 leading-relaxed">
                Para ativar o temperamento dominante (fleumático), Chris deve investir em práticas que fortaleçam sua capacidade de mediação e escuta ativa, mas sem abrir mão da assertividade. É importante estabelecer limites claros, tanto para si quanto para a equipe, e aprender a dizer não quando necessário. Para canalizar o temperamento secundário (melancólico), recomenda-se o cultivo da autocompaixão, a flexibilização das metas e a valorização dos pequenos avanços. O equilíbrio do temperamento complementar exige o desenvolvimento de habilidades de delegação, a construção de processos claros e a confiança no potencial da equipe. Na comunicação com a liderança, Chris deve ser transparente quanto às suas necessidades e desafios, buscando apoio e feedbacks construtivos. Com a equipe, o foco deve estar na construção de um ambiente de confiança, onde todos se sintam responsáveis pelo resultado coletivo. Caso haja desalinhamento vocacional, recomenda-se a busca por funções que valorizem a escuta, a mediação e o planejamento estratégico, evitando cargos excessivamente operacionais ou solitários.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">PLANO DE DESENVOLVIMENTO INDIVIDUAL – PDI (90 DIAS)</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Metas comportamentais específicas:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Delegar pelo menos 30% das tarefas operacionais atualmente sob sua responsabilidade, treinando e acompanhando o desenvolvimento da equipe.</li>
                  <li>Praticar feedbacks semanais, tanto positivos quanto construtivos, fortalecendo a comunicação assertiva e a cultura de confiança.</li>
                  <li>Implementar uma rotina de autocuidado, reservando ao menos 30 minutos diários para atividades que promovam bem-estar físico e emocional.</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">KPIs sugeridos:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Redução do tempo médio dedicado a tarefas operacionais por semana.</li>
                  <li>Aumento do índice de satisfação da equipe (medido por pesquisa interna).</li>
                  <li>Frequência e qualidade dos feedbacks registrados.</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">Recurso externo recomendado:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Mentoria com gestor experiente em delegação e desenvolvimento de equipes.</li>
                  <li>Leitura: "O Monge e o Executivo", para aprofundar a liderança servidora.</li>
                  <li>Participação em workshop de comunicação assertiva.</li>
                </ul>

                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 font-semibold">Frase de ação para ancorar o PDI:</p>
                  <p className="text-blue-700 italic">"Confio na força do coletivo e permito que o fluxo do trabalho seja partilhado, para que todos cresçamos juntos."</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">ENCERRAMENTO E FRASE DE ESSÊNCIA</h2>
              <p className="text-gray-700 leading-relaxed">
                Chris é, simbolicamente, o arquiteto silencioso das relações e dos processos. Sua essência é a da ponte: une margens, conecta pessoas, sustenta estruturas invisíveis que garantem a soli dez do todo. Sua frase de identidade – "Adaptável às situações que precisam exercer liderança, diplomata, sabe escutar os liderados" – ecoa como um mantra de equilíbrio e serviço. Que este relatório seja não apenas um diagnóstico, mas um convite ao florescimento: que Chris reconheça o valor de sua escuta, mas também a potência de sua voz; que saiba acolher, mas também delegar; que seja, enfim, o construtor de si mesmo e do mundo ao seu redor.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
