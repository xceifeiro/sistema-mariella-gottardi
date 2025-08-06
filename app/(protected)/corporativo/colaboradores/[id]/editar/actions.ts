"use server"

import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import sql from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function editarColaborador(formData: FormData) {
  try {
    const session = await getSession()
    if (!session || session.tipo_usuario !== "corporativo") {
      throw new Error("Não autorizado")
    }

    // Buscar empresa do usuário
    const [empresa] = await sql`
      SELECT id FROM empresas_corporativas 
      WHERE usuario_id = ${session.sub}
    `

    if (!empresa) {
      throw new Error("Empresa não encontrada")
    }

    const colaboradorId = formData.get("colaboradorId") as string
    const nome = formData.get("nome") as string
    const email = formData.get("email") as string
    const cargo = formData.get("cargo") as string
    const departamento = formData.get("departamento") as string
    const status = formData.get("status") as string

    // Validações
    if (!colaboradorId || !nome || !email) {
      throw new Error("Dados obrigatórios não preenchidos")
    }

    // Verificar se o colaborador pertence à empresa
    const [colaboradorExistente] = await sql`
      SELECT id, email as email_atual FROM colaboradores_corporativos 
      WHERE id = ${colaboradorId} AND empresa_id = ${empresa.id}
    `

    if (!colaboradorExistente) {
      throw new Error("Colaborador não encontrado")
    }

    // Verificar se o email já está em uso (se foi alterado)
    if (email !== colaboradorExistente.email_atual) {
      const [emailExistente] = await sql`
        SELECT id FROM colaboradores_corporativos 
        WHERE email = ${email} AND id != ${colaboradorId}
      `

      if (emailExistente) {
        throw new Error("Este email já está sendo usado por outro colaborador")
      }

      // Verificar se o email já existe na tabela de usuários
      const [usuarioExistente] = await sql`
        SELECT id FROM usuarios WHERE email = ${email}
      `

      if (usuarioExistente) {
        throw new Error("Este email já está cadastrado no sistema")
      }
    }

    // Atualizar colaborador
    await sql`
      UPDATE colaboradores_corporativos 
      SET 
        nome = ${nome},
        email = ${email},
        cargo = ${cargo || null},
        departamento = ${departamento || null},
        status = ${status},
        atualizado_em = NOW()
      WHERE id = ${colaboradorId} AND empresa_id = ${empresa.id}
      RETURNING = success
    `
    await sql`
        UPDATE usuarios
        SET
            nome = ${nome},
            email = ${email},
            atualizado_em = NOW()
         WHERE id = (
          SELECT usuario_id FROM colaboradores_corporativos 
          WHERE id = ${colaboradorId}
        )
        AND EXISTS (
          SELECT 1 FROM colaboradores_corporativos 
          WHERE id = ${colaboradorId} AND usuario_id IS NOT NULL
        )
    `

    // Se o colaborador já tem usuário e o email foi alterado, atualizar também
    if (email !== colaboradorExistente.email_atual) {
      await sql`
        UPDATE usuarios 
        SET 
          email = ${email},
          nome = ${nome},
          atualizado_em = NOW()
        WHERE id = (
          SELECT usuario_id FROM colaboradores_corporativos 
          WHERE id = ${colaboradorId}
        )
        AND EXISTS (
          SELECT 1 FROM colaboradores_corporativos 
          WHERE id = ${colaboradorId} AND usuario_id IS NOT NULL
        )
      `
    }

    console.log(`===== COLABORADOR EDITADO =====`)
    console.log(`ID: ${colaboradorId}`)
    console.log(`Nome: ${nome}`)
    console.log(`Email: ${email}`)
    console.log(`Cargo: ${cargo}`)
    console.log(`Departamento: ${departamento}`)
    console.log(`Status: ${status}`)
    console.log(`Empresa: ${empresa.id}`)
    console.log(`===============================`)

    revalidatePath("/corporativo/colaboradores")
    revalidatePath(`/corporativo/colaboradores/${colaboradorId}/editar`)
  } catch (error) {
    console.error("Erro ao editar colaborador:", error)
    throw error
  }

  redirect("/corporativo/colaboradores?message=Colaborador editado com sucesso!")
}
