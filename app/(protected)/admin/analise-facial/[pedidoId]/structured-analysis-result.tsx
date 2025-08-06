"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Eye, Smile, Brain, FileText } from "lucide-react"
import type { AnaliseFacial } from "@/lib/types"

interface StructuredAnalysisResultProps {
  analise: AnaliseFacial
  clienteNome: string
  imagens?: {
    perfil_normal: string
    perfil_sorrindo: string
    perfil_lado: string
    boca_sorrindo: string
  }
}

export default function StructuredAnalysisResult({ analise, clienteNome, imagens }: StructuredAnalysisResultProps) {
  const getTemperamentColor = (temperamento: string | null | undefined) => {
    if (!temperamento) return "bg-gray-500/20 text-gray-300 border-gray-500/30"

    const temp = temperamento.toLowerCase()
    if (temp.includes("sanguineo") || temp.includes("sanguíneo")) {
      return "bg-red-500/20 text-red-300 border-red-500/30"
    }
    if (temp.includes("colerico") || temp.includes("colérico")) {
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }
    if (temp.includes("melancolico") || temp.includes("melancólico")) {
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
    if (temp.includes("fleumatico") || temp.includes("fleumático")) {
      return "bg-green-500/20 text-green-300 border-green-500/30"
    }
    return "bg-purple-500/20 text-purple-300 border-purple-500/30"
  }

  const FeatureCard = ({
    title,
    icon,
    classificacao,
    justificativa,
    temperamento,
    interpretacao,
  }: {
    title: string
    icon: React.ReactNode
    classificacao?: string | null
    justificativa?: string | null
    temperamento?: string | null
    interpretacao?: string | null
  }) => {
    // Só renderizar se pelo menos um campo estiver preenchido
    if (!classificacao && !justificativa && !temperamento && !interpretacao) {
      return null
    }

    return (
      <Card className="glass-dark border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {classificacao && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-1">Classificação</h4>
              <p className="text-slate-100">{classificacao}</p>
            </div>
          )}

          {justificativa && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-1">Justificativa Visual</h4>
              <p className="text-slate-100 text-sm leading-relaxed">{justificativa}</p>
            </div>
          )}

          {temperamento && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Temperamento</h4>
              <Badge className={getTemperamentColor(temperamento)}>{temperamento}</Badge>
            </div>
          )}

          {interpretacao && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-1">Interpretação</h4>
              <p className="text-slate-100 text-sm leading-relaxed">{interpretacao}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Resumo Principal */}
      {(analise.temperamento_predominante || analise.descricao_geral) && (
        <Card className="glass-dark border-white/20 border-2 shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-100">Resumo da Análise</CardTitle>
                <CardDescription className="text-slate-300">
                  Análise completa para <span className="font-semibold">{clienteNome}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {analise.temperamento_predominante && (
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Temperamento Predominante</h3>
                <Badge className={`${getTemperamentColor(analise.temperamento_predominante)} text-lg px-4 py-2`}>
                  {analise.temperamento_predominante}
                </Badge>
              </div>
            )}

            {analise.descricao_geral && (
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Descrição Geral</h3>
                <div className="glass-effect p-4 rounded-lg border border-white/20">
                  <p className="text-slate-100 leading-relaxed">{analise.descricao_geral}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Formato do Rosto */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6" />
          Formato do Rosto
        </h2>
        <FeatureCard
          title="Formato Geral"
          icon={<User className="w-5 h-5" />}
          classificacao={analise.formato_rosto_classificacao}
          justificativa={analise.formato_rosto_justificativa}
          temperamento={analise.formato_rosto_temperamento}
          interpretacao={analise.formato_rosto_interpretacao}
        />
      </div>

      {/* Terço Superior */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Terço Superior
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FeatureCard
            title="Testa"
            icon={<Brain className="w-5 h-5" />}
            classificacao={analise.testa_classificacao}
            justificativa={analise.testa_justificativa}
            temperamento={analise.testa_temperamento}
            interpretacao={analise.testa_interpretacao}
          />
          <FeatureCard
            title="Sobrancelhas"
            icon={<Eye className="w-5 h-5" />}
            classificacao={analise.sobrancelhas_classificacao}
            justificativa={analise.sobrancelhas_justificativa}
            temperamento={analise.sobrancelhas_temperamento}
            interpretacao={analise.sobrancelhas_interpretacao}
          />
        </div>
        <FeatureCard
          title="Cabelo"
          icon={<User className="w-5 h-5" />}
          classificacao={analise.cabelo_classificacao}
          justificativa={analise.cabelo_justificativa}
          temperamento={analise.cabelo_temperamento}
          interpretacao={analise.cabelo_interpretacao}
        />
      </div>

      {/* Terço Médio */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Eye className="w-6 h-6" />
          Terço Médio
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FeatureCard
            title="Olhos"
            icon={<Eye className="w-5 h-5" />}
            classificacao={analise.olhos_classificacao}
            justificativa={analise.olhos_justificativa}
            temperamento={analise.olhos_temperamento}
            interpretacao={analise.olhos_interpretacao}
          />
          <FeatureCard
            title="Nariz"
            icon={<User className="w-5 h-5" />}
            classificacao={analise.nariz_classificacao}
            justificativa={analise.nariz_justificativa}
            temperamento={analise.nariz_temperamento}
            interpretacao={analise.nariz_interpretacao}
          />
        </div>
        <FeatureCard
          title="Maçãs do Rosto"
          icon={<Smile className="w-5 h-5" />}
          classificacao={analise.macas_classificacao}
          justificativa={analise.macas_justificativa}
          temperamento={analise.macas_temperamento}
          interpretacao={analise.macas_interpretacao}
        />
      </div>

      {/* Terço Inferior */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Smile className="w-6 h-6" />
          Terço Inferior
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FeatureCard
            title="Boca"
            icon={<Smile className="w-5 h-5" />}
            classificacao={analise.boca_classificacao}
            justificativa={analise.boca_justificativa}
            temperamento={analise.boca_temperamento}
            interpretacao={analise.boca_interpretacao}
          />
          <FeatureCard
            title="Queixo"
            icon={<User className="w-5 h-5" />}
            classificacao={analise.queixo_classificacao}
            justificativa={analise.queixo_justificativa}
            temperamento={analise.queixo_temperamento}
            interpretacao={analise.queixo_interpretacao}
          />
        </div>
      </div>

      {/* Imagens de Referência */}
      {imagens && (
        <Card className="glass-dark border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Imagens de Referência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagens.perfil_normal && (
                <div className="text-center">
                  <img
                    src={imagens.perfil_normal || "/placeholder.svg"}
                    alt="Perfil Normal"
                    className="w-30 h-34 object-cover rounded-lg border border-white/20"
                  />
                  <p className="text-sm text-slate-300 mt-2">Perfil Normal</p>
                </div>
              )}
              {imagens.perfil_sorrindo && (
                <div className="text-center">
                  <img
                    src={imagens.perfil_sorrindo || "/placeholder.svg"}
                    alt="Perfil Sorrindo"
                    className="w-30 h-34 object-cover rounded-lg border border-white/20"
                  />
                  <p className="text-sm text-slate-300 mt-2">Perfil Sorrindo</p>
                </div>
              )}
              {imagens.perfil_lado && (
                <div className="text-center">
                  <img
                    src={imagens.perfil_lado || "/placeholder.svg"}
                    alt="Perfil de Lado"
                    className="w-30 h-34 object-cover rounded-lg border border-white/20"
                  />
                  <p className="text-sm text-slate-300 mt-2">Perfil de Lado</p>
                </div>
              )}
              {imagens.boca_sorrindo && (
                <div className="text-center">
                  <img
                    src={imagens.boca_sorrindo || "/placeholder.svg"}
                    alt="Boca Sorrindo"
                    className="w-30 h-37 object-cover rounded-lg border border-white/20"
                  />
                  <p className="text-sm text-slate-300 mt-2">Boca Sorrindo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
