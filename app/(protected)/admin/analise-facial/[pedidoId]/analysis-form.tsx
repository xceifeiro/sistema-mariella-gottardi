"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, FileText, Code, Sparkles } from "lucide-react"
import { salvarAnalise } from "./actions"
import { toast } from "sonner"

interface AnalysisFormProps {
  pedidoId: string
  clienteNome: string
  resultadoExistente?: any
}

export default function AnalysisForm({ pedidoId, clienteNome, resultadoExistente }: AnalysisFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<"html" | "structured">("html")

  // Estados para análise HTML
  const [htmlContent, setHtmlContent] = useState("")

  // Estados para análise estruturada
  const [temperamentoPrimario, setTemperamentoPrimario] = useState("sanguineo")
  const [temperamentoSecundario, setTemperamentoSecundario] = useState("")
  const [caracteristicasFaciais, setCaracteristicasFaciais] = useState("")
  const [personalidade, setPersonalidade] = useState("")
  const [recomendacoes, setRecomendacoes] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let resultado
      let html = ""

      if (analysisMode === "html") {
        if (!htmlContent.trim()) {
          toast.error("Por favor, insira o conteúdo HTML da análise")
          return
        }
        resultado = { tipo: "html", conteudo: htmlContent }
        html = htmlContent
      } else {
        if (!temperamentoPrimario || !caracteristicasFaciais || !personalidade) {
          toast.error("Por favor, preencha todos os campos obrigatórios")
          return
        }

        resultado = {
          temperamento_primario: temperamentoPrimario,
          temperamento_secundario: temperamentoSecundario,
          caracteristicas_faciais: caracteristicasFaciais,
          personalidade: personalidade,
          recomendacoes: recomendacoes,
          observacoes: observacoes,
          data_analise: new Date().toISOString(),
        }

        // Gerar HTML a partir dos dados estruturados
        html = `
          <div class="analise-facial">
            <h2>Análise de Temperamento Facial</h2>
            <div class="temperamentos">
              <h3>Temperamento Primário</h3>
              <p><strong>${temperamentoPrimario}</strong></p>
              ${temperamentoSecundario ? `<h3>Temperamento Secundário</h3><p><strong>${temperamentoSecundario}</strong></p>` : ""}
            </div>
            <div class="caracteristicas">
              <h3>Características Faciais</h3>
              <p>${caracteristicasFaciais}</p>
            </div>
            <div class="personalidade">
              <h3>Análise de Personalidade</h3>
              <p>${personalidade}</p>
            </div>
            ${recomendacoes ? `<div class="recomendacoes"><h3>Recomendações</h3><p>${recomendacoes}</p></div>` : ""}
            ${observacoes ? `<div class="observacoes"><h3>Observações</h3><p>${observacoes}</p></div>` : ""}
          </div>
        `
      }

      const response = await salvarAnalise(pedidoId, resultado, html)

      if (response.success) {
        toast.success("Análise salva com sucesso!")
        // Recarregar a página para mostrar o resultado
        window.location.reload()
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

  return (
    <Card className="glass-dark border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-100">Nova Análise Facial</CardTitle>
            <CardDescription className="text-slate-300">
              Análise para{" "}
              <Badge variant="secondary" className="ml-1">
                {clienteNome}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Modo */}
          <div className="space-y-3">
            <Label className="text-slate-100 font-medium">Modo de Análise</Label>
            <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as "html" | "structured")}>
              <TabsList className="glass-effect border-white/20">
                <TabsTrigger value="html" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  HTML Completo
                </TabsTrigger>
                <TabsTrigger value="structured" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Estruturado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="html-content" className="text-slate-100">
                    Conteúdo HTML da Análise *
                  </Label>
                  <Textarea
                    id="html-content"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="Cole aqui o HTML completo da análise facial..."
                    className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 min-h-[300px] font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-slate-400">
                    Cole o HTML completo da análise. Este conteúdo será renderizado diretamente na página do resultado.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="structured" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperamento-primario" className="text-slate-100">
                      Temperamento Primário *
                    </Label>
                    <Select value={temperamentoPrimario} onValueChange={setTemperamentoPrimario}>
                      <SelectTrigger className="glass-effect border-white/30 text-slate-100">
                        <SelectValue placeholder="Selecione o temperamento" />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-white/20">
                        <SelectItem value="sanguineo">Sanguíneo</SelectItem>
                        <SelectItem value="colerico">Colérico</SelectItem>
                        <SelectItem value="melancolico">Melancólico</SelectItem>
                        <SelectItem value="fleumatico">Fleumático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperamento-secundario" className="text-slate-100">
                      Temperamento Secundário
                    </Label>
                    <Select value={temperamentoSecundario} onValueChange={setTemperamentoSecundario}>
                      <SelectTrigger className="glass-effect border-white/30 text-slate-100">
                        <SelectValue placeholder="Selecione (opcional)" />
                      </SelectTrigger>
                      <SelectContent className="glass-dark border-white/20">
                        <SelectItem value="">Nenhum</SelectItem>
                        <SelectItem value="sanguineo">Sanguíneo</SelectItem>
                        <SelectItem value="colerico">Colérico</SelectItem>
                        <SelectItem value="melancolico">Melancólico</SelectItem>
                        <SelectItem value="fleumatico">Fleumático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caracteristicas" className="text-slate-100">
                    Características Faciais Observadas *
                  </Label>
                  <Textarea
                    id="caracteristicas"
                    value={caracteristicasFaciais}
                    onChange={(e) => setCaracteristicasFaciais(e.target.value)}
                    placeholder="Descreva as características faciais observadas..."
                    className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalidade" className="text-slate-100">
                    Análise de Personalidade *
                  </Label>
                  <Textarea
                    id="personalidade"
                    value={personalidade}
                    onChange={(e) => setPersonalidade(e.target.value)}
                    placeholder="Descreva a análise de personalidade baseada nas características faciais..."
                    className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recomendacoes" className="text-slate-100">
                    Recomendações
                  </Label>
                  <Textarea
                    id="recomendacoes"
                    value={recomendacoes}
                    onChange={(e) => setRecomendacoes(e.target.value)}
                    placeholder="Recomendações baseadas na análise..."
                    className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-slate-100">
                    Observações Adicionais
                  </Label>
                  <Textarea
                    id="observacoes"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações adicionais sobre a análise..."
                    className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

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
                  Salvar Análise
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
