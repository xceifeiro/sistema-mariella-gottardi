import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  Zap,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-ping" />

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
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
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                  Entrar
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              100% Gratuito • Análise Completa
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Descubra Seu
              </span>
              <br />
              <span className="text-white">Temperamento</span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Análise completa da sua personalidade baseada nos 4 temperamentos clássicos. Entenda seus pontos fortes,
              como se relacionar melhor e alcançar seu potencial máximo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Começar Análise Gratuita
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full border-2 border-slate-900"
                    />
                  ))}
                </div>
                <span className="text-sm">+50.000 pessoas já descobriram</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, value: "50K+", label: "Usuários Ativos" },
              { icon: Star, value: "4.9", label: "Avaliação" },
              { icon: Shield, value: "100%", label: "Gratuito" },
              { icon: TrendingUp, value: "95%", label: "Precisão" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <stat.icon className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Como Funciona</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Um processo simples e científico para descobrir sua personalidade
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Teste de Temperamento",
                description:
                  "Responda 8 perguntas cuidadosamente elaboradas baseadas na teoria dos 4 temperamentos clássicos.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Análise Facial IA",
                description:
                  "Nossa IA avançada analisa suas características faciais para complementar o resultado do teste.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Target,
                title: "Relatório Completo",
                description:
                  "Receba um relatório detalhado com seus pontos fortes, desafios e dicas de relacionamento.",
                color: "from-green-500 to-emerald-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">O Que Você Vai Descobrir</h2>
              <p className="text-xl text-slate-300">
                Insights profundos sobre sua personalidade e como aplicá-los na vida
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                "Seu temperamento dominante (Sanguíneo, Colérico, Melancólico ou Fleumático)",
                "Pontos fortes únicos da sua personalidade",
                "Áreas de desenvolvimento e crescimento pessoal",
                "Como se comunicar melhor com outros temperamentos",
                "Estratégias para relacionamentos mais saudáveis",
                "Dicas para carreira baseadas no seu perfil",
                "Como lidar com stress e desafios",
                "Relatório completo em PDF para download",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border-white/20 p-8">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Heart className="w-16 h-16 text-pink-400" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Pronto Para Se Conhecer Melhor?</h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Junte-se a mais de 50.000 pessoas que já descobriram seu temperamento e transformaram suas vidas.
                </p>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Começar Minha Jornada Gratuita
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <p className="text-sm text-slate-400">
                  100% gratuito • Sem cartão de crédito • Resultados instantâneos
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-white/10">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/abstract-temperaments-logo.png"
                  alt="4 Temperamentos"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  4 Temperamentos
                </span>
              </div>
              <p className="text-slate-400">
                Descubra sua personalidade e transforme seus relacionamentos com análise científica dos temperamentos.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/como-funciona" className="hover:text-white transition-colors">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="/temperamentos" className="hover:text-white transition-colors">
                    Os 4 Temperamentos
                  </Link>
                </li>
                <li>
                  <Link href="/exemplos" className="hover:text-white transition-colors">
                    Exemplos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/sobre" className="hover:text-white transition-colors">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/termos" className="hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="hover:text-white transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 4 Temperamentos. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
