import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { convertLoanFlowV7ToReactFlow, convertReactFlowToLoanFlowV7 } from '../utils/loanFlowConverter'

// Initial empty workflow structure
const initialWorkflow = {
  flowId: 'LOAN-FLOW-V7',
  flowName: 'New Workflow',
  version: '1.0.0',
  description: '',
  metadata: {
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    author: '',
    tags: [],
    startState: null
  },
  nodes: [],
  edges: []
}

// Max history size for undo/redo
const maxHistorySize = 50

export const useWorkflowStore = create((set, get) => ({
  // Workflow data
  workflow: initialWorkflow,
  
  // React Flow nodes and edges
  nodes: [],
  edges: [],
  
  // UI State
  selectedNode: null,
  selectedEdge: null,
  theme: 'light',
  searchQuery: '',
  filterActor: null,
  filterType: null,
  
  // History for undo/redo
  history: [],
  historyIndex: -1,
  
  // Initialize workflow from JSON (handles both formats)
  initFromJSON: (jsonData) => {
    // Detect format - LOAN-FLOW-V7 has 'states', our format has 'nodes'
    if (jsonData.states) {
      // LOAN-FLOW-V7 format
      const { workflow, nodes, edges } = convertLoanFlowV7ToReactFlow(jsonData)
      
      const safeWorkflow = {
        ...workflow,
        nodes: workflow.nodes || nodes.map(n => ({
          nodeId: n.id,
          nodeType: n.data.nodeType,
          component: n.data.component,
          actor: n.data.actor,
          module: n.data.module,
          version: n.data.version,
          description: n.data.description,
          terminalState: n.data.terminalState,
          position: n.position,
          metadata: n.data.metadata || {}
        })),
        edges: workflow.edges || edges.map(e => ({
          edgeId: e.id,
          sourceId: e.source,
          targetId: e.target,
          ruleEngine: e.data?.ruleEngine || { type: 'AND', conditions: [] },
          metadata: e.data?.metadata || {}
        }))
      }

      set({
        workflow: safeWorkflow,
        nodes,
        edges,
        history: [{ nodes, edges, workflow: safeWorkflow }],
        historyIndex: 0
      })
    } else {
      // Our React Flow format
      const { nodes, edges } = get().convertJSONToReactFlow(jsonData)
      const safeWorkflow = {
        ...jsonData,
        nodes: jsonData.nodes || [],
        edges: jsonData.edges || []
      }
      
      set({
        workflow: safeWorkflow,
        nodes,
        edges,
        history: [{ nodes, edges, workflow: safeWorkflow }],
        historyIndex: 0
      })
    }
  },

  
  // Convert JSON to React Flow format
  convertJSONToReactFlow: (jsonData) => {
    const nodes = (jsonData.nodes || []).map(node => ({
      id: node.nodeId,
      type: 'workflowNode',
      position: node.position || { x: 0, y: 0 },
      data: {
        nodeId: node.nodeId,
        nodeType: node.nodeType,
        component: node.component,
        actor: node.actor,
        module: node.module,
        version: node.version,
        description: node.description,
        terminalState: node.terminalState,
        metadata: node.metadata
      }
    }))
    
    const edges = (jsonData.edges || []).map(edge => ({
      id: edge.edgeId,
      source: edge.sourceId,
      target: edge.targetId,
      type: 'workflowEdge',
      animated: false,
      data: {
        edgeId: edge.edgeId,
        ruleEngine: edge.ruleEngine,
        metadata: edge.metadata
      }
    }))
    
    return { nodes, edges }
  },
  
  // Convert React Flow to JSON format
  convertReactFlowToJSON: () => {
    const { workflow, nodes, edges } = get()
    
    const jsonNodes = nodes.map(node => ({
      nodeId: node.id,
      nodeType: node.data.nodeType,
      component: node.data.component,
      actor: node.data.actor,
      module: node.data.module,
      version: node.data.version,
      description: node.data.description,
      terminalState: node.data.terminalState,
      position: node.position,
      metadata: node.data.metadata || {}
    }))
    
    const jsonEdges = edges.map(edge => ({
      edgeId: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      ruleEngine: edge.data?.ruleEngine || { type: 'AND', conditions: [] },
      metadata: edge.data?.metadata || {}
    }))
    
    return {
      ...workflow,
      nodes: jsonNodes,
      edges: jsonEdges,
      metadata: {
        ...workflow.metadata,
        modified: new Date().toISOString()
      }
    }
  },
  
  // Add to history for undo/redo
  addToHistory: (nodes, edges, workflow) => {
    const { history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ nodes, edges, workflow })
    
    if (newHistory.length > maxHistorySize) {
      newHistory.shift()
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    })
  },
  
  // Undo
  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const { nodes, edges, workflow } = history[newIndex]
      set({
        nodes,
        edges,
        workflow,
        historyIndex: newIndex,
        selectedNode: null,
        selectedEdge: null
      })
    }
  },
  
  // Redo
  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const { nodes, edges, workflow } = history[newIndex]
      set({
        nodes,
        edges,
        workflow,
        historyIndex: newIndex,
        selectedNode: null,
        selectedEdge: null
      })
    }
  },
  
  // Update nodes
  setNodes: (nodes) => {
    set({ nodes })
  },
  
  // Update edges
  setEdges: (edges) => {
    set({ edges })
  },
  
  // Add node
  addNode: (nodeData) => {
    const { nodes, edges, workflow, addToHistory } = get()
    const newId = nodeData.nodeId || `ND${String(nodes.length + 1).padStart(2, '0')}`
    
    const newNode = {
      id: newId,
      type: 'workflowNode',
      position: nodeData.position || { x: 200, y: 200 },
      data: {
        nodeId: newId,
        nodeType: nodeData.nodeType || 'FORM',
        component: nodeData.component || 'NewComponent',
        actor: nodeData.actor || 'BORROWER',
        module: nodeData.module || 'GENERAL',
        version: nodeData.version || '1.0.0',
        description: nodeData.description || '',
        terminalState: nodeData.terminalState,
        metadata: nodeData.metadata || {}
      }
    }
    
    const newNodes = [...nodes, newNode]
    const currentWfNodes = workflow?.nodes || []
    const newWorkflow = {
      ...workflow,
      nodes: [...currentWfNodes, {
        nodeId: newId,
        nodeType: newNode.data.nodeType,
        component: newNode.data.component,
        actor: newNode.data.actor,
        module: newNode.data.module,
        version: newNode.data.version,
        description: newNode.data.description,
        terminalState: newNode.data.terminalState,
        position: newNode.position,
        metadata: newNode.data.metadata
      }]
    }
    
    set({ nodes: newNodes, workflow: newWorkflow })
    addToHistory(newNodes, edges, newWorkflow)
    
    return newId
  },
  
  // Update node position (called when dragging completes)
  updateNodePosition: (nodeId, position) => {
    const { nodes, workflow, addToHistory, edges } = get()
    
    const newNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          position: { ...position }
        }
      }
      return node
    })
    
    const currentWfNodes = workflow?.nodes || []
    const newWorkflow = {
      ...workflow,
      nodes: currentWfNodes.map(node => {
        if (node.nodeId === nodeId) {
          return {
            ...node,
            position: { ...position }
          }
        }
        return node
      })
    }
    
    set({ nodes: newNodes, workflow: newWorkflow })
    addToHistory(newNodes, edges, newWorkflow)
  },

  // Update node
  updateNode: (nodeId, updates) => {
    const { nodes, edges, workflow, addToHistory } = get()
    const { position, ...dataUpdates } = updates || {}
    
    const newNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          ...(position ? { position: { ...position } } : {}),
          data: {
            ...node.data,
            ...dataUpdates
          }
        }
      }
      return node
    })
    
    const currentWfNodes = workflow?.nodes || []
    const newWorkflow = {
      ...workflow,
      nodes: currentWfNodes.map(node => {
        if (node.nodeId === nodeId) {
          return {
            ...node,
            ...dataUpdates,
            position: position ? { ...position } : (newNodes.find(n => n.id === nodeId)?.position || node.position)
          }
        }
        return node
      })
    }
    
    set({ nodes: newNodes, workflow: newWorkflow })
    addToHistory(newNodes, edges, newWorkflow)
  },
  
  // Delete node
  deleteNode: (nodeId) => {
    const { nodes, edges, workflow, addToHistory, selectedNode } = get()
    
    const newNodes = nodes.filter(node => node.id !== nodeId)
    const newEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
    const currentWfNodes = workflow?.nodes || []
    const currentWfEdges = workflow?.edges || []
    const newWorkflow = {
      ...workflow,
      nodes: currentWfNodes.filter(node => node.nodeId !== nodeId),
      edges: currentWfEdges.filter(edge => edge.sourceId !== nodeId && edge.targetId !== nodeId)
    }
    
    set({
      nodes: newNodes,
      edges: newEdges,
      workflow: newWorkflow,
      selectedNode: selectedNode?.id === nodeId ? null : selectedNode
    })
    addToHistory(newNodes, newEdges, newWorkflow)
  },
  
  // Add edge
  addEdge: (edgeData) => {
    const { nodes, edges, workflow, addToHistory } = get()
    const newId = edgeData.edgeId || `ED${String(edges.length + 1).padStart(2, '0')}`
    
    const newEdge = {
      id: newId,
      source: edgeData.sourceId,
      target: edgeData.targetId,
      type: 'workflowEdge',
      animated: false,
      data: {
        edgeId: newId,
        ruleEngine: edgeData.ruleEngine || { type: 'AND', conditions: [] },
        metadata: edgeData.metadata || {}
      }
    }
    
    const newEdges = [...edges, newEdge]
    const currentWfEdges = workflow?.edges || []
    const newWorkflow = {
      ...workflow,
      edges: [...currentWfEdges, {
        edgeId: newId,
        sourceId: edgeData.sourceId,
        targetId: edgeData.targetId,
        ruleEngine: newEdge.data.ruleEngine,
        metadata: newEdge.data.metadata
      }]
    }
    
    set({ edges: newEdges, workflow: newWorkflow })
    addToHistory(nodes, newEdges, newWorkflow)
    
    return newId
  },
  
  // Update edge
  updateEdge: (edgeId, updates) => {
    const { nodes, edges, workflow, addToHistory } = get()
    
    const newEdges = edges.map(edge => {
      if (edge.id === edgeId) {
        return {
          ...edge,
          data: {
            ...edge.data,
            ...updates
          }
        }
      }
      return edge
    })
    
    const currentWfEdges = workflow?.edges || []
    const newWorkflow = {
      ...workflow,
      edges: currentWfEdges.map(edge => {
        if (edge.edgeId === edgeId) {
          return {
            ...edge,
            ...updates
          }
        }
        return edge
      })
    }
    
    set({ edges: newEdges, workflow: newWorkflow })
    addToHistory(nodes, newEdges, newWorkflow)
  },
  
  // Delete edge
  deleteEdge: (edgeId) => {
    const { nodes, edges, workflow, addToHistory, selectedEdge } = get()
    
    const newEdges = edges.filter(edge => edge.id !== edgeId)
    const currentWfEdges = workflow?.edges || []
    const newWorkflow = {
      ...workflow,
      edges: currentWfEdges.filter(edge => edge.edgeId !== edgeId)
    }
    
    set({
      edges: newEdges,
      workflow: newWorkflow,
      selectedEdge: selectedEdge?.id === edgeId ? null : selectedEdge
    })
    addToHistory(nodes, newEdges, newWorkflow)
  },

  // Reconnect edge (drag endpoint to another node)
  reconnectEdge: (edgeId, newSource, newTarget) => {
    const { nodes, edges, workflow, addToHistory } = get()
    
    const newEdges = edges.map(edge => {
      if (edge.id === edgeId) {
        return {
          ...edge,
          source: newSource,
          target: newTarget
        }
      }
      return edge
    })
    
    const currentWfEdges = workflow?.edges || []
    const newWorkflow = {
      ...workflow,
      edges: currentWfEdges.map(edge => {
        if (edge.edgeId === edgeId) {
          return {
            ...edge,
            sourceId: newSource,
            targetId: newTarget
          }
        }
        return edge
      })
    }
    
    set({ edges: newEdges, workflow: newWorkflow })
    addToHistory(nodes, newEdges, newWorkflow)
  },

  
  // Selection
  setSelectedNode: (node) => set({ selectedNode: node, selectedEdge: null }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),
  clearSelection: () => set({ selectedNode: null, selectedEdge: null }),
  
  // Theme
  toggleTheme: () => {
    const { theme } = get()
    set({ theme: theme === 'light' ? 'dark' : 'light' })
  },
  
  // Search and filter
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterActor: (actor) => set({ filterActor: actor }),
  setFilterType: (type) => set({ filterType: type }),
  
  // Get filtered nodes
  getFilteredNodes: () => {
    const { nodes, searchQuery, filterActor, filterType } = get()
    
    return nodes.filter(node => {
      const matchesSearch = !searchQuery || 
        node.data.nodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.module.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesActor = !filterActor || node.data.actor === filterActor
      const matchesType = !filterType || node.data.nodeType === filterType
      
      return matchesSearch && matchesActor && matchesType
    })
  },
  
  // Export workflow JSON (exports in LOAN-FLOW-V7 format if original was that format)
  exportJSON: () => {
    const { workflow, nodes, edges } = get()
    
    // Check if we should export in LOAN-FLOW-V7 format
    if (workflow.metadata?.startState || workflow.flowId?.includes('LOAN-FLOW')) {
      return convertReactFlowToLoanFlowV7(nodes, edges, workflow)
    }
    
    // Otherwise use standard format
    return get().convertReactFlowToJSON()
  }
}))
