"use client"

import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { forwardRef } from "react"

function LoadingButton({ text = "", icon, isLoading, loadingText, ...props }, ref) {
  return (
    <Button {...props} ref={ref}>
      {isLoading ? loadingText ?? text : text}
      {!isLoading && icon}
      {isLoading && <LoaderIcon className={cn("h-4 w-4 animate-spin", !!text && "ml-2")} />}
    </Button>
  )
}

export default forwardRef(LoadingButton)
