"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react"
import { aprovarDossie, rejeitarDossie } from "./actions"
import { toast } from "sonner"

interface DossieActionsProps {
  resultadoId: string
  status: string
  observacoes: string
}

export default function DossieActions({ resultadoId, status, observacoes }: DossieActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [observacoesTexto, setObservacoesTexto] = useState(observacoes)
  const [showObservacoes, setShowObservacoes] = useState(false)

  const handleAprovar = async () => {
    setIsLoading(true)
    try {
      const response = await aprovarDossie(resultadoId, observacoesTexto)
      if (response.success) {
        toast.success("Dossiê aprovado com sucesso!")
        window.location.reload()
      } else {
        toast.error(response.error || "Erro ao aprovar dossiê")
      }
    } catch (error) {
      toast.error("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejeitar = async () => {
    if (!observacoesTexto.trim()) {
      toast.error("Por favor, adicione observações explicando o motivo da rejeição")
      return
    }

    setIsLoading(true)
    try {
      const response = await rejeitarDossie(resultadoId, observacoesTexto)
      if (response.success) {
        toast.success("Dossiê rejeitado. Será reenviado para correção.")
        window.location.reload()
      } else {
        toast.error(response.error || "Erro ao rejeitar dossiê")
      }
    } catch (error) {
      toast.error("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  if (status !== "pendente") {
    return (
      <Card className="glass-dark border-white/20 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 text-slate-300">
            {status === "aprovado" ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg font-medium">Dossiê já foi aprovado</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="text-lg font-medium">Dossiê foi rejeitado</span>
              </>
            )}
          </div>
          {observacoes && (
            <div className="mt-4 glass-effect p-4 rounded-xl">
              <p className="text-slate-300 text-sm mb-2">Observações:</p>
              <p className="text-slate-100">{observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-dark border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-100 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          Ações do Dossiê
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Observações */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-100 font-medium">Observações (Opcional)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowObservacoes(!showObservacoes)}
              className="text-slate-300 hover:text-slate-800"
            >
              {showObservacoes ? "Ocultar" : "Adicionar observações"}
            </Button>
          </div>

          {showObservacoes && (
            <Textarea
              value={observacoesTexto}
              onChange={(e) => setObservacoesTexto(e.target.value)}
              placeholder="Adicione observações sobre o dossiê (obrigatório para rejeição)..."
              className="glass-effect border-white/30 text-slate-100 placeholder:text-slate-400 min-h-[100px]"
            />
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleAprovar}
            disabled={isLoading}
            className="flex-1 glass-effect bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Aprovar Dossiê
              </>
            )}
          </Button>

          <Button
            onClick={handleRejeitar}
            disabled={isLoading}
            variant="outline"
            className="flex-1 glass-effect border-red-500/30 text-red-300 hover:bg-red-500/20 bg-transparent py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 mr-2" />
                Rejeitar e Solicitar Correção
              </>
            )}
          </Button>
        </div>

        {/* Informações */}
        <div className="glass-effect p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <div className="flex items-start gap-3 text-blue-200">
            <MessageSquare className="w-5 h-5 mt-0.5 text-blue-400" />
            <div className="text-sm">
              <p className="font-medium mb-2">Instruções:</p>
              <ul className="space-y-1 text-xs">
                <li>
                  • <strong>Aprovar:</strong> O dossiê será marcado como aprovado e ficará disponível para o cliente
                </li>
                <li>
                  • <strong>Rejeitar:</strong> O dossiê será reenviado para a automação com suas observações para
                  correção
                </li>
                <li>• Observações são obrigatórias para rejeição e opcionais para aprovação</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
