import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

export default function ConviteNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Convite Não Encontrado</CardTitle>
            <CardDescription>O convite que você está tentando acessar não existe ou já expirou.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Possíveis motivos:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• O convite já foi utilizado</li>
                <li>• O convite expirou (válido por 7 dias)</li>
                <li>• O link está incorreto ou incompleto</li>
                <li>• O convite foi cancelado</li>
              </ul>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                Entre em contato com o responsável da empresa para solicitar um novo convite.
              </p>

              <Link href="/" className="block">
                <Button className="w-full bg-transparent" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
