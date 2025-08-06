import type React from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import HeaderLayoutCorporativo from "@/components/header-layout-corporativo"

export default async function CorporativoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.tipo_usuario !== "corporativo") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      <HeaderLayoutCorporativo userName={session.nome} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
