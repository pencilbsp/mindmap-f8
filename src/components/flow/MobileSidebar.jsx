import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useMindmap from "@/hooks/useMindmap"
import { CursorTextIcon } from "@radix-ui/react-icons"

export function MobileSidebar() {
  const { toggleAutoSave, toggleHideToolbar, autoSave, hideToolbar } = useMindmap()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex sm:hidden" variant="outline">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" alignOffset={0} align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PlusIcon className="mr-2 h-4 w-4" />
            Tạo mới
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CursorTextIcon className="mr-2 h-4 w-4" />
            Đổi tên
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked={autoSave} onCheckedChange={toggleAutoSave}>
            Tự động lưu
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={hideToolbar} onCheckedChange={toggleHideToolbar}>
            Ẩn thanh thanh công cụ
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
