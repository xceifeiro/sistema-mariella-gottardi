"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { contractServiceAction } from "./actions"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Sparkles, Crown } from "lucide-react"

function SubmitButton({ isPremium }: { isPremium: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className={`w-full relative overflow-hidden group transition-all duration-300 ${
        isPremium
          ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30 text-yellow-300 border border-yellow-400/30"
          : "glass-effect border-blue-400/30 text-blue-300 hover:bg-blue-500/20"
      }`}
      disabled={pending}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isPremium
            ? "bg-gradient-to-r from-yellow-400/10 to-yellow-600/10"
            : "bg-gradient-to-r from-blue-400/10 to-blue-600/10"
        }`}
      />

      <div className="relative flex items-center justify-center gap-2">
        {isPremium ? <Crown className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        {pending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            Contratando...
          </>
        ) : (
          <>
            {isPremium ? "Contratar Premium" : "Contratar Agora"}
            <Sparkles className="h-3 w-3 opacity-70" />
          </>
        )}
      </div>
    </Button>
  )
}

interface ContractServiceButtonProps {
  serviceId: number
  serviceName: string
  isPremium?: boolean
}

export function ContractServiceButton({ serviceId, serviceName, isPremium = false }: ContractServiceButtonProps) {
  const [state, formAction] = useActionState(contractServiceAction, undefined)

  if (state?.success) {
    return (
      <div className="text-center space-y-3 animate-fade-in">
        <div className="p-4 rounded-lg glass-effect border border-green-400/30">
          <p className="text-green-300 font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Serviço contratado com sucesso!
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full glass-effect border-slate-400/30 text-slate-300 hover:bg-slate-500/20 bg-transparent"
          onClick={() => window.location.reload()}
        >
          🔄 Atualizar Página
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="serviceName" value={serviceName} />

      {state?.error && (
        <div className="p-3 rounded-lg glass-effect border border-red-400/30 animate-fade-in">
          <p className="text-red-300 text-sm text-center">{state.error}</p>
        </div>
      )}

      <SubmitButton isPremium={isPremium} />
    </form>
  )
}
