"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, FileText, CheckCircle, Building2, UserPlus, Building, LogIn, LogOut, Mail, UserCheck, Play, CheckCircle2, Camera, Edit, Key, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AtividadeRecente {
  id: number
  type: string
  description: string
  user: string
  userEmail?: string
  userType?: string
  timestamp: Date
  icon: string
  color: string
  ip?: string
  acao: string
}

export function RecentActivity() {
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(5)
  const [search, setSearch] = useState("")

  // Fetch atividades
  useEffect(() => {
    async function fetchAtividades() {
      try {
        const response = await fetch('/api/admin/atividades-recentes')
        if (!response.ok) throw new Error('Erro ao carregar atividades')
        const data = await response.json()

        const atividadesComDatas = data.map((atividade: any) => ({
          ...atividade,
          timestamp: new Date(atividade.timestamp)
        }))

        setAtividades(atividadesComDatas)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchAtividades()
    const interval = setInterval(fetchAtividades, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  const getActivityBadge = (type: string, userType?: string) => {
    const baseClasses = "backdrop-blur-sm text-xs font-medium"

    switch (type) {
      case "login": return <Badge className={`bg-green-100/80 text-green-800 border-green-200/50 ${baseClasses}`}>Login</Badge>
      case "logout": return <Badge className={`bg-gray-100/80 text-gray-800 border-gray-200/50 ${baseClasses}`}>Logout</Badge>
      case "usuario_cadastrado": return <Badge className={`bg-blue-100/80 text-blue-800 border-blue-200/50 ${baseClasses}`}>Novo Usuário</Badge>
      case "cliente_cadastrado": return <Badge className={`bg-purple-100/80 text-purple-800 border-purple-200/50 ${baseClasses}`}>Novo Cliente</Badge>
      case "corporativo_criado": return <Badge className={`bg-pink-100/80 text-pink-800 border-pink-200/50 ${baseClasses}`}>Nova Empresa</Badge>
      case "convite_enviado": return <Badge className={`bg-yellow-100/80 text-yellow-800 border-yellow-200/50 ${baseClasses}`}>Convite</Badge>
      case "colaborador_cadastrado": return <Badge className={`bg-indigo-100/80 text-indigo-800 border-indigo-200/50 ${baseClasses}`}>Colaborador</Badge>
      case "teste_iniciado": return <Badge className={`bg-orange-100/80 text-orange-800 border-orange-200/50 ${baseClasses}`}>Teste Iniciado</Badge>
      case "teste_concluido": return <Badge className={`bg-green-100/80 text-green-800 border-green-200/50 ${baseClasses}`}>Teste Concluído</Badge>
      case "analise_iniciada": return <Badge className={`bg-cyan-100/80 text-cyan-800 border-cyan-200/50 ${baseClasses}`}>Análise Iniciada</Badge>
      case "analise_concluida": return <Badge className={`bg-emerald-100/80 text-emerald-800 border-emerald-200/50 ${baseClasses}`}>Análise Concluída</Badge>
      case "pedido_criado": return <Badge className={`bg-blue-100/80 text-blue-800 border-blue-200/50 ${baseClasses}`}>Novo Pedido</Badge>
      case "perfil_atualizado": return <Badge className={`bg-amber-100/80 text-amber-800 border-amber-200/50 ${baseClasses}`}>Perfil</Badge>
      case "senha_alterada": return <Badge className={`bg-red-100/80 text-red-800 border-red-200/50 ${baseClasses}`}>Senha</Badge>
      default: return <Badge className={`glass-effect border-white/30 text-white ${baseClasses}`}>Atividade</Badge>
    }
  }

  const getUserTypeBadge = (userType?: string) => {
    if (!userType) return null
    const baseClasses = "text-xs ml-1"
    switch (userType) {
      case "admin": return <Badge variant="destructive" className={`${baseClasses} text-purple-400 border-purple-400`}>Admin</Badge>
      case "corporativo": return <Badge variant="secondary" className={`${baseClasses} text-blue-400 border-blue-400`}>Corp</Badge>
      case "cliente": return <Badge variant="outline" className={`${baseClasses} text-white`}>Cliente</Badge>
      default: return null
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LogIn': return LogIn
      case 'LogOut': return LogOut
      case 'UserPlus': return UserPlus
      case 'User': return User
      case 'Building2': return Building2
      case 'Mail': return Mail
      case 'UserCheck': return UserCheck
      case 'Play': return Play
      case 'CheckCircle': return CheckCircle
      case 'CheckCircle2': return CheckCircle2
      case 'Camera': return Camera
      case 'FileText': return FileText
      case 'Edit': return Edit
      case 'Key': return Key
      case 'Activity': return Activity
      case 'Building': return Building
      default: return Clock
    }
  }

  const filteredAtividades = atividades.filter(a => 
    a.user.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Card className="card-hover border-0 shadow-xl glass-dark">...</Card>
  if (error) return <Card className="card-hover border-0 shadow-xl glass-dark">Erro: {error}</Card>

  return (
    <Card className="card-hover hover:bg-transparent border-0 shadow-xl glass-dark">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
          <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          Atividade Recente
          <div className="ml-auto"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div></div>
        </CardTitle>
        <p className="text-slate-300 text-sm">Logs do sistema • Atualização automática</p>

        {/* Campo de pesquisa */}
        <input
          type="text"
          placeholder="Pesquisar..."
          className="mt-3 w-full px-3 py-2 rounded-lg text-sm bg-white/10 text-slate-100 placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>

      <CardContent>
        {filteredAtividades.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma atividade encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAtividades.slice(0, visibleCount).map(activity => {
              const IconComponent = getIcon(activity.icon)
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 glass-effect rounded-xl hover:bg-blue-900/10 transition-all duration-300">
                  <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getActivityBadge(activity.type, activity.userType)}
                      {getUserTypeBadge(activity.userType)}
                      <span className="text-xs text-slate-400">{getTimeAgo(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-100">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-300">por {activity.user}</p>
                      {activity.ip && <span className="text-xs text-slate-400">• IP: {activity.ip}</span>}
                    </div>
                  </div>
                </div>
              )
            })}

            {visibleCount < filteredAtividades.length && (
              <div className="text-center mt-2">
                <button
                  className="text-sm text-blue-400 hover:underline"
                  onClick={() => setVisibleCount(prev => prev + 5)}
                >
                  Ver mais
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/20 text-center">
          <p className="text-xs text-slate-400">
            Últimos 7 dias • Próxima atualização em 30s
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
