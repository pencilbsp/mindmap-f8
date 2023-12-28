"use client"

import { Toaster } from "sonner"
import { TooltipProvider } from "./ui/tooltip"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return (
    <>
      <NextThemesProvider {...props}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
      </NextThemesProvider>
    </>
  )
}
