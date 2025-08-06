"use server"

import sql from "@/lib/db"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { toZonedTime, format } from "date-fns-tz"

const timeZone = "America/Sao_Paulo"
const now = new Date()
// Converte a data UTC para horário de São Paulo
const nowInSP = toZonedTime(now, timeZone)

// Se precisar formatar como string no fuso SP (opcional)
const formatted = format(nowInSP, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
console.log(formatted)

export async function aceitarConvite(formData: FormData): Promise<void> {
  const token = formData.get("token") as string
  const nome = formData.get("nome") as string
  const senha = formData.get("senha") as string
  const confirmarSenha = formData.get("confirmarSenha") as string
  const cargo = formData.get("cargo") as string | null
  const departamento = formData.get("departamento") as string | null

  if (!token || !nome || !senha || !confirmarSenha) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos.")
  }
  if (senha !== confirmarSenha) {
    throw new Error("As senhas não coincidem.")
  }
  if (senha.length < 6) {
    throw new Error("A senha deve ter no mínimo 6 caracteres.")
  }

  // Buscar convite válido
  const [convite] = await sql`
    SELECT 
      cc.*,
      ec.nome_empresa
    FROM colaboradores_corporativos cc
    INNER JOIN empresas_corporativas ec ON cc.empresa_id = ec.id
    WHERE cc.token_convite = ${token}
    AND cc.status = 'pendente'
    AND cc.convite_expira_em > NOW()
  `

  if (!convite) {
    throw new Error("Convite inválido ou expirado.")
  }

  // Verificar se o email já existe
  const [usuarioExistente] = await sql`
    SELECT id FROM usuarios WHERE email = ${convite.email}
  `
  if (usuarioExistente) {
    throw new Error("Este email já possui cadastro no sistema.")
  }

  const senhaHash = await bcrypt.hash(senha, 12)

  // Data atual no fuso horário de São Paulo convertida para UTC (para armazenar no banco)
  const nowSP = toZonedTime(new Date(), "America/Sao_Paulo")

  await sql.begin(async (tx) => {
    // Criar usuário com criado_em
    const [novoUsuario] = await tx`
      INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, primeiro_acesso, criado_em)
      VALUES (${nome}, ${convite.email}, ${senhaHash}, 'cliente', false, ${nowSP})
      RETURNING id
    `
    // Criar Cliente do Usuário criado
    await tx`
      INSERT INTO clientes (
        id,
        status,
        cargo
      ) VALUES (
        ${novoUsuario.id},
        'ativo',
        ${cargo}
      )
    `

    // Criar pedido Teste de Temperamentos
    await tx`
      INSERT INTO pedidos (cliente_id, servico_id, status, data_pedido)
      VALUES (${novoUsuario.id}, 5, 'pendente', ${nowSP})
    `
    // Criar pedido Análise Facial
    await tx`
      INSERT INTO pedidos (cliente_id, servico_id, status, data_pedido)
      VALUES (${novoUsuario.id}, 7, 'pendente', ${nowSP})
    `
    // Criar pedido Pacote FULL
    await tx`
      INSERT INTO pedidos (cliente_id, servico_id, status, data_pedido)
      VALUES (${novoUsuario.id}, 8, 'concluido', ${nowSP})
    `

    
    // Log: criação usuário
    await tx`
      INSERT INTO logs (usuario_id, acao, descricao)
      VALUES (${novoUsuario.id}, 'criar_usuario', ${`Usuário ${nome} criado via convite.`})
    `

    // Atualizar colaborador
    await tx`
      UPDATE colaboradores_corporativos
      SET
        usuario_id = ${novoUsuario.id},
        nome = ${nome},
        cargo = ${cargo},
        departamento = ${departamento},
        status = 'ativo',
        token_convite = NULL,
        convite_expira_em = NULL,
        cadastrado_em = ${nowSP},
        atualizado_em = ${nowSP}
      WHERE id = ${convite.id}
    `

    // Log: atualização colaborador
    await tx`
      INSERT INTO logs (usuario_id, acao, descricao)
      VALUES (${novoUsuario.id}, 'atualizar_colaborador', ${`Colaborador ${nome} ativado via aceite do convite.`})
    `
  })

  redirect("/login?message=Cadastro realizado com sucesso! Faça login para acessar a plataforma.")
}
