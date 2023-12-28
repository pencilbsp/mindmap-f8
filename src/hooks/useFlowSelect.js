import { useState } from "react"
import { useOnSelectionChange } from "reactflow"

export default function useFlowSelect() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNode(nodes[0])
      setSelectedEdge(edges[0])
    },
  })

  return { node: selectedNode, edge: selectedEdge }
}
