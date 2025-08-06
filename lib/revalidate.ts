import { revalidatePath, revalidateTag } from "next/cache"

export function revalidateUserData(userId: string) {
  // Revalida todas as páginas relacionadas ao usuário
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/perfil")
  revalidatePath("/dashboard/servicos")
  revalidatePath("/dashboard/resultados")
  revalidatePath("/admin")
  revalidatePath("/admin/clientes")
  revalidatePath("/dashboard/teste-temperamentos")

  // Revalida tags específicas
  revalidateTag(`user-${userId}`)
  revalidateTag("services")
  revalidateTag("orders")
  revalidateTag("clients")
}

export function revalidateServices() {
  revalidatePath("/dashboard/servicos")
  revalidatePath("/admin/servicos")
  revalidateTag("services")
}

export function revalidateOrders() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/servicos")
  revalidatePath("/admin")
  revalidatePath("/admin/pedidos")
  revalidateTag("orders")
}
