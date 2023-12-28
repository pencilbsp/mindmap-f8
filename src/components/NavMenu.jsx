"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const menus = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Giới thiệu",
    href: "/gioi-thieu",
  },
  // {
  //   title: "Tính năng",
  //   href: "/tinh-nang",
  // },
  // {
  //   title: "Bảng giá",
  //   href: "/bang-gia",
  // },
  // {
  //   title: "Liên hệ",
  //   href: "/lien-he",
  // },
  {
    title: "Mindmap của tôi",
    href: "/mindmaps",
  },
]

export default function NavMenu() {
  const pathname = usePathname()
  const isActive = (href) => pathname === href

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {menus.map((item) => (
          <NavLink key={item.href} {...item} isActive={isActive(item.href)} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function NavLink({ href, title, isActive }) {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink isActive={isActive}>{title}</NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}
