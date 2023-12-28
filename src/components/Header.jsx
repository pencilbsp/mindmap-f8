import Link from "next/link"

import Logo from "./Logo"
import NavMenu from "./NavMenu"
import { Button } from "./ui/button"
import UserAvatar from "./UserAvatar"
import MobileMenu from "./MobileMenu"
import ToggleTheme from "./ToggleTheme"

import { PATHS } from "@/configs"

export default async function Header({ user }) {
  return (
    <header className="h-[64px] border-b bg-background z-50 sticky top-0 w-full">
      <div className="container h-full flex items-center justify-between">
        <Logo />

        <NavMenu />

        <div className="flex gap-x-3 h-full items-center">
          <ToggleTheme variant="outline" />

          {user ? (
            <UserAvatar user={user} />
          ) : (
            <nav className="hidden md:flex gap-x-3 h-full items-center">
              <Button asChild variant="outline">
                <Link href={PATHS.auth.login}>Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href={PATHS.auth.register}>Đăng ký</Link>
              </Button>
            </nav>
          )}

          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  )
}
