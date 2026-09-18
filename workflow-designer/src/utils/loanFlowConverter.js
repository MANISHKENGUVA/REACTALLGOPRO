/**
 * Convert LOAN-FLOW-V7 states format to React Flow nodes/edges
 * 
 * Input format:
 * {
 *   workflowVersion: "LOAN-FLOW-V7",
 *   startState: "STATE-ID",
 *   states: {
 *     "STATE-ID": {
 *       type: "FORM|SYSTEM|WAIT|TERMINAL",
 *       component: "ComponentName",
 *       metadata: { actor, module, node, nodeVersion },
 *       edges: {
 *         "ED01": { toState: "TARGET-STATE", ruleEngine: {...} }
 *       }
 *     }
 *   }
 * }
 */
export function convertLoanFlowV7ToReactFlow(jsonData) {
  const nodes = []
  const edges = []
  const states = jsonData.states || {}
  
  // Calculate positions using a simple grid layout
  const actorColumns = {
    'BORROWER': 0,
    'COBORROWER': 1,
    'LENDER': 2,
    'MANAGER': 3,
    'SYSTEM': 4
  }
  
  const actorRowCounts = {}
  let edgeIndex = 0
  
  // Process each state into a node
  Object.entries(states).forEach(([stateId, stateData]) => {
    const actor = stateData.metadata?.actor || 'SYSTEM'
    const module = stateData.metadata?.module || 'GENERAL'
    const node = stateData.metadata?.node || stateId
    
    // Calculate position
    const col = actorColumns[actor] || 4
    if (!actorRowCounts[actor]) actorRowCounts[actor] = 0
    const row = actorRowCounts[actor]++
    
    // Determine terminal state
    let terminalState = null
    if (stateData.type === 'TERMINAL') {
      if (stateId.includes('APPROVED')) terminalState = 'APPROVED'
      else if (stateId.includes('REJECTED')) terminalState = 'REJECTED'
      else if (stateId.includes('CANCELLED')) terminalState = 'CANCELLED'
    }
    
    nodes.push({
      id: stateId,
      type: 'workflowNode',
      position: { 
        x: 100 + col * 350, 
        y: 100 + row * 150 
      },
      data: {
        nodeId: stateId,
        nodeType: stateData.type,
        component: stateData.component,
        actor: actor,
        module: module,
        version: stateData.metadata?.nodeVersion || 'V1',
        description: `${stateData.component} - ${module}`,
        terminalState: terminalState,
        metadata: stateData.metadata || {}
      }
    })
    
    // Process edges from this state
    if (stateData.edges) {
      Object.entries(stateData.edges).forEach(([edgeId, edgeData]) => {
        edges.push({
          id: edgeId,
          source: stateId,
          target: edgeData.toState,
          type: 'workflowEdge',
          animated: false,
          data: {
            edgeId: edgeId,
            ruleEngine: edgeData.ruleEngine || { type: 'AND', conditions: [] },
            metadata: {}
          }
        })
      })
    }
  })
  
  const workflowNodes = nodes.map(n => ({
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
  }))

  const workflowEdges = edges.map(e => ({
    edgeId: e.id,
    sourceId: e.source,
    targetId: e.target,
    ruleEngine: e.data?.ruleEngine || { type: 'AND', conditions: [] },
    metadata: e.data?.metadata || {}
  }))

  return {
    workflow: {
      flowId: jsonData.workflowVersion,
      flowName: jsonData.workflowVersion,
      version: '1.0.0',
      description: 'Loan Application Workflow',
      metadata: {
        startState: jsonData.startState
      },
      nodes: workflowNodes,
      edges: workflowEdges
    },
    nodes,
    edges
  }
}


/**
 * Convert React Flow back to LOAN-FLOW-V7 format
 */
export function convertReactFlowToLoanFlowV7(nodes, edges, workflow) {
  const states = {}
  
  // Group edges by source
  const edgesBySource = {}
  edges.forEach(edge => {
    if (!edgesBySource[edge.source]) {
      edgesBySource[edge.source] = {}
    }
    edgesBySource[edge.source][edge.id] = {
      toState: edge.target,
      ruleEngine: edge.data?.ruleEngine || { type: 'AND', conditions: [] }
    }
  })
  
  // Convert nodes to states
  nodes.forEach(node => {
    states[node.id] = {
      type: node.data.nodeType,
      component: node.data.component,
      metadata: {
        actor: node.data.actor,
        module: node.data.module,
        moduleVersion: node.data.metadata?.moduleVersion || 'V1',
        node: node.data.metadata?.node || node.data.nodeId,
        nodeVersion: node.data.version || 'V1'
      },
      edges: edgesBySource[node.id] || {}
    }
  })
  
  return {
    workflowVersion: workflow.flowId,
    startState: workflow.metadata?.startState || nodes[0]?.id,
    states
  }
}
