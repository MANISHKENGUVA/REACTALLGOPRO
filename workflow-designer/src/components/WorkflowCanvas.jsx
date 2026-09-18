import { useState, useCallback, useEffect } from 'react'
import { 
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
  useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import WorkflowNode from './WorkflowNode'
import WorkflowEdge from './WorkflowEdge'
import EdgeContextMenu from './EdgeContextMenu'
import EdgeCreationModal from './EdgeCreationModal'
import { useWorkflowStore } from '../stores/workflowStore'

// Node and edge types
const nodeTypes = {
  workflowNode: WorkflowNode
}

const edgeTypes = {
  workflowEdge: WorkflowEdge
}

// Minimap node color function
const minimapNodeColor = (node) => {
  const colors = {
    FORM: '#4455E8',
    SYSTEM: '#7C45F8',
    WAIT: '#F5A800',
    TERMINAL: node.data?.terminalState === 'APPROVED' ? '#00BA6E' : '#F5381E'
  }
  return colors[node.data?.nodeType] || '#6674F4'
}

function WorkflowCanvas() {
  const { 
    nodes: storeNodes, 
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    setSelectedNode,
    setSelectedEdge,
    selectedNode,
    theme,
    addEdge,
    updateNode,
    updateNodePosition,
    deleteNode,
    deleteEdge,
    reconnectEdge
  } = useWorkflowStore()
  const { setCenter } = useReactFlow()

  // Local state for React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges)

  // Context menu state for edges
  const [edgeContextMenu, setEdgeContextMenu] = useState(null)

  // Modal state for edge creation / editing
  const [edgeModal, setEdgeModal] = useState({
    isOpen: false,
    edgeToEdit: null,
    initialSource: '',
    initialTarget: ''
  })

  // Sync store nodes to local state when storeNodes changes externally
  useEffect(() => {
    setNodes(storeNodes)
  }, [storeNodes, setNodes])

  // Sync store edges to local state
  useEffect(() => {
    setEdges(storeEdges)
  }, [storeEdges, setEdges])

  // Keep selection visually synchronized without camera hijacking
  useEffect(() => {
    setNodes(currentNodes => currentNodes.map(candidate => ({
      ...candidate,
      selected: selectedNode ? candidate.id === selectedNode.id : false
    })))
  }, [selectedNode, setNodes])

  // Explicit focus request (e.g., clicking node in sidebar or creating a new node)
  useEffect(() => {
    const handleFocusNode = (e) => {
      const { nodeId } = e.detail || {}
      if (!nodeId) return
      const targetNode = storeNodes.find(n => n.id === nodeId)
      if (targetNode) {
        setCenter(
          targetNode.position.x + (targetNode.measured?.width || 250) / 2,
          targetNode.position.y + (targetNode.measured?.height || 150) / 2,
          { zoom: 1, duration: 350 }
        )
      }
    }
    window.addEventListener('workflow-focus-node', handleFocusNode)
    return () => window.removeEventListener('workflow-focus-node', handleFocusNode)
  }, [storeNodes, setCenter])

  // Handle custom context menu triggered from edge label
  useEffect(() => {
    const handleCustomEdgeContextMenu = (e) => {
      const { edgeId, clientX, clientY } = e.detail || {}
      const targetEdge = edges.find(ed => ed.id === edgeId)
      if (targetEdge) {
        setEdgeContextMenu({
          edge: targetEdge,
          position: { x: clientX, y: clientY }
        })
      }
    }
    window.addEventListener('workflow-edge-contextmenu', handleCustomEdgeContextMenu)
    return () => window.removeEventListener('workflow-edge-contextmenu', handleCustomEdgeContextMenu)
  }, [edges])

  // Handle node changes from React Flow
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    
    // Handle node deletion from canvas
    changes.forEach(change => {
      if (change.type === 'remove') {
        deleteNode(change.id)
      }
    })
  }, [onNodesChange, deleteNode])

  // Persist node position when dragging ends
  const onNodeDragStop = useCallback((event, node) => {
    if (node?.id && node?.position) {
      updateNodePosition(node.id, node.position)
    }
  }, [updateNodePosition])

  // Handle edge changes
  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes)
    
    // Handle edge deletion from canvas
    changes.forEach(change => {
      if (change.type === 'remove') {
        deleteEdge(change.id)
      }
    })
  }, [onEdgesChange, deleteEdge])

  // Handle edge reconnection (readjusting endpoints)
  const onReconnect = useCallback((oldEdge, newConnection) => {
    if (oldEdge?.id && newConnection?.source && newConnection?.target) {
      reconnectEdge(oldEdge.id, newConnection.source, newConnection.target)
    }
  }, [reconnectEdge])

  // Handle new connections (prompts modal with prefilled endpoints)
  const onConnect = useCallback((params) => {
    setEdgeModal({
      isOpen: true,
      edgeToEdit: null,
      initialSource: params.source,
      initialTarget: params.target
    })
  }, [])

  // Handle selection changes
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      if (nodes.length > 0) {
        setSelectedNode(nodes[0])
      } else if (edges.length > 0) {
        setSelectedEdge(edges[0])
      } else {
        setSelectedNode(null)
        setSelectedEdge(null)
      }
    }
  })

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
    setEdgeContextMenu(null)
  }, [setSelectedNode])

  // Handle edge click
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge)
    setEdgeContextMenu(null)
  }, [setSelectedEdge])

  // Handle edge right click context menu
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault()
    event.stopPropagation()
    setEdgeContextMenu({
      edge,
      position: { x: event.clientX, y: event.clientY }
    })
  }, [])

  // Handle pane click (deselect & close menus)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    setEdgeContextMenu(null)
  }, [setSelectedNode, setSelectedEdge])

  // Allow dragging over canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Open modal from context menu
  const handleEditEdgeFromMenu = useCallback((edge) => {
    setEdgeModal({
      isOpen: true,
      edgeToEdit: edge,
      initialSource: edge.source,
      initialTarget: edge.target
    })
  }, [])

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        edgesReconnectable={true}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'workflowEdge',
          animated: false,
          reconnectable: true
        }}
        connectionLineType="smoothstep"
        className={theme === 'dark' ? 'dark' : ''}
      >
        {/* Background grid */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color={theme === 'dark' ? '#374151' : '#e5e7eb'}
        />
        
        {/* Controls */}
        <Controls 
          className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !rounded-lg !shadow-lg"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        
        {/* Mini map */}
        <MiniMap 
          nodeColor={minimapNodeColor}
          className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !rounded-lg !shadow-lg"
          maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)'}
          style={{ width: 150, height: 100 }}
        />
      </ReactFlow>

      {/* Right Click Context Menu for Edges */}
      {edgeContextMenu && (
        <EdgeContextMenu
          edge={edgeContextMenu.edge}
          position={edgeContextMenu.position}
          onClose={() => setEdgeContextMenu(null)}
          onEditEdge={handleEditEdgeFromMenu}
        />
      )}

      {/* Edge Creation and Edit Modal */}
      <EdgeCreationModal
        isOpen={edgeModal.isOpen}
        onClose={() => setEdgeModal(prev => ({ ...prev, isOpen: false, edgeToEdit: null }))}
        initialSource={edgeModal.initialSource}
        initialTarget={edgeModal.initialTarget}
        edgeToEdit={edgeModal.edgeToEdit}
      />
    </div>
  )
}

export default WorkflowCanvas
