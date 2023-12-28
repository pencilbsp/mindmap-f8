"use client"
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"

import { Button } from "./ui/button"
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"

export default function MobileMenu({ user }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex lg:hidden px-2.5 flex-col justify-center items-center">
          <div className="w-[14px] h-[1.5px] bg-gray-600 dark:bg-gray-50 -translate-y-[3.5px]" />
          <div className="w-[14px] h-[1.5px] bg-gray-600 dark:bg-gray-50 translate-y-[3.5px]" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex-1">
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </SheetDescription>
        </SheetHeader>

        {!user && (
          <div className="flex gap-3">
            <Button className="flex-1" asChild variant="outline">
              <LoginLink>Đăng nhập</LoginLink>
            </Button>
            <Button className="flex-1" asChild>
              <RegisterLink>Đăng ký</RegisterLink>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
