import { useReactFlow } from "reactflow"
import { TrashIcon, Pencil2Icon, CopyIcon, ScissorsIcon, RotateCounterClockwiseIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarContent,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
} from "@/components/ui/menubar"
import { useCallback } from "react"
import useMindmap from "@/hooks/useMindmap"

export const shapes = {
  Default: "",
  Pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  Triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
  Circle: "ellipse(50% 50% at 50% 50%)",
  RightArrow: "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
  Start: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  Rhombus: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
}
const colorVariants = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-gray-500",
]

export default function NodeToolbar({ id, data, onEdit }) {
  const { setNodes, setEdges } = useReactFlow()
  const { deleteNode, copyNode, cutNode } = useMindmap()

  const onChangeData = useCallback(
    (type, data) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, [type]: data },
            }
          } else {
            return node
          }
        })
      )
    },
    [id, setNodes]
  )

  const isSelect = (color) => color === data.color

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Hình dạng</MenubarTrigger>
        <MenubarContent>
          {Object.keys(shapes).map((key) => (
            <MenubarCheckboxItem checked={key === data.shape} key={key} onClick={() => onChangeData("shape", key)}>
              {key}
              <MenubarShortcut>
                <div className={cn("w-4 h-4", data.color ?? "bg-muted-foreground")} style={{ clipPath: shapes[key] }} />
              </MenubarShortcut>
            </MenubarCheckboxItem>
          ))}
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        {/* Colors */}
        <MenubarTrigger>Màu sắc</MenubarTrigger>
        <MenubarContent className="flex gap-x-2 p-2.5">
          {colorVariants.map((color) => (
            <button
              key={color}
              onClick={() => onChangeData("color", color)}
              className={cn([
                "h-8 w-8 rounded-full cursor-pointer opacity-60",
                isSelect(color) && "outline outline-2 outline-border outline-offset-2 opacity-100",
                color,
              ])}
            />
          ))}
        </MenubarContent>
      </MenubarMenu>

      {/* Actions */}
      <MenubarMenu>
        <MenubarTrigger>Hành động</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => deleteNode(id)}>
            Xoá
            <MenubarShortcut>
              <TrashIcon />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onEdit}>
            Sửa
            <MenubarShortcut>
              <Pencil2Icon />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={cutNode}>
            Cắt
            <MenubarShortcut>
              <ScissorsIcon />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              let rotation = (data.rotation ?? 0) + 45
              if (rotation === 360) rotation = 0
              onChangeData("rotation", rotation)
            }}
          >
            Xoay 45%
            <MenubarShortcut>
              <RotateCounterClockwiseIcon className="transform -scale-x-100" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onClick={() => {
              let rotation = (data.rotation ?? 360) - 45
              if (rotation === -360) rotation = 0
              onChangeData("rotation", rotation)
            }}
          >
            Xoay -45%
            <MenubarShortcut>
              <RotateCounterClockwiseIcon />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={copyNode}>
            Sao chép
            <MenubarShortcut>
              <CopyIcon />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
