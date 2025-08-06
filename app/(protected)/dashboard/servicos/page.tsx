import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Brain, Users, Eye, Star, Sparkles, Clock, Award, Shield } from "lucide-react"
import sql from "@/lib/db"
import { ContractServiceButton } from "./contract-service-button"
import Link from "next/link"

async function getServicesAndUserOrders(clientId: string) {
  // Buscar todos os serviços ativos
  //AQUI EU EXCLUI O PACOTE FULL por enquanto...
  const excludeId = 8

  const services = await sql`
    SELECT id, nome, descricao, slug, ativo 
    FROM servicos 
    WHERE ativo = true AND id <> ${excludeId}
    ORDER BY 
      CASE 
        WHEN slug = 'teste-temperamentos' THEN 1
        WHEN slug = 'analise-facial' THEN 3
        ELSE 5
      END
  `


  // Buscar pedidos do cliente para verificar quais serviços já foram contratados
  const userOrders = await sql`
  SELECT servico_id, status 
  FROM pedidos 
  WHERE cliente_id = ${clientId}
`

  return { services, userOrders }
}

function getServiceIcon(slug: string) {
  switch (slug) {
    case "teste-temperamentos":
      return <Brain className="h-10 w-10 text-blue-400" />
    case "analise-facial":
      return <Eye className="h-10 w-10 text-purple-400" />
      {/** 
    case "pacote-full":
      return <Star className="h-10 w-10 text-yellow-400" />*/}
    default:
      return <CheckCircle className="h-10 w-10 text-slate-400" />
  }
}

function getServicePrice(slug: string) {
  switch (slug) {
    case "teste-temperamentos":
      return "R$ 89,90"
    case "analise-facial":
      return "R$ 199,90"
      {/*
    case "pacote-full":
      return "R$ 299,90"*/}
    default:
      return "Consulte"
  }
}

function getServiceOriginalPrice(slug: string) {
  switch (slug) {/*
    case "pacote-full":
      return "R$ 419,70"*/
    default:
      return null
  }
}

function getServiceFeatures(slug: string) {
  switch (slug) {
    case "teste-temperamentos":
      return [
        "Análise completa dos 4 temperamentos",
        "Relatório personalizado em PDF",
        "Dicas de desenvolvimento pessoal",
        "Suporte especializado por 30 dias",
        "Acesso vitalício aos resultados",
      ]
    case "analise-facial":
      return [
        "Mapeamento facial com IA avançada",
        "Análise de traços de personalidade",
        "Dicas personalizadas de visagismo",
        "Consultoria de imagem profissional",
        "Relatório fotográfico detalhado",
      ]
      {/*}
    case "pacote-full":
      return [
        "Todos os testes e análises inclusos",
        "Relatório integrado e completo",
        "Consultoria personalizada 1:1",
        "Suporte premium por 90 dias",
        "Desconto exclusivo de 25%",
        "Acesso prioritário a novos recursos",
      ]*/}
    default:
      return []
  }
}

function getServiceBadge(slug: string) {
  switch (slug) {
    case "teste-temperamentos":
      return { text: "POPULAR", color: "bg-blue-500/20 text-blue-300 border-blue-400/30" }
    case "analise-facial":
      return { text: "INOVADOR", color: "bg-purple-500/20 text-purple-300 border-purple-400/30" }
      {/** 
    case "pacote-full":
      return { text: "MELHOR VALOR", color: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30" }*/}
    default:
      return null
  }
}

export default async function ServicesPage() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const { services, userOrders } = await getServicesAndUserOrders(session.sub)

  // Criar um mapa dos serviços já contratados
  const contractedServices = new Map()
  userOrders.forEach((order: any) => {
    contractedServices.set(order.servico_id, order.status)
  })

  return (
    <div className="flex min-h-screen w-full flex-col floating-shapes">
      {/* Header com efeito de vidro */}
      <header className="sticky top-0 z-50 glass-header backdrop-blur-xl">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg glass-effect">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Nossos Serviços</h1>
              <p className="text-sm text-slate-400">Descubra seu potencial</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
              Transforme Seu
              <span className="gradient-text block">Desenvolvimento Pessoal</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Escolha o serviço ideal para descobrir seus talentos, desenvolver suas habilidades e alcançar todo seu
              potencial pessoal e profissional.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-slate-400">Clientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-sm text-slate-400">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">24h</div>
              <div className="text-sm text-slate-400">Entrega Média</div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto animate-slide-up">
          {services.map((service: any, index: number) => {
            const isContracted = contractedServices.has(service.id)
            const orderStatus = contractedServices.get(service.id)
            const isPremium = service.slug === "pacote-full"
            const badge = getServiceBadge(service.slug)
            const originalPrice = getServiceOriginalPrice(service.slug)

            return (
              <Card
                key={service.id}
                className={`relative glass-card card-hover border-0 overflow-hidden animate-fade-in`}
                style={{ animationDelay: `${index * 1}s` }}
              >
                {/* Premium glow effect */}
                {isPremium && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse" />
                )}

                {/* Badge */}
                {badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 py-7">
                    <Badge className={`${badge.color} border px-4 py-1 font-semibold`}>{badge.text}</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-8 py-20">
                  {/* Icon with glow */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-2xl glass-effect animate-float">{getServiceIcon(service.slug)}</div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-slate-100 mb-2">{service.nome}</CardTitle>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-slate-100">{getServicePrice(service.slug)}</div>
                    {originalPrice && <div className="text-lg text-slate-400 line-through">{originalPrice}</div>}
                    {isPremium && <div className="text-sm text-green-400 font-semibold">Economia de 25%</div>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  <CardDescription className="text-slate-300 leading-relaxed text-center">
                    {service.descricao}
                  </CardDescription>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-400" />O que está incluído:
                    </h4>
                    <ul className="space-y-3">
                      {getServiceFeatures(service.slug).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-300">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Service guarantees */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs">Garantia</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Entrega Rápida</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-6">
                    {isContracted ? (
                      <div className="text-center space-y-3">
                        <Badge
                          variant={orderStatus === "concluido" ? "default" : "secondary"}
                          className="glass-effect border-0 text-sm py-2 px-4"
                        >
                          {orderStatus === "pendente" && "⏳ Aguardando Preenchimento"}
                          {orderStatus === "em_andamento" && "🔄 Em Análise"}
                          {orderStatus === "concluido" && "✅ Concluído"}
                          {orderStatus === "cancelado" && "❌ Cancelado"}
                        </Badge>
                        {orderStatus === "concluido" && (
                          <div className="py-2">
                          <Link href={`/dashboard/resultados`} passHref>
                          <Button
                            variant="outline"
                            className="w-full glass-effect border-blue-400/30 text-blue-300 hover:bg-blue-500/20bg-transparent"
                          >
                            Ver Resultados
                          </Button></Link>
                          </div>
                        )}
                        {orderStatus === "pendente" && (
                          <div className="py-2">
                          <Link href={`/dashboard/${service.slug}`}>

                          <Button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30">
                            Preencher Teste
                          </Button>
                          </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-2">
                      <ContractServiceButton serviceId={service.id} serviceName={service.nome} isPremium={isPremium} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Support Section */}
        <div className="mt-16 animate-fade-in">
          <Card className="max-w-4xl mx-auto glass-card border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl glass-effect">
                  <Sparkles className="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-100">Precisa de Ajuda para Escolher?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Nossa equipe de especialistas está pronta para ajudar você a escolher o serviço ideal para suas
                necessidades e objetivos específicos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="glass-effect border-blue-400/30 text-blue-300 hover:bg-blue-500/20 bg-transparent"
                >
                  💬 Falar com Consultor
                </Button>
                <Button
                  variant="outline"
                  className="glass-effect border-purple-400/30 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                >
                  📞 Agendar Ligação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="flex justify-center items-center gap-8 mt-12 text-slate-400 animate-fade-in">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Dados Seguros</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span className="text-sm">Certificado</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm">Suporte 24/7</span>
          </div>
        </div>
      </main>
    </div>
  )
}
