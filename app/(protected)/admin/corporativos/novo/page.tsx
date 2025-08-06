"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createCorporateClientAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Check, Building2 } from "lucide-react"
import { useState } from "react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Criando Cliente Corporativo..." : "Criar Cliente Corporativo"}
    </Button>
  )
}

export default function NewCorporateClientPage() {
  const [state, formAction] = useActionState(createCorporateClientAction, undefined)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (state?.loginInfo) {
      const loginText = `Email: ${state.loginInfo.email}\nSenha: ${state.loginInfo.senha}`
      navigator.clipboard.writeText(loginText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Criar Cliente Corporativo
          </CardTitle>
          <CardDescription>
            Cadastre uma empresa corporativa que poderá gerenciar múltiplos colaboradores e seus testes de temperamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!state?.success ? (
            <form action={formAction} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
                  <Input
                    id="nome_responsavel"
                    name="nome_responsavel"
                    placeholder="Nome completo do responsável"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_responsavel">Email do Responsável</Label>
                  <Input
                    id="email_responsavel"
                    name="email_responsavel"
                    type="email"
                    placeholder="email@empresa.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                  <Input id="nome_empresa" name="nome_empresa" placeholder="Razão social da empresa" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" maxLength={18} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limite_colaboradores">Limite de Colaboradores</Label>
                  <Input
                    id="limite_colaboradores"
                    name="limite_colaboradores"
                    type="number"
                    min="1"
                    max="1000"
                    defaultValue="10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea id="endereco" name="endereco" placeholder="Endereço completo da empresa" rows={3} />
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
            <div className="space-y-6">
              <Alert>
                <Check className="h-4 w-4" />
                <AlertTitle>Cliente Corporativo Criado com Sucesso!</AlertTitle>
                <AlertDescription>
                  A empresa foi cadastrada e o responsável pode fazer login com as credenciais abaixo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Dados de Acesso:</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong> {state.loginInfo?.email}
                    </p>
                    <p>
                      <strong>Senha:</strong> {state.loginInfo?.senha}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="mt-2 bg-transparent">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copiado!" : "Copiar Credenciais"}
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Próximos Passos:</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Envie as credenciais para o responsável da empresa</li>
                    <li>O responsável deve fazer login e alterar a senha no primeiro acesso</li>
                    <li>Após o login, ele poderá cadastrar e gerenciar colaboradores</li>
                    <li>Cada colaborador receberá um link único para cadastro e teste</li>
                  </ul>
                </div>
              </div>

              <Button onClick={() => window.location.reload()} className="w-full">
                Cadastrar Outro Cliente Corporativo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
