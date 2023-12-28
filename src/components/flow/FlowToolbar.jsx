"use client"

import Link from "next/link"
import { toast } from "sonner"
import { useTransition } from "react"
import { usePathname } from "next/navigation"
import { LockClosedIcon, PlusIcon } from "@radix-ui/react-icons"
import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"

import Logo from "@/components/Logo"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import UserAvatar from "@/components/UserAvatar"
import ToggleTheme from "@/components/ToggleTheme"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { PATHS } from "@/configs"
import useMindmap from "@/hooks/useMindmap"
import LoadingButton from "../LoadingButton"
import { MobileSidebar } from "./MobileSidebar"
import ShareModalButton from "./ShareModalButton"
import useResponsive from "@/hooks/useResponsive"
import { renameMindmap } from "@/actions/mindmap"

export default function FlowToolbar({ user, mindmapId }) {
  const [, startTransition] = useTransition()
  const { name, autoSave, toggleAutoSave, isSaving, allowEdit } = useMindmap()
  const pathname = usePathname()
  const loginUrl = `${PATHS.auth.login}?next=${encodeURIComponent(pathname)}`

  const isMobile = useResponsive("down", "sm")

  const onBlur = (e) =>
    startTransition(async () => {
      const newName = e.target.value
      if (name === newName) return
      if (newName === "") return (e.target.value = name)
      const result = await renameMindmap(mindmapId, newName)
      if (result.error) return toast.error(result.error.message)
      if (result.success) toast.success("Đã đổi tên bản đồ tư duy")
    })

  const onKeyDown = (e) => {
    if (["Enter", "Escape"].includes(e.key)) {
      e.target.blur()
    }
  }

  return (
    <div className="flex gap-x-3 items-center justify-between w-full h-16 border-b bg-background dark:bg-zinc-900 px-4">
      <div className="flex gap-x-3">
        <Logo className="hidden lg:flex" />

        <MobileSidebar />

        <div className="hidden lg:flex items-center h-9 rounded-sm px-3 bg-secondary">
          <input
            onBlur={onBlur}
            defaultValue={name}
            onKeyDown={onKeyDown}
            placeholder="Bản đồ tư duy chưa có tên"
            className="outline-none bg-transparent mr-1"
          />

          {!allowEdit && <LockClosedIcon />}
        </div>

        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <Switch id="public-mode" checked={autoSave} onCheckedChange={toggleAutoSave} disabled={!allowEdit} />
              <Label htmlFor="public-mode">Tự động lưu</Label>
            </div>

            {autoSave ? (
              <LoadingButton
                text="Đã lưu"
                variant="secondary"
                isLoading={isSaving}
                loadingText="Đang lưu"
                icon={<CheckCircledIcon className="ml-2" />}
              />
            ) : (
              <LoadingButton
                text="Lưu"
                variant="secondary"
                isLoading={isSaving}
                loadingText="Đang lưu"
                icon={<CheckCircledIcon className="ml-2" />}
              />
            )}

            {!isMobile && <ShareModalButton mindmapId={mindmapId} />}
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" asChild>
                <Link href={loginUrl}>
                  Lưu <ExclamationTriangleIcon className="ml-2" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Đăng nhập để lưu bản đồ tư duy này</p>
            </TooltipContent>
          </Tooltip>
        )}

        {user && (
          <Button asChild variant="secondary">
            <Link href={PATHS.mindmap}>
              Tạo mới
              <PlusIcon className="ml-2" />
            </Link>
          </Button>
        )}
      </div>

      <div className="flex space-x-3 items-center">
        <ToggleTheme variant="secondary" />
        {user ? (
          <UserAvatar user={user} />
        ) : (
          <Button asChild>
            <Link href={loginUrl}>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
