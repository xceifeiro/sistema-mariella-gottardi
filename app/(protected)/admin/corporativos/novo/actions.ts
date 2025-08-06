"use server"

import { z } from "zod"
import sql from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import crypto from "crypto"

const CreateCorporateClientSchema = z.object({
  nome_responsavel: z.string().min(3, "Nome do responsável é obrigatório."),
  email_responsavel: z.string().email("Email inválido."),
  nome_empresa: z.string().min(3, "Nome da empresa é obrigatório."),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  limite_colaboradores: z.coerce.number().min(1).max(1000),
})

type FormState =
  | {
      error?: string
      success?: boolean
      loginInfo?: {
        email: string
        senha: string
      }
    }
  | undefined

export async function createCorporateClientAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = CreateCorporateClientSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: "Dados inválidos. Verifique os campos obrigatórios." }
  }

  const { nome_responsavel, email_responsavel, nome_empresa, cnpj, telefone, endereco, limite_colaboradores } =
    validatedFields.data

  try {
    // Verificar se o email já existe
    const existingUser = await sql`SELECT id FROM usuarios WHERE email = ${email_responsavel}`
    if (existingUser.length > 0) {
      return { error: "Este email já está em uso." }
    }

    // Gerar senha temporária
    const senhaTemporaria = crypto.randomBytes(8).toString("hex")
    const senhaHash = await hashPassword(senhaTemporaria)

    let userId: string
    let empresaId: string

    try {
      await sql.begin(async (tx) => {
        const [user] = await tx`
          INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, primeiro_acesso)
          VALUES (${nome_responsavel}, ${email_responsavel}, ${senhaHash}, 'corporativo', true)
          RETURNING id
        `
        if (!user) throw new Error("Falha ao criar usuário corporativo.")
        userId = user.id

        const [empresa] = await tx`
          INSERT INTO empresas_corporativas (
            usuario_id,
            nome_empresa,
            cnpj,
            telefone,
            endereco,
            limite_colaboradores,
            status
          )
          VALUES (
            ${userId},
            ${nome_empresa},
            ${cnpj || null},
            ${telefone || null},
            ${endereco || null},
            ${limite_colaboradores},
            'ativo'
          )
          RETURNING id
        `
        if (!empresa) throw new Error("Falha ao criar empresa corporativa.")
        empresaId = empresa.id
      })
    } catch (transactionError) {
      console.error("Erro na transação:", transactionError)
      throw transactionError
    }

    return {
      success: true,
      loginInfo: {
        email: email_responsavel,
        senha: senhaTemporaria,
      },
    }
  } catch (error) {
    console.error("Erro ao criar cliente corporativo:", error)
    return { error: "Falha ao criar cliente corporativo no servidor." }
  }
}
