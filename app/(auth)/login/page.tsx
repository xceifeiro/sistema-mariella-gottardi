"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { loginAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Brain, Lock, Mail, Sparkles } from "lucide-react"
import Link from "next/link"

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Entrando...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Entrar
        </div>
      )}
    </Button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, undefined)

  return (
    <div className="min-h-screen floating-shapes flex items-center justify-center p-4 pt-10">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8 py-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-float">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 drop-shadow-lg mb-2">CRM 4 Temperamentos</h1>
          <p className="text-slate-200">Análise Comportamental Avançada</p>
        </div>

        <Card className="shadow-2xl border-0 glass-dark">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-100">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-slate-200">
              Faça login para acessar seu painel de análise comportamental
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-100">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 h-12 glass-input border-white/30 text-slate-100 placeholder:text-slate-300 focus:border-white/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-semibold text-slate-100">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 glass-input border-white/30 text-slate-100 placeholder:text-slate-300 focus:border-white/50"
                    required
                  />
                </div>
              </div>

              {state?.error && (
                <Alert className="glass-effect border-red-300/50 bg-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <AlertTitle className="text-red-200">Erro de Login</AlertTitle>
                  <AlertDescription className="text-red-300">{state.error}</AlertDescription>
                </Alert>
              )}

              <LoginButton />
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="glass-effect px-2 text-slate-300">ou</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-200">
                Não tem uma conta?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-slate-100 hover:text-white/80 transition-colors underline"
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center pb-10">
          <div className="p-4">
            <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mx-auto mb-2">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-slate-200">Análise de Temperamentos</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-slate-200">Relatórios Detalhados</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-slate-200">100% Seguro</p>
          </div>
        </div>
      </div>
    </div>
  )
}
