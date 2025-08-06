"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, ShoppingCart, User, Brain, Camera, FileText, LogOut, Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HeaderLayoutClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [temTodosPedidos, setTemTodosPedidos] = useState(false)
  const pathname = usePathname()

  const pedidosNecessarios = [5, 7, 8]

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await fetch("/api/pedidos")
        if (!res.ok) throw new Error("Erro ao buscar pedidos")
        const pedidos = await res.json() // Exemplo: [{ servico_id: 5 }, { servico_id: 7 }, ...]

        const codigosPedidos = [...new Set(pedidos.map((p: any) => p.servico_id))]
        const temTodos = pedidosNecessarios.every((codigo) => codigosPedidos.includes(codigo))

        setTemTodosPedidos(temTodos)
      } catch (error) {
        console.error(error)
        setTemTodosPedidos(false)
      }
    }
    fetchPedidos()
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    // O botão Serviços só aparece se NÃO tiver os 3 pedidos
    ...(!temTodosPedidos
      ? [{ name: "Serviços", href: "/dashboard/servicos", icon: ShoppingCart }]
      : []),
    { name: "Teste Temperamentos", href: "/dashboard/teste-temperamentos", icon: Brain },
    { name: "Análise Facial", href: "/dashboard/analise-facial", icon: Camera },
    { name: "Resultados", href: "/dashboard/resultados", icon: FileText },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <Brain className="w-6 h-6 text-slate-100" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-100 drop-shadow-lg">CRM 4 Temperamentos</h1>
                <p className="text-xs text-slate-200">Análise Comportamental</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white/30 text-slate-100 shadow-lg backdrop-blur-sm border border-white/20"
                      : "text-slate-200 hover:text-slate-100 hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20">
                  <Avatar className="h-10 w-10 ring-2 ring-white/30">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-slate-100">
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card border-white/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-100">Usuário</p>
                    <p className="text-xs leading-none text-slate-300">usuario@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem asChild className="text-slate-100 hover:bg-white/20">
                  <Link href="/dashboard/perfil" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-slate-100 hover:bg-white/20">
                  <Link href="/dashboard/perfil/editar" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-300 hover:bg-red-500/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-100 hover:bg-white/20"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-card rounded-2xl mt-2 border-white/20 shadow-lg">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/30 text-slate-100 shadow-lg"
                        : "text-slate-200 hover:text-slate-100 hover:bg-white/20"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Mobile User Section */}
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex items-center px-4 py-2">
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-white/30">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-slate-100">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-100">Usuário</p>
                    <p className="text-xs text-slate-300">usuario@email.com</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/perfil"
                  className="flex items-center space-x-3 px-4 py-3 text-slate-200 hover:text-slate-100 hover:bg-white/20 rounded-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/20 px-4 py-3 rounded-xl"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
