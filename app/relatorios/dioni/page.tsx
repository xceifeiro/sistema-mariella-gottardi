export default function DioniReport() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatório de Análise Facial e Temperamentos</h1>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Nome:</strong> Dioni
              </div>
              <div>
                <strong>Cargo:</strong> Diretor de Engenharia
              </div>
              <div>
                <strong>Setor:</strong> Engenharia
              </div>
              <div>
                <strong>Data do Relatório:</strong> [Inserir data atual]
              </div>
              <div className="col-span-2">
                <strong>Consultor Responsável:</strong> [Inserir nome do consultor]
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">APRESENTAÇÃO DO MÉTODO</h2>
              <p className="text-gray-700 leading-relaxed">
                A leitura facial simbólica é uma arte ancestral e uma ciência contemporânea, que busca decifrar, nas
                linhas e volumes do rosto, os mapas ocultos da personalidade e do destino. Cada feição, cada sombra,
                cada curva, revela não apenas traços herdados, mas também escolhas, experiências e modos de ser que se
                cristalizam na carne e no olhar. Quando aliada ao estudo dos temperamentos – colérico, melancólico,
                sanguíneo e fleumático –, essa leitura se torna uma bússola precisa para navegar os mares complexos do
                comportamento humano, especialmente no contexto corporativo, onde a performance, o relacionamento e a
                tomada de decisão são exigidos em sua máxima potência.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Neste relatório, a face de Dioni será interpretada como um território simbólico, onde o intelecto, as
                emoções e a ação se entrelaçam. O cruzamento entre as feições faciais e os resultados do questionário de
                temperamentos permitirá uma análise profunda de potencialidades, riscos e caminhos de desenvolvimento. O
                objetivo é oferecer um diagnóstico que vá além do visível, tocando as camadas mais sutis do ser, e
                propor recomendações que alinhem essência e função, desejo e realização, para que Dioni possa florescer
                em sua plenitude profissional.
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
                    A testa de Dioni, redonda e ampla, marcada por rugas finas de preocupação, é o palco onde o
                    pensamento se desenrola em silêncio. A amplitude dessa região sugere uma mente aberta, capaz de
                    abarcar múltiplas perspectivas e de se debruçar longamente sobre problemas complexos. As rugas
                    finas, como rios que escavam a terra, denunciam uma atividade mental constante, uma preocupação
                    genuína com o futuro, com a precisão e com a responsabilidade. O formato oval do rosto, somado ao
                    cabelo ralo e fino, reforça o temperamento melancólico: introspectivo, analítico, sensível ao
                    detalhe e ao significado oculto das coisas.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Neste terço, o potencial visível é o da inteligência estratégica, da capacidade de planejar a longo
                    prazo, de antecipar riscos e de construir soluções sólidas. O potencial oculto, porém, reside na
                    tendência à ruminação, à autocrítica e ao perfeccionismo, que podem paralisar a ação ou gerar
                    ansiedade silenciosa. O temperamento melancólico domina este espaço, trazendo consigo o dom da
                    análise profunda, mas também o risco do excesso de preocupação.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">TERÇO MÉDIO – EMOÇÕES E RELACIONAMENTO</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As sobrancelhas de Dioni, arredondadas, finas e levemente falhadas, dialogam com olhos retos, de
                    pálpebras pouco visíveis e rugas aparentes. Aqui, a expressão é de contenção e vigilância. As
                    sobrancelhas, com sua delicadeza e pequenas falhas, sugerem uma sensibilidade emocional que se
                    esconde sob a superfície, uma tendência a sentir profundamente, mas a expressar pouco. O olhar reto,
                    quase impenetrável, revela firmeza, foco e uma certa reserva, como se as emoções fossem
                    cuidadosamente filtradas antes de serem compartilhadas.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Neste terço, a mistura de temperamentos melancólico, fleumático e colérico cria um campo de tensão e
                    equilíbrio. O melancólico sente, o fleumático observa e acolhe, o colérico decide e age. O potencial
                    visível é o da empatia racional, da capacidade de ler o ambiente e as pessoas com precisão, sem se
                    deixar arrastar por impulsos. O potencial oculto é o da dificuldade em expressar vulnerabilidades, o
                    risco de isolamento emocional e a tendência a carregar o peso das decisões sozinho.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">TERÇO INFERIOR – AÇÃO E REALIZAÇÃO</h3>
                  <p className="text-gray-700 leading-relaxed">
                    O nariz reto, a boca reta e o queixo igualmente reto compõem um terço inferior marcado pela
                    assertividade e pela determinação. Aqui, o colérico se manifesta com clareza: há uma linha de força
                    que atravessa o centro do rosto, indicando capacidade de decisão, pragmatismo e foco em resultados.
                    O formato oval do rosto suaviza essa energia, evitando que ela se torne agressiva ou inflexível, mas
                    não elimina sua presença.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Neste terço, o potencial visível é o da ação rápida, da busca por soluções e da entrega de
                    resultados concretos. O potencial oculto é o da impaciência com processos lentos, a tendência a
                    exigir demais de si e dos outros, e o risco de desgaste físico e emocional por excesso de
                    responsabilidade. O colérico aqui é o motor, mas precisa ser temperado pela reflexão e pelo cuidado
                    consigo mesmo.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">A TRÍADE DOS TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                Dioni apresenta uma tríade composta por melancólico (dominante), colérico (secundário) e fleumático
                (complementar). Essa combinação é rara e poderosa, pois une a profundidade analítica do melancólico, a
                capacidade decisória do colérico e a estabilidade emocional do fleumático.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                No comportamento, essa tríade se manifesta como uma busca constante por excelência: Dioni não se
                contenta com o superficial, aprofunda-se nos detalhes, analisa cenários, mas, ao mesmo tempo, não hesita
                em agir quando a decisão é necessária. O fleumático, como base complementar, oferece a paciência e a
                diplomacia necessárias para lidar com equipes e conflitos, evitando explosões emocionais e promovendo um
                ambiente de respeito mútuo.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Nas relações, Dioni tende a ser reservado, seletivo em suas confidências, mas profundamente leal e
                comprometido com aqueles que conquista sua confiança. Na tomada de decisão, equilibra análise e ação,
                evitando impulsividade, mas também não se perdendo em indecisões. Na gestão de tarefas, é metódico,
                exigente e orientado a resultados, mas pode se frustrar com a lentidão ou a falta de comprometimento
                alheio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RESULTADO DO QUESTIONÁRIO DE TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                O questionário confirma a predominância melancólica, seguida pelo colérico e, por fim, o fleumático.
                Essa autoimagem está em consonância com a expressão facial: a testa ampla e preocupada, as sobrancelhas
                delicadas, o olhar atento e os traços retos do terço inferior. Há uma convergência clara entre o que
                Dioni percebe de si e o que seu rosto revela ao mundo.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                No entanto, a presença do fleumático, mais sutil, pode ser subestimada por Dioni. Esse temperamento,
                embora menos evidente, é fundamental para o equilíbrio emocional e para a construção de relações
                estáveis. A incongruência possível reside na tendência de Dioni a valorizar mais a análise e a ação do
                que o acolhimento e a escuta, o que pode limitar seu potencial de liderança empática.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">PERFIL DE POTENCIAL PROFISSIONAL</h2>
              <p className="text-gray-700 leading-relaxed">
                Como Diretor de Engenharia, Dioni encontra um terreno fértil para expressar seus talentos. O
                temperamento melancólico o torna um estrategista nato, capaz de enxergar além do imediato, de planejar
                com rigor e de antecipar desafios. O colérico lhe dá a energia necessária para transformar planos em
                ação, para liderar equipes e para enfrentar situações de crise com firmeza. O fleumático, por sua vez,
                suaviza as arestas, permitindo que Dioni seja um líder respeitado, que inspira confiança e estabilidade.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Seus pontos fortes incluem a inteligência analítica, o perfeccionismo construtivo, a capacidade de tomar
                decisões rápidas e eficazes, e o compromisso com resultados de alta qualidade. Seu estilo de liderança é
                exigente, mas justo; seu perfil comunicacional é direto, porém respeitoso; sua tendência sob pressão é a
                de assumir responsabilidades, buscar soluções e proteger sua equipe, mesmo à custa de seu próprio
                bem-estar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">MAPA DE RISCOS PSICOSSOCIAIS</h2>
              <p className="text-gray-700 leading-relaxed">
                O principal ponto de tensão para Dioni é o risco de burnout, decorrente do excesso de autoexigência e da
                dificuldade em delegar tarefas. O perfeccionismo melancólico, aliado à urgência colérica, pode levá-lo a
                carregar mais peso do que deveria, negligenciando o autocuidado e a vida pessoal. A rigidez emocional,
                fruto da contenção fleumática e da reserva melancólica, pode dificultar a expressão de vulnerabilidades
                e a busca por apoio.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Há também o risco de isolamento, tanto emocional quanto relacional, especialmente em ambientes de alta
                pressão. A tendência a internalizar preocupações e a evitar conflitos abertos pode gerar acúmulo de
                tensões, afetando a saúde física e mental. Por fim, a impaciência com processos lentos ou com pessoas
                menos comprometidas pode gerar frustrações e rupturas desnecessárias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RECOMENDAÇÕES DE PERFORMANCE</h2>
              <p className="text-gray-700 leading-relaxed">
                Para ativar o dominante melancólico, Dioni deve buscar ambientes que valorizem a análise profunda, a
                inovação e a excelência técnica. É importante reservar tempo para reflexão estratégica, sem se perder em
                detalhes paralisantes.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Para canalizar o colérico secundário, recomenda-se direcionar a energia para projetos de alto impacto,
                onde a tomada de decisão rápida e a busca por resultados sejam valorizadas. É fundamental, porém, evitar
                o excesso de controle e aprender a delegar, confiando na equipe.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Para equilibrar o fleumático complementar, Dioni deve investir em práticas de escuta ativa, empatia e
                construção de relações de confiança. Participar de grupos de discussão, mentorias ou atividades
                colaborativas pode fortalecer essa dimensão.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Na comunicação com a liderança e a equipe, é recomendável adotar uma postura transparente, mas
                acolhedora, explicando não apenas o "o quê" e o "como", mas também o "porquê" das decisões. O
                alinhamento vocacional pode ser reforçado por projetos que unam análise, inovação e impacto social, ou,
                se necessário, por um reposicionamento estratégico para funções de consultoria, mentoria ou
                desenvolvimento de talentos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                PLANO DE DESENVOLVIMENTO INDIVIDUAL – PDI (90 DIAS)
              </h2>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Metas comportamentais específicas:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Praticar a delegação consciente, escolhendo ao menos dois projetos para compartilhar
                    responsabilidades com membros da equipe.
                  </li>
                  <li>
                    Implementar uma rotina semanal de autocuidado, incluindo momentos de pausa, reflexão e atividades
                    não relacionadas ao trabalho.
                  </li>
                  <li>
                    Participar de pelo menos um grupo de discussão ou mentoria, visando fortalecer habilidades de escuta
                    e empatia.
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">KPIs sugeridos:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Redução do tempo médio dedicado a tarefas operacionais em 20%.</li>
                  <li>Aumento do índice de satisfação da equipe (medido por feedbacks anônimos) em pelo menos 15%.</li>
                  <li>Registro semanal de práticas de autocuidado e reflexão.</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">Recurso externo recomendado:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Mentoria com líder sênior em gestão de pessoas.</li>
                  <li>Leitura do livro "Inteligência Emocional", de Daniel Goleman.</li>
                  <li>Participação em workshop de comunicação não violenta.</li>
                </ul>

                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 font-semibold">Frase de ação para ancorar o PDI:</p>
                  <p className="text-blue-700 italic">
                    "Equilibrar profundidade e ação, cuidando de si para cuidar do todo."
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">ENCERRAMENTO E FRASE DE ESSÊNCIA</h2>
              <p className="text-gray-700 leading-relaxed">
                Dioni, tua face é um mapa de profundezas e altitudes, onde o pensamento se faz rio, a emoção se faz
                lago, e a ação, correnteza. Em ti, a busca pela excelência é uma travessia silenciosa, feita de
                perguntas sem pressa e respostas que amadurecem no tempo certo. Que tua jornada siga sendo a de quem
                constrói pontes entre o rigor e o cuidado, entre o detalhe e o todo, entre o silêncio e a palavra.
              </p>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-semibold mb-2">Frase de identidade interpretada poeticamente:</p>
                <p className="text-blue-700 italic text-lg">
                  "Sou aquele que constrói com precisão e cuida com profundidade; onde há desafio, vejo oportunidade de
                  criar sentido e legado."
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mt-6">
                Que este relatório seja bússola e espelho, para que tua essência floresça em cada decisão, em cada
                relação, em cada conquista.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
