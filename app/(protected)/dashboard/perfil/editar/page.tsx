"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateProfileAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      <Save className="h-4 w-4 mr-2" />
      {pending ? "Salvando..." : "Salvar Alterações"}
    </Button>
  )
}

export default function EditProfilePage() {
  const [state, formAction] = useActionState(updateProfileAction, undefined)
  const [clientData, setClientData] = useState<any>(null)

  // Carregar dados do cliente
  useEffect(() => {
    async function loadClientData() {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setClientData(data)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
    loadClientData()
  }, [])

  if (!clientData) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
        <Button className="text-white bg-transparent hover:bg-transparent hover:text-blue-200" size="sm" asChild>
          <Link href="/dashboard/perfil">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="max-w-2xl mx-auto w-full">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados cadastrais</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" name="nome" defaultValue={clientData.nome} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={clientData.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    defaultValue={clientData.telefone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    name="data_nascimento"
                    type="date"
                    defaultValue={clientData.data_nascimento || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Gênero</Label>
                  <Select name="genero" defaultValue={clientData.genero || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento">CPF</Label>
                  <Input
                    id="documento"
                    name="documento"
                    placeholder="000.000.000-00"
                    defaultValue={clientData.documento || ""}
                  />
                </div>
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
                  <AlertDescription>Perfil atualizado com sucesso!</AlertDescription>
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
