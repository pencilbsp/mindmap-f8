"use client"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function LoginButton({ children, providerName }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("next") || "/"

  const handleLogin = async () => {
    try {
      await signIn(providerName, { callbackUrl })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center bg-primary-foreground rounded-lg h-12 hover:bg-accent transition-colors border"
    >
      {children}
    </button>
  )
}
