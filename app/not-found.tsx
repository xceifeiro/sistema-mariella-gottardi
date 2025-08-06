import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-8 p-4 text-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <FileQuestion className="h-24 w-24 text-muted-foreground" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Página Não Encontrada</h1>
        <p className="max-w-md text-muted-foreground">
          Oops! Parece que a página que você está procurando não existe ou foi movida.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Voltar para o Início</Link>
        </Button>
        {/* Você pode adicionar um botão para voltar à página anterior, se fizer sentido */}
        {/* <Button onClick={() => window.history.back()}>Voltar</Button> */}
        {/* Nota: window.history.back() requereria 'use client' no topo do arquivo */}
      </div>
      <p className="text-xs text-muted-foreground">
        Se você acredita que isso é um erro, por favor, entre em contato com o suporte.
      </p>
    </div>
  )
}
