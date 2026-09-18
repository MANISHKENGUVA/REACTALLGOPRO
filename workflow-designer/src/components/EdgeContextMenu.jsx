import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Edit3, 
  ArrowLeftRight, 
  Sparkles, 
  Copy, 
  Trash2, 
  GitBranch 
} from 'lucide-react'
import clsx from 'clsx'
import { useWorkflowStore } from '../stores/workflowStore'

export default function EdgeContextMenu({
  edge,
  position,
  onClose,
  onEditEdge
}) {
  const menuRef = useRef(null)
  const { deleteEdge, edges, addEdge, updateEdge } = useWorkflowStore()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!edge || !position) return null

  // Ensure menu stays on screen
  const screenW = window.innerWidth
  const screenH = window.innerHeight
  const left = Math.min(position.x, screenW - 220)
  const top = Math.min(position.y, screenH - 240)

  // Reverse direction
  const handleReverseDirection = () => {
    updateEdge(edge.id, {
      ...edge.data
    })
    // In xyflow / workflowStore:
    useWorkflowStore.setState(state => ({
      edges: state.edges.map(e => {
        if (e.id === edge.id) {
          return {
            ...e,
            source: edge.target,
            target: edge.source
          }
        }
        return e
      }),
      workflow: {
        ...state.workflow,
        edges: state.workflow.edges.map(we => {
          if (we.edgeId === edge.id || we.edgeId === edge.data?.edgeId) {
            return {
              ...we,
              sourceId: edge.target,
              targetId: edge.source
            }
          }
          return we
        })
      }
    }))
    onClose()
  }

  // Toggle Animated
  const handleToggleAnimated = () => {
    useWorkflowStore.setState(state => ({
      edges: state.edges.map(e => {
        if (e.id === edge.id) {
          return {
            ...e,
            animated: !e.animated
          }
        }
        return e
      })
    }))
    onClose()
  }

  // Duplicate Edge
  const handleDuplicate = () => {
    let maxNum = 0
    edges.forEach(e => {
      const match = (e.data?.edgeId || e.id)?.match(/ED(\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNum) maxNum = num
      }
    })
    const newId = `ED${String(maxNum + 1).padStart(2, '0')}`

    addEdge({
      edgeId: newId,
      sourceId: edge.source,
      targetId: edge.target,
      ruleEngine: JSON.parse(JSON.stringify(edge.data?.ruleEngine || { type: 'AND', conditions: [] })),
      metadata: JSON.parse(JSON.stringify(edge.data?.metadata || {}))
    })
    onClose()
  }

  // Delete Edge
  const handleDelete = () => {
    deleteEdge(edge.id)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed z-50 min-w-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1.5 overflow-hidden text-xs"
    >
      <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700/60 mb-1">
        <div className="flex items-center gap-1.5 font-bold font-mono text-primary-300 dark:text-primary-400">
          <GitBranch className="w-3.5 h-3.5" />
          <span>{edge.data?.edgeId || edge.id}</span>
        </div>
        <div className="text-[10px] text-gray-400 truncate mt-0.5">
          {edge.source} → {edge.target}
        </div>
      </div>

      <button
        onClick={() => {
          onEditEdge(edge)
          onClose()
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5 text-blue-500" />
        <span className="font-semibold">Edit Conditions & Rules</span>
      </button>

      <button
        onClick={handleReverseDirection}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-amber-500" />
        <span>Reverse Direction</span>
      </button>

      <button
        onClick={handleToggleAnimated}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
        <span>{edge.animated ? 'Disable Animation' : 'Enable Animation'}</span>
      </button>

      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
      >
        <Copy className="w-3.5 h-3.5 text-emerald-500" />
        <span>Duplicate Connection</span>
      </button>

      <div className="my-1 border-t border-gray-100 dark:border-gray-700/60" />

      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="font-semibold">Delete Edge</span>
      </button>
    </div>
  )
}
