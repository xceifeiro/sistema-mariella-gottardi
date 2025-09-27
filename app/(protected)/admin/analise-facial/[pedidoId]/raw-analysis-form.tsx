"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Loader2, FileText } from "lucide-react"
import { salvarAnaliseTexto } from "./actions"
import { toast } from "sonner"

interface RawAnalysisFormProps {
  pedidoId: string
  clienteId: string
  clienteNome: string
  resultadoExistente?: any
}

export default function RawAnalysisForm({
  pedidoId,
  clienteId,
  clienteNome,
  resultadoExistente,
}: RawAnalysisFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [conteudoAnalise, setConteudoAnalise] = useState(() => {
    if (typeof resultadoExistente === "string") {
      return resultadoExistente
    } else if (resultadoExistente && typeof resultadoExistente === "object") {
      return JSON.stringify(resultadoExistente, null, 2)
    }
    return ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!conteudoAnalise.trim()) {
        toast.error("Por favor, insira o conteúdo da análise")
        return
      }

      const response = await salvarAnaliseTexto(pedidoId, clienteId, conteudoAnalise)

      if (response.success) {
        toast.success("Análise salva com sucesso! Enviando para geração de dossiê...")
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
            <FileText className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-100">Análise Facial - Edição Livre</CardTitle>
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
          <div className="space-y-3">
            <Label className="text-slate-100 font-medium">Conteúdo da Análise</Label>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-1">💡</div>
                <div className="text-blue-200 text-sm">
                  <p className="font-medium mb-2">Instruções:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Cole aqui o texto bruto da análise gerada pela automação</li>
                    <li>• Faça as correções e ajustes necessários</li>
                    <li>• Pode ser HTML, texto simples ou JSON</li>
                    <li>• Após salvar, será enviado para geração do dossiê</li>
                  </ul>
                </div>
              </div>
            </div>

            <Textarea
              value={conteudoAnalise}
              onChange={(e) => setConteudoAnalise(e.target.value)}
              placeholder="Cole aqui o conteúdo da análise facial gerada pela automação..."
              className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 min-h-[700px] font-mono text-sm"
              required
            />
            <p className="text-xs text-slate-400">
              Este conteúdo será processado e enviado para a automação gerar o dossiê final.
            </p>
          </div>

          <div className="flex justify-end gap-3">
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
                  Salvar e Enviar para Dossiê
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
