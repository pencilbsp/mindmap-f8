"use client"

import { motion } from "framer-motion"
import { useReactFlow } from "reactflow"
import { useEffect, useState } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BorderSolidIcon, CornerBottomLeftIcon, ValueIcon, BoxIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { shapes } from "./NodeToolbar"
import useFlowSelect from "@/hooks/useFlowSelect"
import useMindmap from "@/hooks/useMindmap"

const lines = {
  straight: <BorderSolidIcon className="w-6 h-6" />,
  step: <BoxIcon className="w-6 h-6" />,
  smoothstep: <CornerBottomLeftIcon className="w-6 h-6" />,
  bezier: <ValueIcon className="w-6 h-6" />,
}

const ShapeDemo = ({ value }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", value)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <motion.li
      draggable
      onDragStart={onDragStart}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      style={{ clipPath: shapes[value] }}
      transition={{ type: "spring", duration: 0.1 }}
      className={cn("w-10 h-10 bg-muted-foreground cursor-pointer transition-transform shadow")}
    />
  )
}

const EdgeType = ({ id, onChange, defaultType }) => {
  const [type, setType] = useState(defaultType)

  const onChangeType = (_type) => {
    setType(_type)
    onChange(_type)
  }

  useEffect(() => {
    if (defaultType !== type) setType(defaultType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <ul className="flex flex-col gap-3 w-full items-center pt-3 px-3">
      {Object.keys(lines).map((line) => {
        return (
          <Tooltip key={line}>
            <TooltipTrigger asChild>
              <li
                className={cn(
                  "capitalize h-8 w-8 items-center justify-between cursor-pointer border border-dashed rounded",
                  type === line && "border-solid border-primary"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onChangeType(line)}
                  className={cn(
                    "flex w-full h-full p-1.5 justify-center items-center opacity-50",
                    type === line && "opacity-100"
                  )}
                >
                  {lines[line]}
                </motion.div>
              </li>
            </TooltipTrigger>
            <TooltipContent className=" capitalize">{line}</TooltipContent>
          </Tooltip>
        )
      })}
    </ul>
  )
}

export default function Collaborative() {
  const { hideToolbar } = useMindmap()
  const { setEdges } = useReactFlow()
  const { edge } = useFlowSelect()

  const handleChangeEdgeType = (edgeType) => {
    if (!edge) return

    setEdges((edges) =>
      edges.map((_edge) =>
        _edge.id === edge.id
          ? {
              ..._edge,
              style: { ..._edge.style, type: edgeType },
            }
          : _edge
      )
    )
  }

  if (hideToolbar) return null

  return (
    <div className="flex flex-col gap-3 border-r border-dashed py-4 bg-background dark:bg-zinc-900 divide-y divide-dashed">
      <ul className="flex flex-col gap-y-3 items-center px-3">
        {Object.keys(shapes).map((key) => (
          <ShapeDemo key={key} value={key} />
        ))}
      </ul>

      {edge && <EdgeType id={edge.id} defaultType={edge.style?.type} onChange={handleChangeEdgeType} />}
    </div>
  )
}
