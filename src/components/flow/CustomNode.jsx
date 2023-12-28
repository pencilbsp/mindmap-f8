import { twj } from "tw-to-css"
import { memo, useRef, forwardRef, useState } from "react"
import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow"

import useMindmap from "@/hooks/useMindmap"
import { cn, getNodeColor } from "@/lib/utils"
import CustomNodeToolbar, { shapes } from "./NodeToolbar"

const getShapeStyle = ({ shape }, type) => {
  const style = { clipPath: shapes[shape] }
  if (type === "border") return style

  style.top = "1px"
  style.left = "1px"
  style.width = "calc(100% - 2px)"
  style.height = "calc(100% - 2px)"
  return style
}

const NodeShape = forwardRef(({ onDoubleClick, data, color, children, editMode }, ref) => {
  return (
    <div
      ref={ref}
      onDoubleClick={onDoubleClick}
      style={{ ...getShapeStyle(data, "border") }}
      className={cn(["relative inline-block w-full h-full z-20", color.color])}
    >
      {!editMode && <div className="z-20 absolute inset-0" />}
      <div
        style={{ ...getShapeStyle(data) }}
        className={cn("absolute flex justify-center items-center inset-0 z-10", color.bg)}
      >
        {children}
      </div>
    </div>
  )
})

NodeShape.displayName = "NodeShape"

const NodeEdit = forwardRef(({ editMode, children, onUpdate }, ref) => {
  const onBlur = (event) => {
    const label = event.target.textContent
    if (label !== children) onUpdate(label)
  }

  return (
    <div
      ref={ref}
      contentEditable
      onBlur={onBlur}
      suppressContentEditableWarning
      className={cn("focus:outline-none w-full text-center px-2 text-xs", editMode && "cursor-text nodrag")}
    >
      {children}
    </div>
  )
})

NodeEdit.displayName = "NodeEdit"

const CustomNode = ({ data, selected, id }) => {
  const editRef = useRef(null)
  const shapeRef = useRef(null)
  const [editMode, setEditMode] = useState(false)
  const { updateNodeLabel, updateNodeSize } = useMindmap()

  const nodeColor = getNodeColor(data.color)

  const onDoubleClick = () => {
    setEditMode(true)
    editRef.current.blur()
    editRef.current.focus()
  }

  const onResize = (_, params) => updateNodeSize(id, params)

  const onUpdate = (label) => {
    setEditMode(false)
    updateNodeLabel(id, label)
  }

  return (
    <div
      style={{
        width: data.width,
        height: data.height,
        ...(data.rotation && {
          transform: `rotate(${data.rotation}deg)`,
        }),
      }}
    >
      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition}>
        <CustomNodeToolbar data={data} id={id} onEdit={onDoubleClick} />
      </NodeToolbar>

      <NodeResizer onResize={onResize} isVisible={selected} lineStyle={twj(nodeColor.border)} />
      <Handle type="target" position={Position.Left} />

      {/* {data.shape !== "Default" ? (
        <NodeShape ref={shapeRef} editMode={editMode} onDoubleClick={onDoubleClick} data={data} color={nodeColor}>
          <NodeEdit ref={editRef} editMode={editMode} onUpdate={onUpdate}>
            {data.label}
          </NodeEdit>
        </NodeShape>
      ) : (
        <div className={cn("flex h-full p-2 justify-center items-center border rounded", nodeColor.className)}>
          <NodeEdit ref={editRef} editMode={editMode} onUpdate={onUpdate}>
            {data.label}
          </NodeEdit>
        </div>
      )} */}
      <NodeShape ref={shapeRef} editMode={editMode} onDoubleClick={onDoubleClick} data={data} color={nodeColor}>
        <NodeEdit ref={editRef} editMode={editMode} onUpdate={onUpdate}>
          {data.label}
        </NodeEdit>
      </NodeShape>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default memo(CustomNode)
