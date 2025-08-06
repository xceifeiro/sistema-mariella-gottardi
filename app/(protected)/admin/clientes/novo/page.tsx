"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createClientAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check } from "lucide-react"
import { useState } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Criando Cliente..." : "Criar Cliente e Gerar Link"}
    </Button>
  )
}

export default function NewClientPage() {
  const [state, formAction] = useActionState(createClientAction, undefined)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (state?.link) {
      navigator.clipboard.writeText(state.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Criar Novo Cliente</CardTitle>
          <CardDescription>
            Insira os dados do cliente. Um link de primeiro acesso será gerado para que ele defina a própria senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!state?.link ? (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" name="nome" placeholder="Nome do Cliente" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="email@cliente.com" required />
              </div>
              {state?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
              <SubmitButton />
            </form>
          ) : (
            <div className="space-y-4">
              <Alert variant="default">
                <Check className="h-4 w-4" />
                <AlertTitle>Cliente Criado com Sucesso!</AlertTitle>
                <AlertDescription>Envie o link abaixo para o cliente. Ele é válido por 24 horas.</AlertDescription>
              </Alert>
              <div className="flex items-center space-x-2">
                <Input value={state.link} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={() => window.location.reload()} className="w-full">
                Criar Outro Cliente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
