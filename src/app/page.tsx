import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LandingPage from "./(public)/page"

export default async function HomePage() {
  const session = await auth()

  // If user is authenticated and is ADMIN, redirect to dashboard
  if (session?.user?.role === "ADMIN") {
    redirect("/dashboard")
  }

  // Otherwise, show the public landing page
  return <LandingPage />
}
