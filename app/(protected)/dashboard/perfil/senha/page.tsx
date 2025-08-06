"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { changePasswordAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      <Lock className="h-4 w-4 mr-2" />
      {pending ? "Alterando..." : "Alterar Senha"}
    </Button>
  )
}

export default function ChangePasswordPage() {
  const [state, formAction] = useActionState(changePasswordAction, undefined)

  return (
    <div className="flex min-h-screen w-full flex-col">
        <Button className="text-white bg-transparent hover:bg-transparent hover:text-blue-200" size="sm" asChild>
          <Link href="/dashboard/perfil">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="max-w-md mx-auto w-full">
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Digite sua senha atual e a nova senha</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <Input id="senhaAtual" name="senhaAtual" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input id="novaSenha" name="novaSenha" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input id="confirmarSenha" name="confirmarSenha" type="password" required />
              </div>

              {state?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {state?.success && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>Senha alterada com sucesso!</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <SubmitButton />
                <Button variant="outline" asChild>
                  <Link href="/dashboard/perfil">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
