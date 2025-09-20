import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth.server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session || session.tipo_usuario !== "admin") {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
}


    const logs = await sql`
      SELECT 
        l.id,
        l.acao,
        l.descricao,
        l.criado_em,
        l.ip,
        u.nome as usuario_nome,
        u.email as usuario_email,
        u.tipo_usuario
      FROM logs l
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      WHERE l.criado_em >= NOW() - INTERVAL '7 days'
      ORDER BY l.criado_em DESC
      LIMIT 15
    `

    const mapearTipoAtividade = (acao: string) => {
      const mapa: Record<string, any> = {
        login: { type: "login", description: "Login realizado", icon: "LogIn", color: "bg-green-500" },
        logout: { type: "logout", description: "Logout realizado", icon: "LogOut", color: "bg-gray-500" },
        cadastro_usuario: { type: "usuario_cadastrado", description: "Novo usuário cadastrado", icon: "UserPlus", color: "bg-blue-500" },
        cadastro_cliente: { type: "cliente_cadastrado", description: "Novo cliente registrado", icon: "User", color: "bg-purple-500" },
        cadastro_corporativo: { type: "corporativo_criado", description: "Nova empresa corporativa cadastrada", icon: "Building2", color: "bg-pink-500" },
        convite_enviado: { type: "convite_enviado", description: "Convite enviado para colaborador", icon: "Mail", color: "bg-yellow-500" },
        convite_aceito: { type: "colaborador_cadastrado", description: "Colaborador aceitou convite", icon: "UserCheck", color: "bg-indigo-500" },
        teste_iniciado: { type: "teste_iniciado", description: "Teste de temperamento iniciado", icon: "Play", color: "bg-orange-500" },
        teste_concluido: { type: "teste_concluido", description: "Teste de temperamento concluído", icon: "CheckCircle", color: "bg-green-600" },
        analise_facial_iniciada: { type: "analise_iniciada", description: "Análise facial iniciada", icon: "Camera", color: "bg-cyan-500" },
        analise_facial_concluida: { type: "analise_concluida", description: "Análise facial concluída", icon: "CheckCircle2", color: "bg-emerald-500" },
        pedido_criado: { type: "pedido_criado", description: "Novo pedido criado", icon: "FileText", color: "bg-blue-600" },
        perfil_atualizado: { type: "perfil_atualizado", description: "Perfil atualizado", icon: "Edit", color: "bg-amber-500" },
        senha_alterada: { type: "senha_alterada", description: "Senha alterada", icon: "Key", color: "bg-red-500" },
      }

      return mapa[acao.toLowerCase()] || { type: "atividade_geral", description: acao.replace(/_/g," ").replace(/\b\w/g, l => l.toUpperCase()), icon: "Activity", color: "bg-slate-500" }
    }

    const atividadesFormatadas = logs.map((log) => {
      const tipoAtividade = mapearTipoAtividade(log.acao)
      return {
        id: log.id,
        type: tipoAtividade.type,
        description: log.descricao || tipoAtividade.description,
        user: log.usuario_nome || "Sistema",
        userEmail: log.usuario_email,
        userType: log.tipo_usuario,
        timestamp: new Date(log.criado_em),
        icon: tipoAtividade.icon,
        color: tipoAtividade.color,
        ip: log.ip,
        acao: log.acao,
      }
    })

    return NextResponse.json(atividadesFormatadas)
  } catch (error) {
    console.error("Erro ao buscar atividades recentes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
