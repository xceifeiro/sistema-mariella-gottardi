"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Search, Plus, Mail, Calendar, Eye, Edit, UserCheck, UserX, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string | null
  data_nascimento: string | null
  genero: string | null
  documento: string | null
  status: string
  data_cadastro: string
  total_pedidos: number
  ultimo_pedido: string | null
  status_ultimo_pedido: string | null
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClientes() {
      try {
        setLoading(true)
        setError(null)

        console.log("Carregando clientes...")
        const response = await fetch("/api/admin/clientes", {
          cache: "no-store",
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erro HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log("Dados recebidos:", data)

        setClientes(data)
        setFilteredClientes(data)
      } catch (err) {
        console.error("Erro ao carregar clientes:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    loadClientes()
  }, [])

  useEffect(() => {
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.documento && cliente.documento.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredClientes(filtered)
  }, [searchTerm, clientes])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Ativo
          </Badge>
        )
      case "inativo":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Inativo
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPedidoStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Sem pedidos</Badge>

    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Em Andamento
          </Badge>
        )
      case "concluido":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Concluído
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getGeneroLabel = (genero: string | null) => {
    if (!genero) return "N/A"
    switch (genero) {
      case "masculino":
        return "Masculino"
      case "feminino":
        return "Feminino"
      case "outro":
        return "Outro"
      default:
        return genero
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">Erro ao Carregar Clientes</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
                <Button variant="outline" asChild>
                  <Link href="/api/admin/clientes/debug">Debug API</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Clientes</h1>
          <p className="text-muted-foreground text-white/70">Gerencie todos os clientes do sistema</p>
        </div>
        <Link href="/admin/clientes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.filter((c) => c.status === "ativo").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Pedidos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.filter((c) => c.total_pedidos > 0).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.reduce((sum, c) => sum + Number(c.total_pedidos), 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
          <CardDescription>Encontre clientes por nome, email ou documento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
          <CardDescription>Todos os clientes cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Gênero</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{cliente.nome}</span>
                          {cliente.documento && (
                            <span className="text-xs text-muted-foreground">{cliente.documento}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{cliente.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{cliente.telefone || "N/A"}</TableCell>
                      <TableCell>{getGeneroLabel(cliente.genero)}</TableCell>
                      <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary">{cliente.total_pedidos}</Badge>
                          {cliente.status_ultimo_pedido && getPedidoStatusBadge(cliente.status_ultimo_pedido)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(cliente.ultimo_pedido)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/clientes/${cliente.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/clientes/${cliente.id}/editar`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
