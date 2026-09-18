import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactFlow } from '@xyflow/react'
import { useWorkflowStore } from '../stores/workflowStore'

/**
 * Custom hook for keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const { 
    selectedNode, 
    selectedEdge,
    deleteNode, 
    deleteEdge, 
    undo, 
    redo,
    clearSelection
  } = useWorkflowStore()
  
  const reactFlowInstance = useReactFlow()

  // Delete selected node or edge
  useHotkeys('delete, backspace', () => {
    if (selectedNode) {
      deleteNode(selectedNode.id)
    } else if (selectedEdge) {
      deleteEdge(selectedEdge.id)
    }
  }, [selectedNode, selectedEdge, deleteNode, deleteEdge])

  // Undo
  useHotkeys('ctrl+z, meta+z', (e) => {
    e.preventDefault()
    undo()
  }, [undo])

  // Redo
  useHotkeys('ctrl+shift+z, meta+shift+z, ctrl+y, meta+y', (e) => {
    e.preventDefault()
    redo()
  }, [redo])

  // Escape to deselect
  useHotkeys('escape', () => {
    clearSelection()
  }, [clearSelection])

  // Fit view
  useHotkeys('ctrl+1, meta+1', (e) => {
    e.preventDefault()
    reactFlowInstance.fitView({ padding: 0.2, duration: 300 })
  }, [reactFlowInstance])

  // Zoom in
  useHotkeys('ctrl+plus, meta+plus, ctrl+=, meta+=', (e) => {
    e.preventDefault()
    reactFlowInstance.zoomIn()
  }, [reactFlowInstance])

  // Zoom out
  useHotkeys('ctrl+minus, meta+minus', (e) => {
    e.preventDefault()
    reactFlowInstance.zoomOut()
  }, [reactFlowInstance])

  // Reset zoom
  useHotkeys('ctrl+0, meta+0', (e) => {
    e.preventDefault()
    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })
  }, [reactFlowInstance])

  return null
}
