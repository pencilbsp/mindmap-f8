import Link from "next/link"

import { cn } from "@/lib/utils"
import { PATHS } from "@/configs"

export default function Logo({ className }) {
  return (
    <Link href={PATHS.home} className={cn("font-extrabold text-xl text-violet-500 flex items-center", className)}>
      Mindmap Flow
    </Link>
  )
}
