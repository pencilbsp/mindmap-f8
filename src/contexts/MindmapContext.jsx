"use client"

import { v4 } from "uuid"
import { useReactFlow, useStoreApi } from "reactflow"
import { createContext, useCallback, useEffect, useReducer, useRef } from "react"

import { upsertMindmap } from "@/actions/mindmap"
import useFlowSelect from "@/hooks/useFlowSelect"
import { getValueInLocalStorage, setValueInLocalStorage } from "@/hooks/useLocalStorage"

const STORAGE_KEY = "draft_mindmap_data"

const initialState = {
  userId: null,
  histories: [],
  isReady: false,
  autoSave: true,
  isSaving: false,
  clipboard: null,
  allowEdit: true,
  isPublic: false,
  hideToolbar: false,
  name: "",
  nodes: [],
  edges: [],
  isDraft: true,
}

const handlers = {
  READY: (state) => {
    return {
      ...state,
      isReady: true,
    }
  },
  COPY: (state, action) => {
    return {
      ...state,
      clipboard: action.payload,
    }
  },
  PASTE: (state) => {
    return {
      ...state,
      clipboard: null,
    }
  },
  AUTO_SAVE_TOGGLE: (state) => {
    return {
      ...state,
      autoSave: !state.autoSave,
    }
  },
  SAVE: (state) => {
    return { ...state, isSaving: true }
  },
  SAVE_SUCCESS: (state) => {
    return { ...state, isSaving: false }
  },
  HIDE_TOOLBAR_TOGGLE: (state) => {
    return {
      ...state,
      hideToolbar: !state.hideToolbar,
    }
  },
  RENAME: (state, action) => {
    return {
      ...state,
      name: action.payload,
    }
  },
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state)

// const getNodes = (nodeInternals) => {
//   return Array.from(nodeInternals, ([, _]) => _).map((node) => ({
//     id: node.id,
//     type: node.type,
//     data: node.data,
//     width: node.width,
//     height: node.height,
//     origin: node.origin,
//     position: node.position,
//     targetPosition: node.targetPosition,
//     sourcePosition: node.sourcePosition,
//   }))
// }

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time))

const MindmapContext = createContext({
  ...initialState,
  cutNode: () => Promise.resolve(),
  copyNode: () => Promise.resolve(),
  pasteNode: () => Promise.resolve(),
  deleteNode: () => Promise.resolve(),
  saveMindmap: () => Promise.resolve(),
  getClipboard: () => Promise.resolve(),
  toggleAutoSave: () => Promise.resolve(),
})

const MindmapProvider = ({ children, userId, initData }) => {
  const timeoutRef = useRef(null)
  const cache = getValueInLocalStorage(STORAGE_KEY)
  if (cache && cache.id === initData.id) initData = cache

  const [state, dispatch] = useReducer(reducer, { ...initialState, userId, ...initData })

  const { node } = useFlowSelect()
  const { setNodes, setEdges, getEdges, getNodes } = useReactFlow()

  const saveMindmap = useCallback(
    () => {
      if (!state.autoSave) return

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(async () => {
        dispatch({ type: "SAVE" })
        const mindmap = {
          id: state.id,
          name: state.name,
          nodes: getNodes(),
          edges: getEdges(),
          isDraft: state.isDraft,
          autoSave: state.autoSave,
        }

        if (userId) {
          await upsertMindmap(userId, mindmap)
        } else {
          setValueInLocalStorage(STORAGE_KEY, mindmap)
        }

        dispatch({ type: "SAVE_SUCCESS" })
      }, 1000)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.autoSave]
  )

  const deleteNode = useCallback(
    (id) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== id))
      setEdges((edges) => edges.filter((edge) => edge.source !== id))
    },
    [setNodes, setEdges]
  )

  const cutNode = useCallback(() => {
    if (!node) return

    dispatch({
      type: "COPY",
      payload: {
        type: "node",
        data: { ...node, selected: false },
      },
    })

    deleteNode(node.id)
  }, [node, deleteNode])

  const copyNode = useCallback(() => {
    if (!node) return

    dispatch({
      type: "COPY",
      payload: {
        type: "node",
        data: { ...node, selected: false, id: v4() },
      },
    })
  }, [node])

  const pasteNode = useCallback(() => {
    const clipboard = state.clipboard
    if (clipboard && clipboard.type === "node" && clipboard.data) {
      setNodes((nds) => nds.concat(clipboard.data))
      dispatch({ type: "PASTE" })
    }
  }, [setNodes, state.clipboard])

  const updateNodeLabel = useCallback(
    (id, label) => {
      setNodes((nds) => nds.map((nd) => (nd.id === id ? { ...nd, data: { ...nd.data, label } } : nd)))
    },
    [setNodes]
  )

  const updateEdgeLabel = useCallback(
    (id, label) => {
      setEdges((eds) => eds.map((ed) => (ed.id === id ? { ...ed, label } : ed)))
    },
    [setEdges]
  )

  const updateNodeSize = useCallback(
    (id, { width, height }) => {
      setNodes((nds) =>
        nds.map((nd) => {
          if (nd.id === id) {
            return {
              ...nd,
              width,
              height,
              data: { ...nd.data, width, height },
            }
          } else {
            return nd
          }
        })
      )
    },
    [setNodes]
  )

  const getClipboard = useCallback(() => state.clipboard, [state.clipboard])

  const toggleAutoSave = useCallback(() => dispatch({ type: "AUTO_SAVE_TOGGLE" }), [])

  const toggleHideToolbar = useCallback(() => dispatch({ type: "HIDE_TOOLBAR_TOGGLE" }), [])

  const iAmReady = useCallback(() => dispatch({ type: "READY" }), [])

  const renameMindmap = useCallback((newName) => dispatch({ type: "RENAME", payload: newName }), [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MindmapContext.Provider
      value={{
        ...state,
        cutNode,
        copyNode,
        iAmReady,
        pasteNode,
        deleteNode,
        saveMindmap,
        getClipboard,
        renameMindmap,
        toggleAutoSave,
        updateNodeSize,
        updateEdgeLabel,
        updateNodeLabel,
        toggleHideToolbar,
      }}
    >
      {children}
    </MindmapContext.Provider>
  )
}

export { MindmapContext, MindmapProvider }
