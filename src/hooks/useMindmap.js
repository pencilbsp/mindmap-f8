import { useContext } from "react"
//
import { MindmapContext } from "@/contexts/MindmapContext"

// ----------------------------------------------------------------------

const useMindmap = () => {
  const context = useContext(MindmapContext)

  if (!context) throw new Error("Mindmap context must be use inside MindmapProvider")

  return context
}

export default useMindmap
