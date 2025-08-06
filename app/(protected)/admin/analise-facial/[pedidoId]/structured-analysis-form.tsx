"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, User, Eye, Smile, Brain } from "lucide-react"
import { salvarAnaliseEstruturada } from "./actions"
import { toast } from "sonner"
import type { AnaliseFacial } from "@/lib/types"

interface StructuredAnalysisFormProps {
  pedidoId: string
  clienteId: string
  clienteNome: string
  analiseExistente?: AnaliseFacial | null
}

export default function StructuredAnalysisForm({
  pedidoId,
  clienteId,
  clienteNome,
  analiseExistente,
}: StructuredAnalysisFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Estados para formato do rosto
  const [formatoRostoClassificacao, setFormatoRostoClassificacao] = useState("")
  const [formatoRostoJustificativa, setFormatoRostoJustificativa] = useState("")
  const [formatoRostoTemperamento, setFormatoRostoTemperamento] = useState("")
  const [formatoRostoInterpretacao, setFormatoRostoInterpretacao] = useState("")

  // Estados para terço superior
  const [testaClassificacao, setTestaClassificacao] = useState("")
  const [testaJustificativa, setTestaJustificativa] = useState("")
  const [testaTemperamento, setTestaTemperamento] = useState("")
  const [testaInterpretacao, setTestaInterpretacao] = useState("")

  const [sobrancelhasClassificacao, setSobrancelhasClassificacao] = useState("")
  const [sobrancelhasJustificativa, setSobrancelhasJustificativa] = useState("")
  const [sobrancelhasTemperamento, setSobrancelhasTemperamento] = useState("")
  const [sobrancelhasInterpretacao, setSobrancelhasInterpretacao] = useState("")

  const [cabeloClassificacao, setCabeloClassificacao] = useState("")
  const [cabeloJustificativa, setCabeloJustificativa] = useState("")
  const [cabeloTemperamento, setCabeloTemperamento] = useState("")
  const [cabeloInterpretacao, setCabeloInterpretacao] = useState("")

  // Estados para terço médio
  const [olhosClassificacao, setOlhosClassificacao] = useState("")
  const [olhosJustificativa, setOlhosJustificativa] = useState("")
  const [olhosTemperamento, setOlhosTemperamento] = useState("")
  const [olhosInterpretacao, setOlhosInterpretacao] = useState("")

  const [narizClassificacao, setNarizClassificacao] = useState("")
  const [narizJustificativa, setNarizJustificativa] = useState("")
  const [narizTemperamento, setNarizTemperamento] = useState("")
  const [narizInterpretacao, setNarizInterpretacao] = useState("")

  const [macasClassificacao, setMacasClassificacao] = useState("")
  const [macasJustificativa, setMacasJustificativa] = useState("")
  const [macasTemperamento, setMacasTemperamento] = useState("")
  const [macasInterpretacao, setMacasInterpretacao] = useState("")

  // Estados para terço inferior
  const [bocaClassificacao, setBocaClassificacao] = useState("")
  const [bocaJustificativa, setBocaJustificativa] = useState("")
  const [bocaTemperamento, setBocaTemperamento] = useState("")
  const [bocaInterpretacao, setBocaInterpretacao] = useState("")

  const [queixoClassificacao, setQueixoClassificacao] = useState("")
  const [queixoJustificativa, setQueixoJustificativa] = useState("")
  const [queixoTemperamento, setQueixoTemperamento] = useState("")
  const [queixoInterpretacao, setQueixoInterpretacao] = useState("")

  // Estados para resumo
  const [temperamentoPredominante, setTemperamentoPredominante] = useState("")
  const [descricaoGeral, setDescricaoGeral] = useState("")

  // useEffect para carregar dados existentes
  useEffect(() => {
    if (analiseExistente) {
      // Formato do rosto
      setFormatoRostoClassificacao(analiseExistente.formato_rosto_classificacao || "")
      setFormatoRostoJustificativa(analiseExistente.formato_rosto_justificativa || "")
      setFormatoRostoTemperamento(analiseExistente.formato_rosto_temperamento || "")
      setFormatoRostoInterpretacao(analiseExistente.formato_rosto_interpretacao || "")

      // Terço superior
      setTestaClassificacao(analiseExistente.testa_classificacao || "")
      setTestaJustificativa(analiseExistente.testa_justificativa || "")
      setTestaTemperamento(analiseExistente.testa_temperamento || "")
      setTestaInterpretacao(analiseExistente.testa_interpretacao || "")

      setSobrancelhasClassificacao(analiseExistente.sobrancelhas_classificacao || "")
      setSobrancelhasJustificativa(analiseExistente.sobrancelhas_justificativa || "")
      setSobrancelhasTemperamento(analiseExistente.sobrancelhas_temperamento || "")
      setSobrancelhasInterpretacao(analiseExistente.sobrancelhas_interpretacao || "")

      setCabeloClassificacao(analiseExistente.cabelo_classificacao || "")
      setCabeloJustificativa(analiseExistente.cabelo_justificativa || "")
      setCabeloTemperamento(analiseExistente.cabelo_temperamento || "")
      setCabeloInterpretacao(analiseExistente.cabelo_interpretacao || "")

      // Terço médio
      setOlhosClassificacao(analiseExistente.olhos_classificacao || "")
      setOlhosJustificativa(analiseExistente.olhos_justificativa || "")
      setOlhosTemperamento(analiseExistente.olhos_temperamento || "")
      setOlhosInterpretacao(analiseExistente.olhos_interpretacao || "")

      setNarizClassificacao(analiseExistente.nariz_classificacao || "")
      setNarizJustificativa(analiseExistente.nariz_justificativa || "")
      setNarizTemperamento(analiseExistente.nariz_temperamento || "")
      setNarizInterpretacao(analiseExistente.nariz_interpretacao || "")

      setMacasClassificacao(analiseExistente.macas_classificacao || "")
      setMacasJustificativa(analiseExistente.macas_justificativa || "")
      setMacasTemperamento(analiseExistente.macas_temperamento || "")
      setMacasInterpretacao(analiseExistente.macas_interpretacao || "")

      // Terço inferior
      setBocaClassificacao(analiseExistente.boca_classificacao || "")
      setBocaJustificativa(analiseExistente.boca_justificativa || "")
      setBocaTemperamento(analiseExistente.boca_temperamento || "")
      setBocaInterpretacao(analiseExistente.boca_interpretacao || "")

      setQueixoClassificacao(analiseExistente.queixo_classificacao || "")
      setQueixoJustificativa(analiseExistente.queixo_justificativa || "")
      setQueixoTemperamento(analiseExistente.queixo_temperamento || "")
      setQueixoInterpretacao(analiseExistente.queixo_interpretacao || "")

      // Resumo
      setTemperamentoPredominante(analiseExistente.temperamento_predominante || "")
      setDescricaoGeral(analiseExistente.descricao_geral || "")
    }
  }, [analiseExistente])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const analiseData: Partial<AnaliseFacial> = {
        cliente_id: clienteId,
        pedido_id: pedidoId,

        // Formato do rosto
        formato_rosto_classificacao: formatoRostoClassificacao || undefined,
        formato_rosto_justificativa: formatoRostoJustificativa || undefined,
        formato_rosto_temperamento: formatoRostoTemperamento || undefined,
        formato_rosto_interpretacao: formatoRostoInterpretacao || undefined,

        // Terço superior
        testa_classificacao: testaClassificacao || undefined,
        testa_justificativa: testaJustificativa || undefined,
        testa_temperamento: testaTemperamento || undefined,
        testa_interpretacao: testaInterpretacao || undefined,

        sobrancelhas_classificacao: sobrancelhasClassificacao || undefined,
        sobrancelhas_justificativa: sobrancelhasJustificativa || undefined,
        sobrancelhas_temperamento: sobrancelhasTemperamento || undefined,
        sobrancelhas_interpretacao: sobrancelhasInterpretacao || undefined,

        cabelo_classificacao: cabeloClassificacao || undefined,
        cabelo_justificativa: cabeloJustificativa || undefined,
        cabelo_temperamento: cabeloTemperamento || undefined,
        cabelo_interpretacao: cabeloInterpretacao || undefined,

        // Terço médio
        olhos_classificacao: olhosClassificacao || undefined,
        olhos_justificativa: olhosJustificativa || undefined,
        olhos_temperamento: olhosTemperamento || undefined,
        olhos_interpretacao: olhosInterpretacao || undefined,

        nariz_classificacao: narizClassificacao || undefined,
        nariz_justificativa: narizJustificativa || undefined,
        nariz_temperamento: narizTemperamento || undefined,
        nariz_interpretacao: narizInterpretacao || undefined,

        macas_classificacao: macasClassificacao || undefined,
        macas_justificativa: macasJustificativa || undefined,
        macas_temperamento: macasTemperamento || undefined,
        macas_interpretacao: macasInterpretacao || undefined,

        // Terço inferior
        boca_classificacao: bocaClassificacao || undefined,
        boca_justificativa: bocaJustificativa || undefined,
        boca_temperamento: bocaTemperamento || undefined,
        boca_interpretacao: bocaInterpretacao || undefined,

        queixo_classificacao: queixoClassificacao || undefined,
        queixo_justificativa: queixoJustificativa || undefined,
        queixo_temperamento: queixoTemperamento || undefined,
        queixo_interpretacao: queixoInterpretacao || undefined,

        // Resumo
        temperamento_predominante: temperamentoPredominante || undefined,
        descricao_geral: descricaoGeral || undefined,
      }

      console.log("Dados sendo enviados:", analiseData) // Debug

      const response = await salvarAnaliseEstruturada(analiseData)

      if (response.success) {
        toast.success("Análise salva com sucesso!")
        // Redirecionar para a visualização do resultado
        window.location.href = `/admin/analise-facial/${pedidoId}`
      } else {
        toast.error(response.error || "Erro ao salvar análise")
      }
    } catch (error) {
      console.error("Erro ao salvar análise:", error)
      toast.error("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const FeatureAnalysisCard = ({
    title,
    icon,
    classificacao,
    setClassificacao,
    justificativa,
    setJustificativa,
    temperamento,
    setTemperamento,
    interpretacao,
    setInterpretacao,
  }: {
    title: string
    icon: React.ReactNode
    classificacao: string
    setClassificacao: (value: string) => void
    justificativa: string
    setJustificativa: (value: string) => void
    temperamento: string
    setTemperamento: (value: string) => void
    interpretacao: string
    setInterpretacao: (value: string) => void
  }) => (
    <Card className="glass-dark border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-100">Classificação</Label>
          <Input
            value={classificacao}
            onChange={(e) => setClassificacao(e.target.value)}
            placeholder="Ex: Alto e amplo, Arqueadas e grossas..."
            className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 bg-slate-800/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-100">Justificativa Visual</Label>
          <Textarea
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            placeholder="Descreva as características visuais observadas..."
            className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 bg-slate-800/50"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-100">Temperamento</Label>
          <Input
            value={temperamento}
            onChange={(e) => setTemperamento(e.target.value)}
            placeholder="Ex: Sanguíneo, Colérico, Melancólico, Fleumático..."
            className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 bg-slate-800/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-100">Interpretação</Label>
          <Textarea
            value={interpretacao}
            onChange={(e) => setInterpretacao(e.target.value)}
            placeholder="Interpretação psicológica e comportamental..."
            className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 bg-slate-800/50"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card className="glass-dark border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-100">Análise Facial Estruturada</CardTitle>
            <CardDescription className="text-slate-300">
              {analiseExistente ? "Editando análise para" : "Análise detalhada para"}{" "}
              <span className="font-semibold">{clienteNome}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="formato" className="w-full">
            <TabsList className="glass-effect border-white/20 grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="formato" className="text-slate-100 data-[state=active]:bg-slate-700">
                Formato
              </TabsTrigger>
              <TabsTrigger value="superior" className="text-slate-100 data-[state=active]:bg-slate-700">
                Terço Superior
              </TabsTrigger>
              <TabsTrigger value="medio" className="text-slate-100 data-[state=active]:bg-slate-700">
                Terço Médio
              </TabsTrigger>
              <TabsTrigger value="inferior" className="text-slate-100 data-[state=active]:bg-slate-700">
                Terço Inferior
              </TabsTrigger>
            </TabsList>

            <TabsContent value="formato" className="space-y-4 mt-6">
              <FeatureAnalysisCard
                title="Formato Geral do Rosto"
                icon={<User className="w-5 h-5" />}
                classificacao={formatoRostoClassificacao}
                setClassificacao={setFormatoRostoClassificacao}
                justificativa={formatoRostoJustificativa}
                setJustificativa={setFormatoRostoJustificativa}
                temperamento={formatoRostoTemperamento}
                setTemperamento={setFormatoRostoTemperamento}
                interpretacao={formatoRostoInterpretacao}
                setInterpretacao={setFormatoRostoInterpretacao}
              />
            </TabsContent>

            <TabsContent value="superior" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FeatureAnalysisCard
                  title="Testa"
                  icon={<Brain className="w-5 h-5" />}
                  classificacao={testaClassificacao}
                  setClassificacao={setTestaClassificacao}
                  justificativa={testaJustificativa}
                  setJustificativa={setTestaJustificativa}
                  temperamento={testaTemperamento}
                  setTemperamento={setTestaTemperamento}
                  interpretacao={testaInterpretacao}
                  setInterpretacao={setTestaInterpretacao}
                />

                <FeatureAnalysisCard
                  title="Sobrancelhas"
                  icon={<Eye className="w-5 h-5" />}
                  classificacao={sobrancelhasClassificacao}
                  setClassificacao={setSobrancelhasClassificacao}
                  justificativa={sobrancelhasJustificativa}
                  setJustificativa={setSobrancelhasJustificativa}
                  temperamento={sobrancelhasTemperamento}
                  setTemperamento={setSobrancelhasTemperamento}
                  interpretacao={sobrancelhasInterpretacao}
                  setInterpretacao={setSobrancelhasInterpretacao}
                />
              </div>

              <FeatureAnalysisCard
                title="Cabelo"
                icon={<User className="w-5 h-5" />}
                classificacao={cabeloClassificacao}
                setClassificacao={setCabeloClassificacao}
                justificativa={cabeloJustificativa}
                setJustificativa={setCabeloJustificativa}
                temperamento={cabeloTemperamento}
                setTemperamento={setCabeloTemperamento}
                interpretacao={cabeloInterpretacao}
                setInterpretacao={setCabeloInterpretacao}
              />
            </TabsContent>

            <TabsContent value="medio" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FeatureAnalysisCard
                  title="Olhos"
                  icon={<Eye className="w-5 h-5" />}
                  classificacao={olhosClassificacao}
                  setClassificacao={setOlhosClassificacao}
                  justificativa={olhosJustificativa}
                  setJustificativa={setOlhosJustificativa}
                  temperamento={olhosTemperamento}
                  setTemperamento={setOlhosTemperamento}
                  interpretacao={olhosInterpretacao}
                  setInterpretacao={setOlhosInterpretacao}
                />

                <FeatureAnalysisCard
                  title="Nariz"
                  icon={<User className="w-5 h-5" />}
                  classificacao={narizClassificacao}
                  setClassificacao={setNarizClassificacao}
                  justificativa={narizJustificativa}
                  setJustificativa={setNarizJustificativa}
                  temperamento={narizTemperamento}
                  setTemperamento={setNarizTemperamento}
                  interpretacao={narizInterpretacao}
                  setInterpretacao={setNarizInterpretacao}
                />
              </div>

              <FeatureAnalysisCard
                title="Maçãs do Rosto"
                icon={<Smile className="w-5 h-5" />}
                classificacao={macasClassificacao}
                setClassificacao={setMacasClassificacao}
                justificativa={macasJustificativa}
                setJustificativa={setMacasJustificativa}
                temperamento={macasTemperamento}
                setTemperamento={setMacasTemperamento}
                interpretacao={macasInterpretacao}
                setInterpretacao={setMacasInterpretacao}
              />
            </TabsContent>

            <TabsContent value="inferior" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FeatureAnalysisCard
                  title="Boca"
                  icon={<Smile className="w-5 h-5" />}
                  classificacao={bocaClassificacao}
                  setClassificacao={setBocaClassificacao}
                  justificativa={bocaJustificativa}
                  setJustificativa={setBocaJustificativa}
                  temperamento={bocaTemperamento}
                  setTemperamento={setBocaTemperamento}
                  interpretacao={bocaInterpretacao}
                  setInterpretacao={setBocaInterpretacao}
                />

                <FeatureAnalysisCard
                  title="Queixo"
                  icon={<User className="w-5 h-5" />}
                  classificacao={queixoClassificacao}
                  setClassificacao={setQueixoClassificacao}
                  justificativa={queixoJustificativa}
                  setJustificativa={setQueixoJustificativa}
                  temperamento={queixoTemperamento}
                  setTemperamento={setQueixoTemperamento}
                  interpretacao={queixoInterpretacao}
                  setInterpretacao={setQueixoInterpretacao}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Resumo */}
          <Card className="glass-dark border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-100">Resumo da Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-100">Temperamento Predominante</Label>
                <Input
                  value={temperamentoPredominante}
                  onChange={(e) => setTemperamentoPredominante(e.target.value)}
                  placeholder="Ex: Sanguíneo, Colérico, Melancólico, Fleumático..."
                  className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 bg-slate-800/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-100">Descrição Geral</Label>
                <Textarea
                  value={descricaoGeral}
                  onChange={(e) => setDescricaoGeral(e.target.value)}
                  placeholder="Descrição geral da personalidade e características comportamentais..."
                  className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 bg-slate-800/50"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="glass-effect bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {analiseExistente ? "Atualizar Análise" : "Salvar Análise"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
