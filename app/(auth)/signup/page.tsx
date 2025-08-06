"use client"

import { useActionState } from "react"
import { signupAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Lock, CheckCircle, Star, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signupAction, undefined)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-ping" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/abstract-temperaments-logo.png"
              alt="4 Temperamentos"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              4 Temperamentos
            </span>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
            >
              Já tenho conta
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Descubra Seu
                </span>
                <br />
                <span className="text-white">Temperamento</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gratuitamente
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Análise completa da sua personalidade baseada nos 4 temperamentos clássicos. Descubra seus pontos fortes
                e como se relacionar melhor.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-2 mx-auto">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-slate-400">Usuários</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2 mx-auto">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-sm text-slate-400">Avaliação</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-2 mx-auto">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-slate-400">Gratuito</div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">O que você vai descobrir:</h3>
              <div className="space-y-3">
                {[
                  "Seu temperamento dominante (Sanguíneo, Colérico, Melancólico ou Fleumático)",
                  "Análise facial personalizada com IA avançada",
                  "Pontos fortes e áreas de desenvolvimento",
                  "Como se relacionar melhor com outros temperamentos",
                  "Relatório completo em PDF para download",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">Criar Conta Gratuita</CardTitle>
                <CardDescription className="text-slate-300">
                  Comece sua jornada de autoconhecimento agora mesmo
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {state?.error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-300">{state.error}</AlertDescription>
                  </Alert>
                )}

                {state?.success && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-300">
                      Conta criada com sucesso! Redirecionando...
                    </AlertDescription>
                  </Alert>
                )}

                <form action={action} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="text-sm font-medium text-slate-300">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        required
                        disabled={isPending}
                        placeholder="Seu nome completo"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-300">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={isPending}
                        placeholder="seu@email.com"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="senha" className="text-sm font-medium text-slate-300">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="senha"
                        name="senha"
                        type="password"
                        required
                        disabled={isPending}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmarSenha" className="text-sm font-medium text-slate-300">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        required
                        disabled={isPending}
                        placeholder="Digite a senha novamente"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Criar Conta Gratuita
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <Link href="/termos" className="text-purple-400 hover:text-purple-300 underline">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-purple-400 hover:text-purple-300 underline">
                      Política de Privacidade
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
