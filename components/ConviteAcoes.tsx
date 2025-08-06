'use client'

import { ClipboardCopy, Check, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ConviteAcoes({ urlConvite }: { urlConvite: string }) {
  const [copiado, setCopiado] = useState(false)

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlConvite)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  return (
    <div className="flex items-center gap-4 mt-2">
      {/* Botão de Copiar */}
      <button
        type="button"
        onClick={copiarLink}
        className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-blue-700 transition"
        title="Copiar link do convite"
      >
        {copiado ? <Check className="w-4 h-4 text-green-600" /> : <ClipboardCopy className="w-4 h-4" />}
        {copiado ? 'Copiado!' : 'Copiar link'}
      </button>

      {/* Enviar via WhatsApp */}
      <Link
        href={`https://wa.me/?text=${encodeURIComponent(`Olá! Aqui está seu link de convite: ${urlConvite}`)}`}
        target="_blank"
        className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition"
        title="Enviar via WhatsApp"
      >
        <Send className="w-4 h-4" />
        WhatsApp
      </Link>
    </div>
  )
}
