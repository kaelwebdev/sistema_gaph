import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getCondominiumIdFromSession(): Promise<string | null> {
  const session = await auth()
  return session?.user?.condominiumId ?? null
}

export async function requireCondominiumId(): Promise<string> {
  const condominiumId = await getCondominiumIdFromSession()
  
  if (!condominiumId) {
    redirect("/")
  }
  
  return condominiumId
}

export async function requireAuth(): Promise<{ condominiumId: string }> {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }
  
  const condominiumId = session.user.condominiumId
  
  if (!condominiumId) {
    redirect("/")
  }

  return { condominiumId }
}