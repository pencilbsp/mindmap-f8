import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useId, useTransition } from "react"
import { Share1Icon, Link1Icon, LinkBreak1Icon } from "@radix-ui/react-icons"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import { copy } from "@/lib/clipboard"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { shareMindmap } from "@/actions/mindmap"
import RHFSwitch from "@/components/hook-form/RHFSwitch"
import FormProvider from "@/components/hook-form/FormProvider"
import useMindmap from "@/hooks/useMindmap"

export default function ShareModalButton({ mindmapId }) {
  const formId = useId()
  const [pending, startTransition] = useTransition()
  const { allowEdit, isPublic } = useMindmap()
  const methods = useForm({ defaultValues: { isPublic, allowEdit } })

  const { watch, handleSubmit } = methods

  const isStopShare = !watch("allowEdit") && !watch("isPublic")

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await shareMindmap(mindmapId, data)
      if (result.error) return toast.error(result.error.message)

      await copy(result.url)
      toast.success(isStopShare ? "Đã ngừng chia sẻ mindmap này" : "Đã sao chép liên kết chia sẻ")
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Chia sẻ <Share1Icon className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider id={formId} methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Chia sẻ bản đồ tư duy này</DialogTitle>
            <DialogDescription className="pt-2">
              Chia sẻ bản đồ tư tuy này đến với những người bạn của bạn để cùng nhau xây dựng ý tưởng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="flex items-center space-x-2 justify-between">
              <Label htmlFor="airplane-mode">Chia sẻ với tất cả mọi người</Label>
              <RHFSwitch name="isPublic" id="isPublicMode" />
            </div>
            <div className="flex items-center space-x-2 justify-between">
              <Label htmlFor="airplane-mode">Cho phép chỉnh sửa</Label>
              <RHFSwitch name="allowEdit" id="allowEditMode" />
            </div>
          </div>
          <DialogFooter>
            <Button from={formId} disabled={pending} onClick={handleSubmit(onSubmit)}>
              {isStopShare ? "Ngừng chia sẻ" : "Sao chép liên kết"}
              {pending ? (
                <LoaderIcon className="animate-spin" />
              ) : isStopShare ? (
                <LinkBreak1Icon className="ml-2" />
              ) : (
                <Link1Icon className="ml-2" />
              )}
            </Button>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
