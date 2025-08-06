import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  senha: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
})

export const SignupSchema = z
  .object({
    nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um email válido." }),
    senha: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"], // Anexa o erro ao campo de confirmação de senha
  })

export type User = {
  id: string
  nome: string
  email: string
  tipo_usuario: "admin" | "cliente" | "corporativo"
  primeiro_acesso: boolean
  criado_em: Date
  atualizado_em: Date
}

export type Session = {
  user: User
}

export interface Usuario {
  id: string
  nome: string
  email: string
  senha_hash: string
  tipo_usuario: "admin" | "cliente" | "corporativo"
  primeiro_acesso: boolean
  criado_em: string
  atualizado_em: string
}

export interface EmpresaCorporativa {
  id: string
  usuario_id: string
  nome_empresa: string
  cnpj?: string
  endereco?: string
  telefone?: string
  limite_colaboradores: number
  colaboradores_cadastrados: number
  status: "ativo" | "inativo" | "suspenso"
  criado_em: Date
  atualizado_em: Date
}

export interface ColaboradorCorporativo {
  id: string
  empresa_id: string
  usuario_id?: string
  nome: string
  email: string
  cargo?: string
  departamento?: string
  status: "pendente" | "ativo" | "inativo"
  token_convite?: string
  convite_expira_em?: Date
  cadastrado_em?: Date
  criado_em: Date
  atualizado_em: Date
}

export interface Servico {
  id: string
  nome: string
  descricao: string
  preco: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type Pedido = {
  id: string
  cliente_id: string
  colaborador_id?: string
  tipo_servico: string
  status: "pendente" | "em_andamento" | "concluido" | "cancelado"
  criado_em: Date
  data_conclusao?: Date
  url_imagem_rosto?: string
  url_imagem_perfil?: string
  url_imagem_corpo?: string
}

export interface PedidoAnalise {
  id: string
  cliente_id: string
  colaborador_id?: string
  servico_id: string
  status: string
  data_pedido: string
  data_envio_imagens?: string
  url_perfil_normal?: string
  url_perfil_sorrindo?: string
  url_perfil_lado?: string
  url_boca_sorrindo?: string
  observacoes?: string
  criado_em: string
  atualizado_em: string
}

export type PedidoAnaliseFacial = Pedido & {
  cliente_nome: string
  cliente_email: string
  colaborador_nome?: string
  colaborador_email?: string
  temperamento_predominante?: string | null
  analise_id?: string | null
}

export interface ResultadoTeste {
  id: string
  pedido_id: string
  colaborador_id?: string
  resultado: any
  html?: string
  data_conclusao: string
  criado_em: string
  atualizado_em: string
}

export type ResultadoTesteTemperamento = {
  id: string
  cliente_id: string
  colaborador_id?: string
  temperamento_predominante: string
  pontuacoes: {
    sanguineo: number
    colerico: number
    melancolico: number
    fleumatico: number
  }
  criado_em: Date
}

export interface AnaliseFacial {
  id: string
  cliente_id: string
  pedido_id: string

  // Formato do rosto
  formato_rosto_classificacao?: string | null
  formato_rosto_justificativa?: string | null
  formato_rosto_temperamento?: string | null
  formato_rosto_interpretacao?: string | null

  // Terço superior
  testa_classificacao?: string | null
  testa_justificativa?: string | null
  testa_temperamento?: string | null
  testa_interpretacao?: string | null

  sobrancelhas_classificacao?: string | null
  sobrancelhas_justificativa?: string | null
  sobrancelhas_temperamento?: string | null
  sobrancelhas_interpretacao?: string | null

  cabelo_classificacao?: string | null
  cabelo_justificativa?: string | null
  cabelo_temperamento?: string | null
  cabelo_interpretacao?: string | null

  // Terço médio
  olhos_classificacao?: string | null
  olhos_justificativa?: string | null
  olhos_temperamento?: string | null
  olhos_interpretacao?: string | null

  nariz_classificacao?: string | null
  nariz_justificativa?: string | null
  nariz_temperamento?: string | null
  nariz_interpretacao?: string | null

  macas_classificacao?: string | null
  macas_justificativa?: string | null
  macas_temperamento?: string | null
  macas_interpretacao?: string | null

  // Terço inferior
  boca_classificacao?: string | null
  boca_justificativa?: string | null
  boca_temperamento?: string | null
  boca_interpretacao?: string | null

  queixo_classificacao?: string | null
  queixo_justificativa?: string | null
  queixo_temperamento?: string | null
  queixo_interpretacao?: string | null

  // Resumo
  temperamento_predominante?: string | null
  descricao_geral?: string | null

  // Metadados
  criado_em: Date
  atualizado_em: Date
}

export interface DashboardStats {
  totalClientes: number
  totalPedidos: number
  pedidosPendentes: number
  pedidosConcluidos: number
  receitaTotal: number
  crescimentoMensal: number
}

export interface ClienteDetalhado extends Usuario {
  total_pedidos: number
  ultimo_pedido?: string
  valor_total_gasto: number
}

export interface PedidoDetalhado extends Pedido {
  cliente_nome: string
  cliente_email: string
  colaborador_nome?: string
  colaborador_email?: string
  servico_nome: string
  servico_preco: number
  resultado?: ResultadoTeste
}

export interface TemperamentResult {
  sanguineo: number
  colerico: number
  melancolico: number
  fleumatico: number
  predominante: string
  descricao: string
}

export interface SessionUser {
  id: string
  nome: string
  email: string
  tipo_usuario: "admin" | "cliente" | "corporativo"
  primeiro_acesso: boolean
}

export interface EmpresaCorporativaDetalhada extends EmpresaCorporativa {
  usuario_nome: string
  usuario_email: string
  usuario_criado_em?: string
  primeiro_acesso?: boolean // ← Adicione esta linha
  colaboradores?: ColaboradorCorporativo[]
}



export interface ColaboradorDetalhado extends ColaboradorCorporativo {
  empresa_nome: string
  total_testes: number
  ultimo_teste?: Date
  temperamento_predominante?: string
  token_convite?: string
  urlConvite?: string
}

export interface ColaboradorDashboard extends ColaboradorCorporativo {
  usuario_nome: string
  usuario_email: string
  total_testes: number
  testes_concluidos: number
  analises_faciais: number
  analises_concluidas: number
  token_convite: string
}
