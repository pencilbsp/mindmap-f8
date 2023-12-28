"use client"

import { ReactFlowProvider } from "reactflow"
import { MindmapProvider } from "@/contexts/MindmapContext"

export default function FlowProvider({ children, userId, initData }) {
  return (
    <ReactFlowProvider>
      <MindmapProvider initData={initData} userId={userId}>
        {children}
      </MindmapProvider>
    </ReactFlowProvider>
  )
}
