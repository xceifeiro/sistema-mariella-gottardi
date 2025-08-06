import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, Share2 } from "lucide-react"

export default function RelatorioExemplo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-white">Exemplo de Relatório</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: `
                <style>
                  .analysis-container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                  }
                  
                  .analysis-title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    text-align: center;
                  }
                  
                  .intro-text {
                    font-size: 1.1rem;
                    line-height: 1.7;
                    margin-bottom: 1.5rem;
                    color: #374151;
                  }
                  
                  .analysis-list {
                    list-style: none;
                    padding: 0;
                    margin: 1rem 0;
                  }
                  
                  .analysis-list li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e5e7eb;
                  }
                  
                  .analysis-list li:last-child {
                    border-bottom: none;
                  }
                  
                  .section-title {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #1f2937;
                    margin: 2rem 0 1rem 0;
                    padding-bottom: 0.5rem;
                    border-bottom: 3px solid #667eea;
                  }
                  
                  .feature-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #374151;
                    margin: 1.5rem 0 0.5rem 0;
                  }
                  
                  .muted-text {
                    font-size: 0.9rem;
                    color: #6b7280;
                    font-style: italic;
                    margin: 0.5rem 0;
                  }
                  
                  .temperament-melancholic {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: inline-block;
                    margin: 0.5rem 0;
                  }
                  
                  .temperament-choleric {
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: inline-block;
                    margin: 0.5rem 0;
                  }
                  
                  .temperament-phlegmatic {
                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: inline-block;
                    margin: 0.5rem 0;
                  }
                  
                  .synthesis-card {
                    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                    padding: 2rem;
                    border-radius: 12px;
                    margin: 2rem 0;
                    border-left: 5px solid #f59e0b;
                  }
                  
                  .info-title {
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: #92400e;
                    margin-bottom: 1rem;
                  }
                  
                  .analysis-text {
                    font-size: 1.1rem;
                    line-height: 1.7;
                    color: #374151;
                    margin-bottom: 1.5rem;
                  }
                  
                  .temperament-grid {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                  }
                  
                  .two-column-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin: 2rem 0;
                  }
                  
                  @media (max-width: 768px) {
                    .two-column-grid {
                      grid-template-columns: 1fr;
                    }
                  }
                  
                  .positive-card {
                    background: linear-gradient(135deg, #d4edda, #c3e6cb);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border-left: 5px solid #28a745;
                  }
                  
                  .positive-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: #155724;
                    margin-bottom: 1rem;
                  }
                  
                  .attention-card {
                    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border-left: 5px solid #dc3545;
                  }
                  
                  .warning-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: #721c24;
                    margin-bottom: 1rem;
                  }
                  
                  .identity-phrase {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    margin: 2rem 0;
                  }
                  
                  .attention-title {
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                  }
                </style>
                
                <div class="analysis-container">
                  <h1 class="analysis-title">Relatório de Potencial e Temperamento – Alex</h1>
                  <p class="intro-text">Este relatório foi gerado com base na leitura facial simbólica, cruzamento de dados do teste de temperamento e análise do contexto profissional do colaborador.</p>
                  <ul class="analysis-list">
                    <li><strong>Nome:</strong> Alex</li>
                    <li><strong>Cargo / Setor:</strong> [Preencher com cargo atual] – [Preencher com departamento]</li>
                    <li><strong>Data do Relatório:</strong> 22 de Julho de 2025</li>
                    <li><strong>Consultor Responsável:</strong> [Nome do Especialista]</li>
                  </ul>
                </div>

                <!-- TERÇO SUPERIOR -->
                <h2 class="section-title">Terço Superior – Intelecto e Estratégia Cognitiva</h2>
                <p class="intro-text">O terço superior do rosto de Alex revela nuances profundas de sua dinâmica cognitiva e capacidade estratégica. A testa apresenta ondulações no limite do couro cabeludo, com formato predominantemente reto, sugerindo uma mente estruturada, analítica e voltada para a busca de padrões e coerência. A presença de linhas retas e ondulações indica uma combinação de racionalidade (Colérico) e sensibilidade reflexiva (Melancólico), favorecendo o planejamento minucioso e a antecipação de cenários. As sobrancelhas retas, cheias e levemente descendentes reforçam a tendência à concentração, ao foco e à avaliação crítica dos detalhes, denotando um temperamento exigente, perfeccionista e atento às minúcias do ambiente.</p>

                <h3 class="feature-title">Testa Alta e Larga</h3>
                <p class="intro-text">A testa de Alex, com ondulações e linhas retas, evidencia uma capacidade de reflexão profunda, planejamento estratégico e busca constante por aprimoramento intelectual. A predominância melancólica se manifesta na inclinação à análise detalhada e ao pensamento crítico, enquanto o traço colérico impulsiona a ação e a assertividade nas decisões.</p>
                <p class="muted-text">Justificativa visual: proporção da testa, ondulações no limite do couro cabeludo, linhas de expressão horizontais e formato geral reto.</p>
                <span class="temperament-melancholic">Temperamento associado: Melancólico / Colérico</span>

                <!-- TERÇO MÉDIO -->
                <h2 class="section-title">Terço Médio – Comunicação, Relações e Expressividade</h2>
                <p class="intro-text">O terço médio do rosto de Alex, composto por sobrancelhas, olhos e nariz, revela uma complexa interação entre assertividade, sensibilidade e contenção emocional. As sobrancelhas retas e cheias (Colérico) indicam força de vontade, clareza de propósito e tendência à liderança direta, enquanto a leve descendência (Melancólico) sugere uma propensão à introspecção e ao perfeccionismo. Os olhos retos, com pálpebras caídas e pouco presentes, expressam uma mescla de objetividade (Colérico), profundidade emocional (Melancólico) e certa reserva afetiva (Fleumático). O nariz reto, de traço colérico, reforça a assertividade, a busca por resultados e a disposição para enfrentar desafios com determinação.</p>

                <h3 class="feature-title">Sobrancelhas Retas e Cheias / Descendentes</h3>
                <p class="intro-text">As sobrancelhas de Alex demonstram um equilíbrio entre força e sensibilidade. A linha reta e cheia sugere iniciativa, foco e capacidade de decisão, enquanto a inclinação descendente revela uma preocupação com o impacto das ações e uma tendência à autocrítica.</p>
                <p class="muted-text">Justificativa visual: densidade das sobrancelhas, direção do crescimento e inclinação em relação ao eixo dos olhos.</p>
                <span class="temperament-choleric">Temperamento associado: Colérico / Melancólico</span>

                <h3 class="feature-title">Olhos Retos / Pálpebra Caída Descendente / Pálpebra Pouco Presente</h3>
                <p class="intro-text">Os olhos de Alex transmitem uma energia de observação atenta, introspecção e contenção emocional. O olhar reto e firme (Colérico) revela determinação, enquanto a pálpebra caída e pouco presente (Melancólico/Fleumático) indica uma tendência à reserva, à cautela e à análise silenciosa do ambiente.</p>
                <p class="muted-text">Justificativa visual: formato dos olhos, presença e posicionamento das pálpebras, direção do olhar.</p>
                <span class="temperament-choleric">Temperamento associado: Colérico / Melancólico / Fleumático</span>

                <h3 class="feature-title">Nariz Reto</h3>
                <p class="intro-text">O nariz reto de Alex é um traço marcante de assertividade, objetividade e busca por resultados concretos. Este elemento colérico reforça a disposição para enfrentar desafios e liderar processos com clareza e foco.</p>
                <p class="muted-text">Justificativa visual: linha do dorso nasal, ausência de curvaturas e simetria.</p>
                <span class="temperament-choleric">Temperamento associado: Colérico</span>

                <!-- TERÇO INFERIOR -->
                <h2 class="section-title">Terço Inferior – Instinto, Emoção e Autogestão</h2>
                <p class="intro-text">O terço inferior do rosto de Alex, composto por boca, queixo e estrutura dentária, revela a dinâmica emocional, a capacidade de autogestão e a forma como lida com impulsos e afetos. A boca curvada (Melancólica/Fleumática) expressa sensibilidade, empatia e tendência à introspecção afetiva. O queixo arredondado e reto, sem proeminência, indica uma postura mais receptiva, ponderada e resiliente diante de adversidades, com predominância de traços melancólicos e fleumáticos. Os dentes centrais (Colérico) e laterais/caninos (Melancólicos) sugerem uma combinação de assertividade e perfeccionismo, com exigência interna elevada e busca constante por alinhamento entre valores e ações.</p>

                <h3 class="feature-title">Boca Curvada</h3>
                <p class="intro-text">A boca de Alex, com curvatura sutil, revela uma natureza sensível, empática e propensa à escuta. O traço melancólico/fleumático se manifesta na tendência à ponderação e ao cuidado nas palavras, evitando confrontos desnecessários e buscando harmonia nas relações.</p>
                <p class="muted-text">Justificativa visual: formato dos lábios, curvatura e expressão em repouso.</p>
                <span class="temperament-melancholic">Temperamento associado: Melancólico / Fleumático</span>

                <h3 class="feature-title">Queixo Arredondado / Reto sem Proeminência</h3>
                <p class="intro-text">O queixo de Alex, arredondado e sem proeminência, indica uma postura de resiliência silenciosa, flexibilidade emocional e capacidade de adaptação. O traço melancólico/fleumático sugere uma força interna voltada para o autocontrole e a busca por estabilidade.</p>
                <p class="muted-text">Justificativa visual: formato do queixo, projeção e relação com a mandíbula.</p>
                <span class="temperament-melancholic">Temperamento associado: Melancólico / Fleumático</span>

                <h3 class="feature-title">Dentes Centrais, Laterais e Caninos</h3>
                <p class="intro-text">A estrutura dentária de Alex reforça a tríade de temperamentos predominantes. Os dentes centrais (Colérico) apontam para assertividade e busca de protagonismo, enquanto os laterais e caninos (Melancólicos) indicam perfeccionismo, exigência e senso crítico apurado.</p>
                <p class="muted-text">Justificativa visual: alinhamento, formato e proporção dos dentes frontais.</p>
                <span class="temperament-choleric">Temperamento associado: Colérico / Melancólico</span>

                <div class="synthesis-card">
                  <p class="info-title">Síntese da Leitura Facial:</p>
                  <p class="analysis-text">A análise integrada do rosto de Alex revela uma personalidade marcada pela busca de excelência, perfeccionismo e exigência interna. A tríade Melancólico, Colérico e Fleumático se manifesta em uma postura crítica, detalhista e resiliente, com alta capacidade de análise e execução. Os desafios residem na tendência à autocrítica excessiva, rigidez diante de falhas e dificuldade em flexibilizar padrões diante de situações ambíguas. O potencial de Alex está na combinação entre sensibilidade, assertividade e resiliência, tornando-o apto a liderar processos complexos, analisar riscos e promover melhorias contínuas, desde que aprenda a equilibrar exigência com autocompaixão e flexibilidade emocional.</p>
                  <div class="temperament-grid">
                    <span class="temperament-melancholic">Melancólico</span>
                    <span class="temperament-choleric">Colérico</span>
                    <span class="temperament-phlegmatic">Fleumático</span>
                  </div>
                </div>

                <!-- RESULTADO DO QUESTIONÁRIO DE TEMPERAMENTOS -->
                <h2 class="section-title">Validação Cruzada – Temperamento Testado vs. Facial</h2>
                <p class="analysis-text">O cruzamento entre os resultados do teste de temperamentos e a leitura facial simbólica de Alex aponta para uma forte congruência entre autoimagem e expressão inconsciente. O perfil Melancólico-Colérico é dominante, tanto na percepção interna quanto nas feições externas, reforçando a consistência entre o que Alex acredita ser e o que comunica ao mundo. Há, contudo, nuances fleumáticas que podem ser subestimadas em situações de pressão, levando à sobrecarga emocional e à tendência ao isolamento produtivo. A exigência e o perfeccionismo, evidenciados na tríade facial, são confirmados pelo teste, sugerindo a necessidade de estratégias de autogestão para evitar rigidez excessiva e promover maior adaptabilidade.</p>
                <ul class="analysis-list">
                  <li>Autoimagem fortemente alinhada ao perfil Melancólico-Colérico, com traços Fleumáticos subjacentes.</li>
                  <li>Congruência entre assertividade, perfeccionismo e sensibilidade, mas risco de autocrítica exacerbada.</li>
                  <li>Potencial para liderança técnica, análise de processos e gestão de riscos, desde que haja equilíbrio emocional.</li>
                </ul>

                <!-- MAPA DE POTENCIAIS E RISCOS PSICOSSOCIAIS -->
                <h2 class="section-title">Mapa de Potenciais e Riscos Psicossociais</h2>
                <div class="two-column-grid">
                  <div class="positive-card">
                    <p class="positive-title">Potenciais no Cargo Atual</p>
                    <ul class="analysis-list">
                      <li>Alta resiliência emocional em situações de conflito e pressão.</li>
                      <li>Capacidade analítica e crítica acima da média (perfil Melancólico-Colérico).</li>
                      <li>Foco em excelência, detalhamento e busca por soluções inovadoras.</li>
                      <li>Habilidade para liderar projetos complexos e promover melhorias contínuas.</li>
                      <li>Facilidade em identificar riscos e propor estratégias preventivas.</li>
                    </ul>
                  </div>
                  <div class="attention-card">
                    <p class="warning-title">Riscos Psicossociais</p>
                    <ul class="analysis-list">
                      <li>Tendência à rigidez e sobrecarga cognitiva diante de padrões elevados de exigência.</li>
                      <li>Autocrítica exacerbada, levando à procrastinação ou paralisia diante de erros.</li>
                      <li>Desconexão emocional com a equipe, gerando isolamento produtivo e dificuldade de delegar.</li>
                      <li>Risco de esgotamento emocional em ambientes de alta pressão sem pausas estruturadas.</li>
                      <li>Dificuldade em flexibilizar expectativas e adaptar-se a mudanças inesperadas.</li>
                    </ul>
                  </div>
                </div>
                <p class="muted-text">Avaliação de compatibilidade entre temperamento e função atual realizada com base em expressões inconscientes, desempenho observado e potencial de desenvolvimento.</p>

                <!-- RECOMENDAÇÕES DE PERFORMANCE E GESTÃO EMOCIONAL -->
                <h2 class="section-title">Recomendações para Alta Performance</h2>
                <ul class="analysis-list">
                  <li>Ativar o temperamento colérico de forma construtiva, estabelecendo metas claras, prazos definidos e feedbacks constantes para sustentar o senso de progresso.</li>
                  <li>Utilizar o lado melancólico para análises de risco, estruturação de processos e aprimoramento contínuo, evitando a armadilha da autocrítica paralisante.</li>
                  <li>Praticar a autocompaixão e a flexibilidade emocional, reconhecendo limites e celebrando pequenas conquistas.</li>
                  <li>Evitar funções que demandem sobreposição emocional prolongada (como atendimento contínuo ou mediações intensas), priorizando atividades de análise, planejamento e execução técnica.</li>
                  <li>Buscar espaços de escuta ativa e troca com a equipe, promovendo integração e evitando o isolamento produtivo.</li>
                  <li>Desenvolver habilidades de comunicação assertiva, equilibrando clareza com empatia e abertura ao diálogo.</li>
                </ul>
                <p class="intro-text">Sugere-se que Alex alinhe sua comunicação e posicionamento frente à liderança e equipe direta, valorizando o equilíbrio entre exigência e colaboração. O reconhecimento dos próprios limites e a busca por apoio em momentos críticos são essenciais para sustentar a alta performance sem sacrificar o bem-estar emocional.</p>

                <!-- PDI – PLANO DE DESENVOLVIMENTO INDIVIDUAL (90 DIAS) -->
                <h2 class="section-title">Plano de Desenvolvimento Individual</h2>
                <ul class="analysis-list">
                  <li><strong>Meta 1:</strong> Melhorar assertividade comunicacional em reuniões, praticando exposição clara de ideias e ouvindo ativamente as contribuições do grupo.</li>
                  <li><strong>Meta 2:</strong> Reduzir o tempo de ruminância mental, utilizando técnicas de mindfulness e registro de pensamentos para promover maior objetividade.</li>
                  <li><strong>Meta 3:</strong> Praticar escuta ativa com feedback não violento, buscando compreender as necessidades do outro antes de responder.</li>
                  <li><strong>Meta 4:</strong> Implementar pausas estruturadas ao longo do dia para evitar sobrecarga e promover recuperação emocional.</li>
                  <li><strong>Meta 5:</strong> Participar de grupos de discussão ou mentorias para ampliar repertório e flexibilizar padrões de exigência.</li>
                </ul>
                <p class="muted-text">Indicadores sugeridos: relatórios semanais de desempenho, autoavaliação emocional, supervisão da liderança direta, feedbacks qualitativos da equipe e monitoramento do nível de satisfação pessoal.</p>

                <div class="identity-phrase">
                  <p class="attention-title">Frase de ação:</p>
                  <p class="intro-text">"Sua clareza é ponte entre o caos e o caminho."</p>
                </div>

                <h2 class="section-title">Conclusão</h2>
                <p class="intro-text">A análise facial simbólica, aliada ao teste de temperamentos e ao contexto profissional, revela em Alex um potencial singular para a excelência, a liderança e a inovação. O equilíbrio entre exigência e flexibilidade, ação e reflexão, é o caminho para sustentar a alta performance, promover o bem-estar e contribuir de forma significativa para o sucesso da equipe e da organização.</p>
                <p class="intro-text">Que este relatório sirva como guia para o autoconhecimento, o desenvolvimento contínuo e a realização plena de seu potencial.</p>

                <div class="identity-phrase">
                  <p class="attention-title">Frase de ação:</p>
                  <p class="intro-text">"Sua clareza é ponte entre o caos e o caminho."</p>
                </div>
                `,
              }}
            />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Quer seu próprio relatório personalizado?</h2>
              <p className="text-purple-100 mb-6">
                Crie sua conta gratuita e descubra seu verdadeiro potencial através da nossa análise completa de
                temperamento e leitura facial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                    Criar Conta Gratuita
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 bg-transparent"
                  >
                    Já tenho conta
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
