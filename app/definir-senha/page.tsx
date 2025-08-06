"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { setPasswordAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function SetPasswordButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Salvando..." : "Definir Senha e Acessar"}
    </Button>
  )
}

// A página recebe 'searchParams' do Next.js, que contém os parâmetros da URL
export default function SetPasswordPage({ searchParams }: { searchParams: { token?: string; error?: string } }) {
  const [state, formAction] = useActionState(setPasswordAction, undefined)
  const token = searchParams.token
  const error = searchParams.error || state?.error

  if (!token && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Token Inválido</AlertTitle>
          <AlertDescription>
            O link de acesso é inválido ou está faltando o token. Por favor, solicite um novo link.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo(a)!</CardTitle>
          <CardDescription>Crie sua senha de acesso para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-2">
              <Label htmlFor="senha">Nova Senha</Label>
              <Input id="senha" name="senha" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
              <Input id="confirmarSenha" name="confirmarSenha" type="password" required />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <SetPasswordButton />
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
