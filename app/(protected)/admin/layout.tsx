import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import HeaderLayoutAdmin from "@/components/header-layout-admin"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.tipo_usuario !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <HeaderLayoutAdmin userName={session.nome} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
