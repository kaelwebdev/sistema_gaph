import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getClienteIdFromSession(): Promise<string | null> {
  const session = await auth()
  return session?.user?.clienteId ?? null
}

export async function requireClienteId(): Promise<string> {
  const clienteId = await getClienteIdFromSession()
  
  if (!clienteId) {
    redirect("/")
  }
  
  return clienteId
}

export async function requireAuth(): Promise<{ clienteId: string }> {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  const clienteId = session.user.clienteId
  
  if (!clienteId) {
    redirect("/")
  }
  
  return { clienteId }
}
