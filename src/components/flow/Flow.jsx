"use client"

import "reactflow/dist/style.css"
import { v4 as uuidv4 } from "uuid"

import { useCallback, useRef } from "react"
import ReactFlow, { Background, Controls, addEdge, useEdgesState, useNodesState, useReactFlow } from "reactflow"

import CustomNode from "./CustomNode"
import CustomEdge from "./CustomEdge"
import useMindmap from "@/hooks/useMindmap"
import useClipboard from "@/hooks/useClipboard"

const nodeTypes = { CustomNode }
const edgeTypes = { CustomEdge }

export const createNode = (id, label, options = {}) => {
  return {
    id: id,
    position: options.position,
    type: options.type ?? "CustomNode",
    origin: options.origin ?? [0.5, 0.0],
    targetPosition: options.targetPosition ?? "left",
    sourcePosition: options.sourcePosition ?? "right",
    data: {
      label: label,
      width: options.width ?? 100,
      height: options.height ?? 64,
      shape: options.shape ?? "Default",
    },
  }
}

const initialNodes = [
  {
    id: "horizontal-1",
    type: "CustomNode",
    sourcePosition: "right",
    data: { label: "Input", color: "bg-red-500", shape: "Circle", width: 100, height: 64 },
    position: { x: 0, y: 80 },
  },
  {
    id: "horizontal-2",
    type: "CustomNode",
    sourcePosition: "right",
    targetPosition: "left",
    data: { label: "A Node", color: "bg-red-500", shape: "Circle", width: 100, height: 64 },
    position: { x: 250, y: 0 },
  },
  {
    id: "horizontal-3",
    type: "CustomNode",
    sourcePosition: "right",
    targetPosition: "left",
    data: { label: "A Node", color: "bg-red-500", shape: "Circle", width: 100, height: 64 },
    position: { x: 450, y: 20 },
  },
]

const initialEdges = [
  {
    type: "CustomEdge",
    id: "horizontal-e1-2",
    source: "horizontal-1",
    target: "horizontal-2",
    label: "Hello",
    style: { type: "bezier", animated: true },
  },
  {
    type: "CustomEdge",
    id: "horizontal-e2-3",
    source: "horizontal-2",
    target: "horizontal-3",
    label: "Hello 2",
    style: { type: "bezier", animated: true },
  },
]

export default function Flow() {
  const connectingNodeId = useRef(null)
  const {
    nodes: initNodes,
    edges: initEdges,
    saveMindmap,
    allowEdit,
    copyNode,
    cutNode,
    pasteNode,
    iAmReady,
  } = useMindmap()
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes ?? [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges ?? [])

  const { screenToFlowPosition } = useReactFlow()

  useClipboard("cut", cutNode)
  useClipboard("copy", copyNode)
  useClipboard("paste", pasteNode)

  const onConnectStart = useCallback(
    (_, { nodeId }) => {
      if (allowEdit) connectingNodeId.current = nodeId
    },
    [allowEdit]
  )

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current || !allowEdit) return
      const targetIsPane = event.target.classList.contains("react-flow__pane")

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = uuidv4()
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
        const newNode = createNode(id, "New Node", { position })
        const newEdge = { id, source: connectingNodeId.current, target: id, type: "CustomEdge" }

        setNodes((nds) => nds.concat(newNode))
        setEdges((eds) => eds.concat(newEdge))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenToFlowPosition, allowEdit]
  )

  const onConnect = useCallback(
    (params) => {
      if (allowEdit) {
        connectingNodeId.current = null
        setEdges((eds) => addEdge({ ...params, type: "CustomEdge" }, eds))
      }
    },
    [setEdges, allowEdit]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const shape = event.dataTransfer.getData("application/reactflow")

      // check if the dropped element is valid
      if (typeof shape === "undefined" || !shape) return

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const defaultSize = 60
      const position = screenToFlowPosition({
        x: event.clientX - defaultSize / 2,
        y: event.clientY - defaultSize / 2,
      })

      const id = uuidv4()
      const newNode = createNode(id, "New Node", { position, shape, width: defaultSize, height: defaultSize })

      setNodes((nds) => nds.concat(newNode))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenToFlowPosition]
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onDrop={onDrop}
        onInit={iAmReady}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edgesUpdatable={allowEdit}
        nodesDraggable={allowEdit}
        nodesConnectable={allowEdit}
        elementsSelectable={allowEdit}
        onDragOver={onDragOver}
        onConnectEnd={onConnectEnd}
        onNodesChange={(changes) => {
          onNodesChange(changes)
          saveMindmap({ nodes: changes })
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes)
          saveMindmap({ edges: changes })
        }}
        onConnectStart={onConnectStart}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
