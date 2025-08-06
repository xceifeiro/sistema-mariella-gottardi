"use client"

import { useState } from "react"
import { ColaboradorDetalhado } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import ConviteAcoes from "@/components/ConviteAcoes"

interface Props {
  colaboradores: ColaboradorDetalhado[]
}

export default function TabelaColaboradores({ colaboradores }: Props) {
  const [removendoId, setRemovendoId] = useState<string | null>(null)
  const [modalAbertoId, setModalAbertoId] = useState<string | null>(null)

  async function handleRemoverColaborador(colaboradorId: string) {
    setRemovendoId(colaboradorId)

    try {
      const res = await fetch(`/api/colaboradores/${colaboradorId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        // Feche o modal e recarregue a página
        setModalAbertoId(null)
        window.location.reload()
      } else {
        const erro = await res.json()
        alert(erro.message || "Erro ao remover colaborador.")
      }
    } catch (error) {
      console.error("Erro ao remover colaborador:", error)
      alert("Erro inesperado. Tente novamente.")
    } finally {
      setRemovendoId(null)
    }
  }

    function MeuComponente({ colaborador }: { colaborador: ColaboradorDetalhado }) {
  let statusBadge = null

  switch (colaborador.status) {
    case "pendente":
      statusBadge = (
        <span className="bg-yellow-300 hover:bg-yellow-500 text-sm px-2 py-1 rounded">
          Pendente
        </span>
      )
      break
    case "ativo":
      statusBadge = (
        <span className="bg-green-300 hover:bg-green-500 text-sm px-2 py-1 rounded">
          Ativo
        </span>
      )
      break
    default:
      statusBadge = (
        <span className="bg-red-300 hover:bg-red-500 text-sm px-2 py-1 rounded">
          Inativo
        </span>
      )
  }
  return statusBadge
}

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Colaborador</TableHead>
          <TableHead>Cargo/Departamento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Testes</TableHead>
          <TableHead>Cadastrado</TableHead>
          <TableHead className="w-[70px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colaboradores.map((colaborador) => (
          <TableRow key={colaborador.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="font-medium">{colaborador.nome}</p>
                <p className="text-sm text-muted-foreground">{colaborador.email}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                {colaborador.cargo && (
                  <p className="text-sm font-medium">{colaborador.cargo}</p>
                )}
                {colaborador.departamento && (
                  <p className="text-xs text-muted-foreground">{colaborador.departamento}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <MeuComponente colaborador={colaborador} />
            </TableCell>
            <TableCell>
              <p className="text-sm font-medium">{colaborador.total_testes} testes</p>
              {colaborador.ultimo_teste && (
                <p className="text-xs text-muted-foreground">
                  Último: {new Date(colaborador.ultimo_teste).toLocaleDateString("pt-BR")}
                </p>
              )}
            </TableCell>
            <TableCell>
              {colaborador.status === "pendente" && colaborador.convite_expira_em ? (
                <>
                  <span className="text-sm">
                    {new Date(colaborador.criado_em).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-xs text-muted-foreground bg-yellow-300 rounded ml-2 py-1 px-2">
                    Expira: {new Date(colaborador.convite_expira_em).toLocaleDateString("pt-BR")}</span>
                    <ConviteAcoes urlConvite={colaborador.urlConvite || " "} />
                </>
              ) : colaborador.status === "ativo" ? (
                <span className="text-sm">
                    {new Date(colaborador.criado_em).toLocaleDateString("pt-BR")}
                </span>
              ) : (
                <span>Teste 3</span>
              )}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                    <Link href={`/corporativo/colaboradores/${colaborador.id}/editar`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Link>
                    </DropdownMenuItem>
                    {/* ... outros itens ... */}
                    <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault() // evita que o DropdownMenu feche imediatamente
                        setModalAbertoId(colaborador.id)
                    }}
                    >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                    </DropdownMenuItem>

                    {/* Modal de confirmação */}
                    <AlertDialog
                    open={modalAbertoId === colaborador.id}
                    onOpenChange={(open) => {
                        if (!open) setModalAbertoId(null)
                    }}
                    >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja remover?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não poderá ser desfeita.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setModalAbertoId(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            type="button"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleRemoverColaborador(colaborador.id)}
                            disabled={removendoId === colaborador.id}
                        >
                            {removendoId === colaborador.id ? "Removendo..." : "Confirmar"}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
                </DropdownMenu>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
