"use client"

import { toast } from "sonner"
import { useTransition } from "react"
import { TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { deleteMindmap } from "@/actions/mindmap"
import LoadingButton from "@/components/LoadingButton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function DeleteButton({ id }) {
  const { refresh } = useRouter()
  const [pending, startTransition] = useTransition()

  const onClick = () =>
    startTransition(async () => {
      const result = await deleteMindmap(id)
      if (result.error) return toast.error(result.error.message)
      toast.success(result.message ?? "Đã xoá thành công")
      refresh()
    })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LoadingButton
          size="icon"
          onClick={onClick}
          variant="outline"
          isLoading={pending}
          icon={<TrashIcon className="w-4 h-4" />}
        />
      </TooltipTrigger>
      <TooltipContent>Xoá mindmap này</TooltipContent>
    </Tooltip>
  )
}
