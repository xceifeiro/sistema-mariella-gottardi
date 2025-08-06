"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import HeaderLayoutClient from "@/components/header-layout-client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    // Chame sua API logout (você precisa criar essa rota)
    await fetch("/api/logout", {
      method: "POST",
    })

    // Redireciona para login
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      
    <HeaderLayoutClient/>
      {children}
    </div>
  )
}