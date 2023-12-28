"use client"

import useMediaQuery from "./useMediaQuery"
import tailwindConfig from "../../tailwind.config"
import resolveConfig from "tailwindcss/resolveConfig"

const fullConfig = resolveConfig(tailwindConfig)
const breakpoints = { xs: "0px", ...fullConfig?.theme?.screens }

// ----------------------------------------------------------------------

const getBreakpointValue = (breakpoint) => {
  const str = breakpoints?.[breakpoint]
  return str ? Number(str.replace(/(?:px|rem|em)/, "")) : Infinity
}

const breakpoint = {
  up: (breakpoint) => `(min-width:${getBreakpointValue(breakpoint)}px)`,
  down: (breakpoint) => `(max-width:${getBreakpointValue(breakpoint) - 0.05}px)`,
  between: (start, end) =>
    `(min-width:${getBreakpointValue(start)}px) and (max-width:${getBreakpointValue(end) - 0.05}px)`,
  only: (start) => {
    const index = Object.keys(breakpoints).findIndex((key) => key === start)
    const end = Object.keys(breakpoints)[index + 1]
    if (!end) return `(min-width:${getBreakpointValue(start)}px)`
    return `(min-width:${getBreakpointValue(start)}px) and (max-width:${getBreakpointValue(end) - 0.05}px)`
  },
}

export default function useResponsive(query, start, end) {
  const mediaUp = useMediaQuery(breakpoint.up(start))

  const mediaDown = useMediaQuery(breakpoint.down(start))

  const mediaBetween = useMediaQuery(breakpoint.between(start, end))

  const mediaOnly = useMediaQuery(breakpoint.only(start))

  if (query === "up") {
    return mediaUp
  }

  if (query === "down") {
    return mediaDown
  }

  if (query === "between") {
    return mediaBetween
  }

  return mediaOnly
}
