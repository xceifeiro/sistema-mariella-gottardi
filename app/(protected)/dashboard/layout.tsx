import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import HeaderLayoutClient from "@/components/header-layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.tipo_usuario !== "cliente") {
    redirect("/dashboard") // ou outra rota adequada
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderLayoutClient userName={session.nome} userEmail={session.email} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
