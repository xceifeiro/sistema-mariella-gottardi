"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, Brain, TrendingUp, Award, Users, Target, Lightbulb, Sparkles, Star } from "lucide-react"
import { useState } from "react"

interface TemperamentScores {
  sanguineo: number
  colerico: number
  melancolico: number
  fleumatico: number
}

interface TemperamentResultProps {
  scores: TemperamentScores
  clienteNome: string
  dataRealizacao: string
}

const temperamentData = {
  sanguineo: {
    name: "Sanguíneo",
    color: "from-yellow-400 to-orange-500",
    bgColor: "glass-dark",
    textColor: "text-slate-100",
    borderColor: "border-white/20",
    description: "Comunicador nato, otimista e sociável",
    characteristics: ["Extrovertido", "Otimista", "Comunicativo", "Espontâneo", "Entusiasta"],
    strengths: ["Excelente comunicação", "Motivador natural", "Adaptável", "Criativo", "Carismático"],
    challenges: ["Pode ser desorganizado", "Dificuldade com detalhes", "Impulsivo", "Busca aprovação"],
    icon: <Users className="w-6 h-6" />,
  },
  colerico: {
    name: "Colérico",
    color: "from-red-500 to-pink-600",
    bgColor: "glass-dark",
    textColor: "text-slate-100",
    borderColor: "border-white/20",
    description: "Líder natural, determinado e orientado a resultados",
    characteristics: ["Determinado", "Líder", "Competitivo", "Direto", "Ambicioso"],
    strengths: ["Liderança natural", "Orientado a resultados", "Decisivo", "Eficiente", "Corajoso"],
    challenges: ["Pode ser impaciente", "Dominador", "Pouco empático", "Workaholic"],
    icon: <Target className="w-6 h-6" />,
  },
  melancolico: {
    name: "Melancólico",
    color: "from-blue-500 to-purple-600",
    bgColor: "glass-dark",
    textColor: "text-slate-100",
    borderColor: "border-white/20",
    description: "Analítico, perfeccionista e detalhista",
    characteristics: ["Analítico", "Perfeccionista", "Detalhista", "Sensível", "Criativo"],
    strengths: ["Atenção aos detalhes", "Qualidade superior", "Planejamento", "Lealdade", "Profundidade"],
    challenges: ["Tendência ao pessimismo", "Autocrítico", "Moody", "Procrastinação"],
    icon: <Brain className="w-6 h-6" />,
  },
  fleumatico: {
    name: "Fleumático",
    color: "from-green-500 to-teal-600",
    bgColor: "glass-dark",
    textColor: "text-slate-100",
    borderColor: "border-white/20",
    description: "Paciente, estável e diplomático",
    characteristics: ["Paciente", "Estável", "Diplomático", "Confiável", "Calmo"],
    strengths: ["Estabilidade emocional", "Mediador natural", "Confiável", "Paciente", "Leal"],
    challenges: ["Resistente a mudanças", "Pode ser passivo", "Evita conflitos", "Lento para decidir"],
    icon: <Award className="w-6 h-6" />,
  },
}

export default function TemperamentResultComponent({ scores, clienteNome, dataRealizacao }: TemperamentResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Calcular temperamento dominante
  const dominantTemperament = Object.entries(scores).reduce((a, b) =>
    scores[a[0] as keyof TemperamentScores] > scores[b[0] as keyof TemperamentScores] ? a : b,
  )[0] as keyof TemperamentScores

  const dominantData = temperamentData[dominantTemperament]
  const totalQuestions = Object.values(scores).reduce((sum, score) => sum + score, 0)

  // Calcular percentuais
  const percentages = Object.entries(scores)
    .map(([temp, score]) => ({
      temperament: temp as keyof TemperamentScores,
      score,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      // Importar jsPDF dinamicamente
      const { jsPDF } = await import("jspdf")

      // Criar novo documento PDF
      const doc = new jsPDF()

      // Configurações
      const pageWidth = doc.internal.pageSize.width
      const margin = 20
      let yPosition = margin

      // Função para adicionar texto com quebra de linha
      const addText = (text: string, x: number, y: number, options?: any) => {
        doc.text(text, x, y, options)
        return y + (options?.fontSize || 12) * 0.5
      }

      // Função para verificar se precisa de nova página
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > doc.internal.pageSize.height - margin) {
          doc.addPage()
          yPosition = margin
        }
      }

      // Header
      doc.setFontSize(24)
      doc.setTextColor(59, 130, 246) // Blue
      yPosition = addText("RELATÓRIO DE TEMPERAMENTOS", margin, yPosition)

      yPosition += 10

      // Informações do cliente
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      yPosition = addText(`Cliente: ${clienteNome}`, margin, yPosition)
      yPosition = addText(`Data de Realização: ${dataRealizacao}`, margin, yPosition)
      yPosition = addText(`Pedido: CRM 4 Temperamentos`, margin, yPosition)

      yPosition += 15

      // Temperamento Dominante
      checkNewPage(40)
      doc.setFontSize(18)
      doc.setTextColor(220, 38, 38) // Red
      yPosition = addText("TEMPERAMENTO DOMINANTE", margin, yPosition)

      yPosition += 5
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      yPosition = addText(`${dominantData.name} (${percentages[0].percentage}%)`, margin, yPosition)
      yPosition = addText(dominantData.description, margin, yPosition)

      yPosition += 10

      // Características Principais
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246)
      yPosition = addText("Características Principais:", margin, yPosition)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      dominantData.characteristics.forEach((char) => {
        checkNewPage(8)
        yPosition = addText(`• ${char}`, margin + 10, yPosition)
      })

      yPosition += 10

      // Pontos Fortes
      checkNewPage(30)
      doc.setFontSize(14)
      doc.setTextColor(34, 197, 94) // Green
      yPosition = addText("Pontos Fortes:", margin, yPosition)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      dominantData.strengths.forEach((strength) => {
        checkNewPage(8)
        yPosition = addText(`• ${strength}`, margin + 10, yPosition)
      })

      yPosition += 10

      // Áreas de Desenvolvimento
      checkNewPage(30)
      doc.setFontSize(14)
      doc.setTextColor(249, 115, 22) // Orange
      yPosition = addText("Áreas de Desenvolvimento:", margin, yPosition)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      dominantData.challenges.forEach((challenge) => {
        checkNewPage(8)
        yPosition = addText(`• ${challenge}`, margin + 10, yPosition)
      })

      yPosition += 15

      // Distribuição dos Temperamentos
      checkNewPage(60)
      doc.setFontSize(18)
      doc.setTextColor(59, 130, 246)
      yPosition = addText("DISTRIBUIÇÃO DOS TEMPERAMENTOS", margin, yPosition)

      yPosition += 10

      percentages.forEach(({ temperament, score, percentage }) => {
        checkNewPage(20)
        const tempData = temperamentData[temperament]

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        yPosition = addText(`${tempData.name}: ${percentage}% (${score} respostas)`, margin, yPosition)

        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        yPosition = addText(tempData.description, margin + 10, yPosition)

        yPosition += 5
      })

      yPosition += 15

      // Resumo Executivo
      checkNewPage(50)
      doc.setFontSize(18)
      doc.setTextColor(59, 130, 246)
      yPosition = addText("RESUMO EXECUTIVO", margin, yPosition)

      yPosition += 10
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      const resumoText = `Com base na análise do seu teste de temperamentos, identificamos que você possui um perfil ${dominantData.name} predominante (${percentages[0].percentage}% das respostas).`

      // Quebrar texto longo em linhas
      const lines = doc.splitTextToSize(resumoText, pageWidth - 2 * margin)
      lines.forEach((line: string) => {
        checkNewPage(8)
        yPosition = addText(line, margin, yPosition)
      })

      if (percentages[1].percentage > 20) {
        yPosition += 5
        const secondaryText = `Você também apresenta características significativas do temperamento ${temperamentData[percentages[1].temperament].name} (${percentages[1].percentage}%), o que indica um perfil equilibrado e versátil.`
        const secondaryLines = doc.splitTextToSize(secondaryText, pageWidth - 2 * margin)
        secondaryLines.forEach((line: string) => {
          checkNewPage(8)
          yPosition = addText(line, margin, yPosition)
        })
      }

      // Footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `CRM 4 Temperamentos - Relatório gerado em ${new Date().toLocaleDateString("pt-BR")}`,
          margin,
          doc.internal.pageSize.height - 10,
        )
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 30, doc.internal.pageSize.height - 10)
      }

      // Salvar o PDF
      doc.save(
        `Relatorio_Temperamentos_${clienteNome.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
      )
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resultado do Teste de Temperamentos - ${clienteNome}`,
          text: `Confira o resultado do teste de temperamentos. Temperamento dominante: ${dominantData.name} (${percentages[0].percentage}%)`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Compartilhamento cancelado")
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="min-h-screen floating-shapes p-4">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header do Relatório */}
        <div className={`relative overflow-hidden rounded-3xl glass-dark p-8 text-slate-100 shadow-2xl`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 glass-effect rounded-2xl flex items-center justify-center animate-float">
                    <Brain className="w-10 h-10 text-slate-100" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-1 drop-shadow-lg">Relatório de Temperamentos</h1>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <span className="text-lg">Análise Completa</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">{clienteNome}</p>
                  <p className="text-slate-200">Realizado em: {dataRealizacao}</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 glass-effect rounded-full flex items-center justify-center animate-float">
                  <Sparkles className="w-16 h-16 text-slate-100" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="glass-effect text-slate-100 border-white/30 hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? "Gerando PDF..." : "Download PDF"}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="glass-effect border-white/30 text-slate-100 hover:bg-white/20 bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* Temperamento Dominante */}
        <Card className={`${dominantData.bgColor} ${dominantData.borderColor} border-2 shadow-2xl card-hover`}>
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${dominantData.color} text-slate-100 p-4 rounded-2xl shadow-lg`}
                >
                  {dominantData.icon}
                </div>
                <div>
                  <CardTitle className={`text-3xl ${dominantData.textColor} mb-2`}>Temperamento Dominante</CardTitle>
                  <p className="text-xl font-bold text-slate-100">{dominantData.name}</p>
                  <p className="text-slate-200 mt-1">{dominantData.description}</p>
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`w-24 h-24 bg-gradient-to-r ${dominantData.color} text-slate-100 rounded-full flex items-center justify-center shadow-lg`}
                >
                  <span className="text-2xl font-bold">
                    {percentages.find((p) => p.temperament === dominantTemperament)?.percentage}%
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-2">Predominância</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4 flex items-center text-lg text-slate-100">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Características Principais
                </h4>
                <div className="space-y-2">
                  {dominantData.characteristics.map((char, index) => (
                    <Badge key={index} className="mr-2 mb-2 px-3 py-1 glass-effect border-slate-400/30 text-slate-200">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 flex items-center text-lg text-green-400">
                  <Award className="w-5 h-5 mr-2" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {dominantData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center text-slate-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 flex items-center text-lg text-orange-400">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Áreas de Desenvolvimento
                </h4>
                <ul className="space-y-2">
                  {dominantData.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-center text-slate-100">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      <span className="text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição dos Temperamentos */}
        <Card className="shadow-2xl card-hover glass-dark">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 text-slate-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-slate-100" />
              </div>
              Distribuição dos Temperamentos
            </CardTitle>
            <p className="text-slate-200">Análise detalhada das suas características comportamentais</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {percentages.map(({ temperament, score, percentage }) => {
                const tempData = temperamentData[temperament]
                return (
                  <div key={temperament} className={`glass-effect p-6 rounded-2xl border-2 border-white/20 card-hover`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-14 h-14 bg-gradient-to-r ${tempData.color} text-slate-100 p-3 rounded-xl shadow-lg`}
                        >
                          {tempData.icon}
                        </div>
                        <div>
                          <h3 className={`font-bold text-xl text-slate-100`}>{tempData.name}</h3>
                          <p className="text-sm text-slate-300">{score} respostas</p>
                        </div>
                      </div>
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${tempData.color} text-slate-100 rounded-full flex items-center justify-center shadow-lg`}
                      >
                        <span className="font-bold text-lg">{percentage}%</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                        <div
                          className={`bg-gradient-to-r ${tempData.color} h-4 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 mb-4 leading-relaxed">{tempData.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {tempData.characteristics.slice(0, 3).map((char, index) => (
                        <Badge key={index} className="text-xs glass-effect border-slate-400/30 text-slate-200">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <Card className="shadow-2xl card-hover glass-dark">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 text-slate-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-slate-100" />
              </div>
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="glass-effect p-6 rounded-xl border-2 border-white/20">
                <p className="text-slate-100 leading-relaxed text-lg mb-4">
                  Com base na análise do seu teste de temperamentos, identificamos que você possui um perfil
                  <strong className={`text-slate-100 text-xl`}> {dominantData.name}</strong> predominante (
                  <strong>{percentages[0].percentage}%</strong> das respostas).
                  {percentages[1].percentage > 20 && (
                    <>
                      {" "}
                      Você também apresenta características significativas do temperamento{" "}
                      <strong className="text-slate-100">{temperamentData[percentages[1].temperament].name}</strong> (
                      <strong>{percentages[1].percentage}%</strong>), o que indica um perfil equilibrado e versátil.
                    </>
                  )}
                </p>

                <p className="text-slate-100 leading-relaxed text-lg">
                  Este resultado sugere que você se destaca em{" "}
                  <strong>{dominantData.strengths.slice(0, 2).join(" e ").toLowerCase()}</strong>, sendo uma pessoa{" "}
                  <strong>{dominantData.characteristics.slice(0, 2).join(" e ").toLowerCase()}</strong>. Para seu
                  desenvolvimento contínuo, recomendamos atenção especial às áreas de{" "}
                  <strong>{dominantData.challenges.slice(0, 2).join(" e ").toLowerCase()}</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center shadow-2xl card-hover glass-dark text-slate-100">
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-2 drop-shadow-lg">{totalQuestions}</div>
              <p className="text-slate-200">Total de Respostas</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-2xl card-hover glass-dark text-slate-100">
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-2 drop-shadow-lg">{percentages[0].percentage}%</div>
              <p className="text-slate-200">Temperamento Dominante</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-2xl card-hover glass-dark text-slate-100">
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-2 drop-shadow-lg">
                {percentages.filter((p) => p.percentage > 15).length}
              </div>
              <p className="text-slate-200">Temperamentos Ativos</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-2xl card-hover glass-dark text-slate-100">
            <CardContent className="p-6">
              <div className="text-4xl font-bold mb-2 drop-shadow-lg">100%</div>
              <p className="text-slate-200">Análise Completa</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
