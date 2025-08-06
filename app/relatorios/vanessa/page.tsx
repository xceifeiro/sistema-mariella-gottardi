export default function VanessaReport() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Relatório de Análise Facial e Temperamentos</h1>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Nome:</strong> Vanessa
              </div>
              <div>
                <strong>Cargo:</strong> Gerente de Suprimentos
              </div>
              <div>
                <strong>Setor:</strong> Suprimentos
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
                A leitura facial simbólica, aliada à análise dos temperamentos humanos, revela-se como uma ponte entre o
                visível e o invisível no universo corporativo. Cada feição, cada traço, carrega em si a memória de
                experiências, a marca de escolhas e a semente de potenciais ainda não plenamente manifestos. No ambiente
                de trabalho, onde a performance se entrelaça com a subjetividade, compreender a linguagem silenciosa do
                rosto e a dinâmica dos temperamentos é abrir espaço para uma gestão mais sensível, estratégica e humana.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                O método aqui empregado parte da premissa de que o rosto é um mapa simbólico: o terço superior revela a
                arquitetura do pensamento, o médio expressa o mundo emocional e o inferior traduz a potência da ação. Ao
                cruzar essas leituras com o diagnóstico temperamental – fleumático, colérico, melancólico e sanguíneo –,
                é possível decifrar não apenas o que se mostra, mas também o que se oculta sob a superfície do
                comportamento. Este relatório propõe-se, assim, a ser um espelho terapêutico e estratégico, iluminando
                caminhos para o desenvolvimento integral de Vanessa enquanto líder e gestora.
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
                    A testa de Vanessa, ampla e redonda, é o palco onde se desenrola o espetáculo do pensamento
                    fleumático. A amplitude sugere uma mente aberta, capaz de abarcar múltiplas perspectivas sem se
                    perder em julgamentos precipitados. O formato arredondado, por sua vez, indica flexibilidade
                    cognitiva, uma disposição para ponderar antes de agir, e uma inclinação natural para a diplomacia. O
                    cabelo fino, com fios brancos, acrescenta uma nota melancólica e fleumática, sinalizando maturidade,
                    discrição e uma sabedoria que se constrói no silêncio da observação.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Neste terço, o potencial visível é a racionalidade serena, a capacidade de analisar cenários
                    complexos sem se deixar arrastar por impulsos. O potencial oculto reside na possibilidade de
                    aprofundar ainda mais a visão estratégica, tornando-se uma referência em planejamento e antecipação
                    de riscos. O temperamento fleumático predomina, oferecendo estabilidade e constância, enquanto a
                    nuance melancólica dos cabelos sugere uma sensibilidade analítica que pode ser ativada em momentos
                    de decisão crítica.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">TERÇO MÉDIO – EMOÇÕES E RELACIONAMENTOS</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As sobrancelhas falhadas e retas, combinadas com olhos de pálpebras pouco aparentes e caídas,
                    desenham um retrato emocional de contenção e pragmatismo. Aqui, o fleumático e o colérico se
                    entrelaçam: a sobrancelha reta aponta para uma objetividade quase imperturbável, enquanto as falhas
                    sugerem momentos de hesitação ou retraimento emocional. Os olhos, marcados por rugas e uma expressão
                    reta, revelam uma alma que já testemunhou desafios, mas que aprendeu a filtrar emoções para não
                    comprometer a clareza das decisões.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    O potencial visível neste terço é a capacidade de manter o equilíbrio emocional mesmo sob pressão,
                    sendo um porto seguro para a equipe em tempos de crise. O potencial oculto, porém, é a necessidade
                    de cultivar empatia e calor nas relações, permitindo que a conexão humana se torne um diferencial na
                    negociação e na liderança. O temperamento colérico emerge nos olhos e sobrancelhas, trazendo
                    assertividade e foco, enquanto o fleumático oferece a base para uma escuta ativa e ponderada.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">
                    TERÇO INFERIOR – AÇÃO, EXECUÇÃO E POTÊNCIA
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    O nariz reto, a boca reta, o queixo arredondado e os dentes quadrados compõem um terço inferior de
                    força contida e pragmatismo. O nariz e a boca, ambos retos e associados ao temperamento colérico,
                    indicam uma abordagem direta, sem rodeios, voltada para resultados concretos. O queixo arredondado e
                    os dentes quadrados, de natureza fleumática, suavizam essa energia, trazendo resiliência, paciência
                    e uma capacidade de sustentar processos de longo prazo.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    O potencial visível é a habilidade de executar com precisão, administrar recursos e pessoas com
                    equilíbrio e frieza, e negociar de forma racional. O potencial oculto está na possibilidade de
                    desenvolver uma comunicação mais calorosa, capaz de inspirar e engajar a equipe para além dos
                    resultados imediatos. O colérico impulsiona a ação, enquanto o fleumático garante a sustentabilidade
                    e a constância das entregas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">A TRÍADE DOS TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                Vanessa manifesta uma tríade temperamental composta pelo fleumático como dominante, o colérico como
                secundário e nuances melancólicas como complemento sutil. Essa combinação se expressa de maneira
                singular em seu comportamento profissional.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                O fleumático dominante confere-lhe uma postura de estabilidade, ponderação e racionalidade. Vanessa
                administra recursos e pessoas com uma calma estratégica, evitando decisões precipitadas e priorizando o
                equilíbrio. O colérico secundário emerge nos momentos em que é preciso tomar decisões rápidas, negociar
                com firmeza ou impor limites – aqui, ela revela uma face exigente, perfeccionista e orientada para
                resultados. O melancólico complementar, presente nos detalhes dos cabelos e olhos, oferece um olhar
                crítico, atento aos riscos e às oportunidades de melhoria.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Nas relações, essa tríade se traduz em uma liderança que inspira confiança pela constância, mas que pode
                ser percebida como distante ou excessivamente racional. Na tomada de decisão, Vanessa equilibra análise
                fria com assertividade, raramente se deixando influenciar por emoções alheias. Na gestão de tarefas,
                prioriza a eficiência, a clareza de processos e a busca incessante por benefícios para a empresa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RESULTADO DO QUESTIONÁRIO DE TEMPERAMENTOS</h2>
              <p className="text-gray-700 leading-relaxed">
                O questionário confirma a predominância fleumática, seguida pelo colérico, em perfeita consonância com a
                leitura facial. A autoimagem de Vanessa, portanto, é coerente com sua expressão inconsciente: ela se
                percebe – e se apresenta – como alguém racional, estável e orientado para resultados. A convergência
                entre teste e face reforça a autenticidade de seu posicionamento profissional.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                No entanto, pequenas incongruências podem ser observadas nas nuances melancólicas dos cabelos e olhos,
                sugerindo que, em situações de maior pressão ou isolamento, Vanessa pode experimentar momentos de
                autocrítica ou retraimento emocional. Essas nuances, embora sutis, são preciosas para o autoconhecimento
                e o desenvolvimento de estratégias de autocuidado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">PERFIL DE POTENCIAL PROFISSIONAL</h2>
              <p className="text-gray-700 leading-relaxed">
                No cargo de Gerente de Suprimentos, Vanessa encontra terreno fértil para manifestar seus principais
                talentos. Sua racionalidade fleumática a torna exímia administradora de recursos, capaz de analisar
                cenários com frieza e negociar com equilíbrio. O colérico secundário confere-lhe assertividade e foco em
                resultados, tornando-a exigente e perfeccionista – qualidades essenciais para garantir benefícios à
                empresa.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Seu estilo de liderança é pautado pela objetividade e pela busca de eficiência. Vanessa comunica-se de
                forma direta, sem rodeios, priorizando a clareza e a precisão. Sob pressão, tende a manter a calma, mas
                pode tornar-se excessivamente rígida ou distante, dificultando a conexão emocional com a equipe e
                fornecedores. Sua tendência à análise fria é um trunfo em negociações, mas pode limitar a empatia e a
                flexibilidade em situações que exigem adaptação relacional.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">MAPA DE RISCOS PSICOSSOCIAIS</h2>
              <p className="text-gray-700 leading-relaxed">
                A constância fleumática de Vanessa é um escudo contra o caos, mas pode se transformar em rigidez
                emocional se não houver espaço para a expressão afetiva. O risco de burnout é moderado, manifestando-se
                principalmente pela sobrecarga de responsabilidades e pela autoexigência colérica. A fuga emocional pode
                ocorrer quando se sente incompreendida ou pressionada a adotar posturas excessivamente empáticas, o que
                não lhe é natural.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                A rigidez emocional é o principal ponto de atenção: Vanessa pode, por vezes, fechar-se em sua
                racionalidade, tornando-se inacessível para a equipe. A autoexigência, alimentada pelo perfeccionismo
                colérico, pode levá-la a assumir mais responsabilidades do que seria saudável, comprometendo o
                equilíbrio entre vida pessoal e profissional. A apatia, embora rara, pode surgir em ambientes onde não
                há desafios ou reconhecimento, levando à estagnação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">RECOMENDAÇÕES DE PERFORMANCE</h2>
              <p className="text-gray-700 leading-relaxed">
                Para ativar o dominante fleumático, Vanessa deve continuar investindo em processos de análise e
                planejamento, tornando-se referência em gestão estratégica de suprimentos. Para canalizar o colérico
                secundário, é recomendável buscar desafios que exijam decisões rápidas e negociações complexas, sem
                perder de vista o equilíbrio emocional.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                O complementar melancólico pode ser equilibrado por meio de práticas de autocuidado e espaços de
                reflexão, evitando a autocrítica excessiva. Na comunicação com a liderança e a equipe, Vanessa deve
                exercitar a escuta empática e a expressão de reconhecimento, fortalecendo vínculos e inspirando
                confiança.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Sugere-se, ainda, o alinhamento vocacional com projetos que valorizem a racionalidade e a eficiência,
                mas que também permitam o desenvolvimento de habilidades relacionais. O reposicionamento estratégico
                pode incluir a participação em grupos de inovação ou comitês de negociação, onde sua visão analítica
                será diferencial.
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
                    Aprimorar o diálogo com fornecedores e equipe, buscando maior flexibilidade e empatia nas
                    negociações.
                  </li>
                  <li>
                    Desenvolver habilidades de comunicação assertiva e calorosa, promovendo um ambiente de confiança e
                    colaboração.
                  </li>
                  <li>
                    Praticar o autocuidado emocional, reservando momentos semanais para reflexão e feedback construtivo.
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">KPIs sugeridos:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Aumento do índice de satisfação da equipe (medido por pesquisa interna).</li>
                  <li>Redução do tempo médio de negociação com fornecedores.</li>
                  <li>Frequência de feedbacks positivos recebidos em reuniões.</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-800 mb-3 mt-6">Recurso externo recomendado:</h3>
                <p className="text-gray-700">Mentoria em comunicação interpessoal ou curso de negociação humanizada.</p>

                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 font-semibold">Frase de ação para ancorar o PDI:</p>
                  <p className="text-blue-700 italic">
                    "Equilíbrio é a ponte entre a razão e o coração; ao atravessá-la, multiplico resultados e conexões."
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">ENCERRAMENTO E FRASE DE ESSÊNCIA</h2>
              <p className="text-gray-700 leading-relaxed">
                Vanessa, tua essência é como um lago sereno: profundo, estável, mas capaz de refletir o céu em todas as
                suas nuances. Em ti, a racionalidade fleumática encontra o impulso colérico e a sensibilidade
                melancólica, compondo uma liderança que inspira confiança e respeito. Que tua jornada siga sendo o
                espelho onde a razão e o sentir se encontram, multiplicando benefícios não apenas para a empresa, mas
                para todos que contigo navegam.
              </p>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 font-semibold mb-2">Frase de identidade interpretada poeticamente:</p>
                <p className="text-blue-700 italic text-lg">
                  "Sou o equilíbrio entre a calma das águas e a força do vento: administro, conecto, transformo."
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
