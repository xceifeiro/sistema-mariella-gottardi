// auth.server.ts
import { decrypt } from "./auth"

// Para APIs
export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null

  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null

  try {
    const session = await decrypt(match[1])
    return session
  } catch (err) {
    console.error("Erro ao decodificar sessão:", err)
    return null
  }
}
