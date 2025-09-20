import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth.server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.tipo_usuario !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar logs recentes dos últimos 7 dias
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

    // Mapear ações para tipos visuais
    const mapearTipoAtividade = (acao: string) => {
      switch (acao.toLowerCase()) {
        case 'login':
          return {
            type: 'login',
            description: 'Login realizado',
            icon: 'LogIn',
            color: 'bg-green-500'
          }
        case 'logout':
          return {
            type: 'logout',
            description: 'Logout realizado',
            icon: 'LogOut',
            color: 'bg-gray-500'
          }
        case 'cadastro_usuario':
          return {
            type: 'usuario_cadastrado',
            description: 'Novo usuário cadastrado',
            icon: 'UserPlus',
            color: 'bg-blue-500'
          }
        case 'cadastro_cliente':
          return {
            type: 'cliente_cadastrado',
            description: 'Novo cliente registrado',
            icon: 'User',
            color: 'bg-purple-500'
          }
        case 'cadastro_corporativo':
          return {
            type: 'corporativo_criado',
            description: 'Nova empresa corporativa cadastrada',
            icon: 'Building2',
            color: 'bg-pink-500'
          }
        case 'convite_enviado':
          return {
            type: 'convite_enviado',
            description: 'Convite enviado para colaborador',
            icon: 'Mail',
            color: 'bg-yellow-500'
          }
        case 'convite_aceito':
          return {
            type: 'colaborador_cadastrado',
            description: 'Colaborador aceitou convite',
            icon: 'UserCheck',
            color: 'bg-indigo-500'
          }
        case 'teste_iniciado':
          return {
            type: 'teste_iniciado',
            description: 'Teste de temperamento iniciado',
            icon: 'Play',
            color: 'bg-orange-500'
          }
        case 'teste_concluido':
          return {
            type: 'teste_concluido',
            description: 'Teste de temperamento concluído',
            icon: 'CheckCircle',
            color: 'bg-green-600'
          }
        case 'analise_facial_iniciada':
          return {
            type: 'analise_iniciada',
            description: 'Análise facial iniciada',
            icon: 'Camera',
            color: 'bg-cyan-500'
          }
        case 'analise_facial_concluida':
          return {
            type: 'analise_concluida',
            description: 'Análise facial concluída',
            icon: 'CheckCircle2',
            color: 'bg-emerald-500'
          }
        case 'pedido_criado':
          return {
            type: 'pedido_criado',
            description: 'Novo pedido criado',
            icon: 'FileText',
            color: 'bg-blue-600'
          }
        case 'perfil_atualizado':
          return {
            type: 'perfil_atualizado',
            description: 'Perfil atualizado',
            icon: 'Edit',
            color: 'bg-amber-500'
          }
        case 'senha_alterada':
          return {
            type: 'senha_alterada',
            description: 'Senha alterada',
            icon: 'Key',
            color: 'bg-red-500'
          }
        default:
          return {
            type: 'atividade_geral',
            description: acao.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            icon: 'Activity',
            color: 'bg-slate-500'
          }
      }
    }

    // Formatar os dados para o frontend
    const atividadesFormatadas = logs.map((log, index) => {
      const tipoAtividade = mapearTipoAtividade(log.acao)
      
      return {
        id: log.id,
        type: tipoAtividade.type,
        description: log.descricao || tipoAtividade.description,
        user: log.usuario_nome || 'Sistema',
        userEmail: log.usuario_email,
        userType: log.tipo_usuario,
        timestamp: new Date(log.criado_em),
        icon: tipoAtividade.icon,
        color: tipoAtividade.color,
        ip: log.ip,
        acao: log.acao
      }
    })

    return NextResponse.json(atividadesFormatadas)
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
