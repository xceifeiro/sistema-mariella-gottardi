import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

const protectedRoutes = ["/admin", "/dashboard", "/corporativo"]
const publicRoutes = ["/login"]

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const path = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix))
  const isPublicRoute = publicRoutes.some((prefix) => path.startsWith(prefix))

  // 1. Redirecionamento para LOGIN se não autenticado e tentando acessar rota protegida:
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  // 2. Redirecionamento para o PAINEL se autenticado e tentando acessar rota pública:
  if (session && isPublicRoute) {
    const redirectUrl =
      session.tipo_usuario === "admin"
        ? "/admin"
        : session.tipo_usuario === "corporativo"
          ? "/corporativo"
          : "/dashboard"
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
  }

  // 3. Proteção de rota baseada no TIPO DE USUÁRIO:
  if (session && path.startsWith("/admin") && session.tipo_usuario !== "admin") {
    const redirectUrl = session.tipo_usuario === "corporativo" ? "/corporativo" : "/dashboard"
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
  }

  if (session && path.startsWith("/corporativo") && session.tipo_usuario !== "corporativo") {
    const redirectUrl = session.tipo_usuario === "admin" ? "/admin" : "/dashboard"
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
  }

  if (session && path.startsWith("/dashboard") && session.tipo_usuario !== "cliente") {
    const redirectUrl =
      session.tipo_usuario === "admin"
        ? "/admin"
        : session.tipo_usuario === "corporativo"
          ? "/corporativo"
          : "/dashboard"
    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
