"use client"

import { useState, useTransition } from "react"
import { uploadFacialImages } from "./actions"

interface FacialAnalysisFormProps {
  pedidoId: string
}

export default function FacialAnalysisForm({ pedidoId }: FacialAnalysisFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [previews, setPreviews] = useState<{
    perfilNormal?: string
    perfilSorrindo?: string
    perfilLado?: string
    bocaSorrindo?: string
  }>({})

  const handleFileChange = (type: string, file: File | null) => {
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Por favor, selecione apenas arquivos de imagem." })
        return
      }

      // Validar tamanho (10MB para Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "A imagem deve ter no máximo 10MB." })
        return
      }

      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          [type]: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
      setMessage(null) // Limpar mensagens de erro
    } else {
      setPreviews((prev) => ({
        ...prev,
        [type]: undefined,
      }))
    }
  }

  const handleSubmit = async (formData: FormData) => {
  startTransition(async () => {
    try {
      const response = await fetch("/api/upload-imagens", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setMessage({
          type: "success",
          text: "Imagens enviadas com sucesso! O processo de análise foi iniciado.",
        })

        // Recarrega após 3 segundos
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        setMessage({
          type: "error",
          text: result.error || "Erro desconhecido ao enviar imagens.",
        })
      }
    } catch (error) {
      console.error("Erro ao enviar imagens:", error)
      setMessage({
        type: "error",
        text: "Erro de rede ao tentar enviar as imagens. Tente novamente.",
      })
    }
  })
}


  const imageTypes = [
    {
      key: "perfilNormal",
      label: "Perfil Normal",
      description: "Rosto de frente, expressão neutra",
      icon: "😐",
      tips: "Olhe diretamente para a câmera com expressão séria",
    },
    {
      key: "perfilSorrindo",
      label: "Perfil Sorrindo",
      description: "Rosto de frente, sorriso natural",
      icon: "😊",
      tips: "Mesmo ângulo da foto anterior, mas com sorriso natural",
    },
    {
      key: "perfilLado",
      label: "Perfil de Lado",
      description: "Rosto de perfil (90°)",
      icon: "👤",
      tips: "Vire completamente de lado, mostrando o perfil lateral",
    },
    {
      key: "bocaSorrindo",
      label: "Boca Sorrindo",
      description: "Foco na boca com sorriso amplo",
      icon: "😁",
      tips: "Foto mais próxima focando na boca com sorriso bem aberto",
    },
  ]

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="pedidoId" value={pedidoId} />

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">{message.type === "success" ? "✅" : "❌"}</div>
            <div>{message.text}</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {imageTypes.map((imageType) => (
          <div key={imageType.key} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{imageType.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{imageType.label}</h3>
              <p className="text-sm text-gray-600 mb-2">{imageType.description}</p>
              <p className="text-xs text-blue-600 italic">{imageType.tips}</p>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                name={imageType.key}
                accept="image/*"
                required
                onChange={(e) => handleFileChange(imageType.key, e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {previews[imageType.key as keyof typeof previews] && (
                <div className="mt-4">
                  <img
                    src={previews[imageType.key as keyof typeof previews]! || "/placeholder.svg"}
                    alt={`Preview ${imageType.label}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm px-24"
                  />
                  <p className="text-xs text-green-600 text-center mt-2">✅ Imagem selecionada</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Enviando...
            </div>
          ) : (
            "🚀 Enviar Imagens para Análise"
          )}
        </button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ <strong>Importante:</strong> Após enviar as imagens, elas serão armazenadas e o processo de
            análise pode levar até 48 horas. Você receberá uma notificação quando o resultado estiver pronto.
          </p>
        </div>
      </div>
    </form>
  )
}
