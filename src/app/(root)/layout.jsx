import "../globals.css"

import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
// components
import Header from "@/components/Header"
import { ThemeProvider } from "@/components/ThemeProvider"
import NextAuthProvider from "@/components/NextAuthProvider"
// lib
import { SITE_NAME } from "@/configs"
import { authOptions } from "@/lib/auth"

const interFont = Inter({ subsets: ["vietnamese"] })

export const metadata = {
  title: SITE_NAME,
  description: "Generated by create next app",
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={interFont.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextAuthProvider session={session}>
            <Header user={session?.user} />
            {children}
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}