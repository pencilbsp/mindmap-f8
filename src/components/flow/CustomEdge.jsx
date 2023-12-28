import {
  BaseEdge,
  StepEdge,
  BezierEdge,
  StraightEdge,
  getBezierPath,
  SmoothStepEdge,
  EdgeLabelRenderer,
} from "reactflow"

import useMindmap from "@/hooks/useMindmap"

const getLabelStyle = (labelX, labelY) => ({
  pointerEvents: "all",
  transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
})

export default function CustomEdge({ id, selected, label, style = {}, markerEnd, ...others }) {
  const { updateEdgeLabel, allowEdit } = useMindmap()
  const [edgePath, labelX, labelY] = getBezierPath({ ...others })

  const onBlur = (event) => {
    const newLabel = event.target?.textContent
    if (label !== newLabel) updateEdgeLabel(id, newLabel)
  }

  return (
    <>
      {style.type === "step" ? (
        <StepEdge {...others} markerEnd={markerEnd} />
      ) : style.type === "bezier" ? (
        <BezierEdge {...others} markerEnd={markerEnd} />
      ) : style.type === "straight" ? (
        <StraightEdge {...others} markerEnd={markerEnd} />
      ) : style.type === "smoothstep" ? (
        <SmoothStepEdge {...others} markerEnd={markerEnd} />
      ) : (
        <BaseEdge path={edgePath} markerEnd={markerEnd} />
      )}

      {(label || selected) && (
        <EdgeLabelRenderer>
          <span
            onBlur={onBlur}
            contentEditable={allowEdit}
            suppressContentEditableWarning
            style={getLabelStyle(labelX, labelY)}
            className="absolute nodrag nopan border px-1 text-xs rounded bg-background text-muted-foreground focus:outline-none cursor-text focus:border-ring"
          >
            {label ?? ""}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
