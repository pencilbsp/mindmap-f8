import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function avatarNameFallback({ name }) {
  const words = name.split(" ")
  let nameFallback = words[0][0].toLocaleUpperCase()
  if (words.length > 1) nameFallback += words[1][0].toLocaleUpperCase()

  return nameFallback
}

export function getNodeColor(color) {
  if (!color)
    return {
      bg: "bg-secondary",
      color: "bg-primary",
      className: "bg-secondary",
      border: "border-secondary",
    }

  const colors = color.split("-")

  const intensity = Number(colors[2])
  if (intensity > 100) colors[2] = intensity - 100

  const bg = `${colors.join("-")}/80`
  const border = color.replace("bg-", "border-")

  return { className: cn([bg, border]), bg, border, color }
}
