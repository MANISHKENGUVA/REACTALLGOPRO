import dagre from 'dagre'

/**
 * Auto-layout nodes using dagre algorithm
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {Object} options - Layout options
 * @returns {Object} - Updated nodes and edges
 */
export function getAutoLayout(nodes, edges, options = {}) {
  const {
    direction = 'LR', // LR = left-to-right, TB = top-to-bottom
    nodeWidth = 250,
    nodeHeight = 120,
    nodeSpacing = 80,
    rankSpacing = 120
  } = options

  const dagreGraph = new dagre.graphlib.Graph()
  
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 50,
    marginy: 50
  })

  // Add nodes to dagre graph
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight
    })
  })

  // Add edges to dagre graph
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Run layout
  dagre.layout(dagreGraph)

  // Update node positions
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    }
  })

  return {
    nodes: layoutedNodes,
    edges
  }
}

/**
 * Swimlane auto-layout nodes grouped horizontally by actor
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {Array} actors - Ordered list of actor configurations
 * @param {Object} options - Layout options
 * @returns {Object} - Updated nodes, edges, and computed lanes
 */
export function getSwimlaneLayout(nodes, edges, actors = [], options = {}) {
  const {
    laneHeight = 180,
    rankSpacing = 320,
    nodeWidth = 240,
    nodeHeight = 110,
    marginX = 120,
    marginY = 80
  } = options

  if (!nodes || nodes.length === 0) {
    return { nodes: [], edges, lanes: [] }
  }

  // 1. Identify which actors are present or use the provided actor sequence
  const actorIdsInNodes = [...new Set(nodes.map(n => n.data?.actor || 'SYSTEM'))]
  const orderedActors = []
  
  // Follow the actor order defined in actor store first
  actors.forEach(actor => {
    if (actorIdsInNodes.includes(actor.id) || actors.length <= 8) {
      if (!orderedActors.some(a => a.id === actor.id)) {
        orderedActors.push(actor)
      }
    }
  })

  // Add any actor present in nodes that wasn't in store
  actorIdsInNodes.forEach(actorId => {
    if (!orderedActors.some(a => a.id === actorId)) {
      orderedActors.push({ id: actorId, label: actorId, color: 'bg-gray-500', hex: '#6B7280' })
    }
  })

  // 2. Compute topological rank (longest path from start nodes)
  const adjacency = {}
  const inDegree = {}
  nodes.forEach(n => {
    adjacency[n.id] = []
    inDegree[n.id] = 0
  })

  edges.forEach(edge => {
    if (adjacency[edge.source] && inDegree[edge.target] !== undefined) {
      adjacency[edge.source].push(edge.target)
      inDegree[edge.target] = (inDegree[edge.target] || 0) + 1
    }
  })

  const ranks = {}
  const queue = []

  // Initialize start nodes (inDegree === 0)
  nodes.forEach(n => {
    if ((inDegree[n.id] || 0) === 0) {
      ranks[n.id] = 0
      queue.push(n.id)
    }
  })

  // BFS / DAG propagation
  while (queue.length > 0) {
    const currentId = queue.shift()
    const currentRank = ranks[currentId] || 0

    const neighbors = adjacency[currentId] || []
    neighbors.forEach(neighborId => {
      const existingRank = ranks[neighborId]
      const newRank = currentRank + 1
      if (existingRank === undefined || newRank > existingRank) {
        ranks[neighborId] = newRank
      }
      inDegree[neighborId]--
      if (inDegree[neighborId] <= 0) {
        queue.push(neighborId)
      }
    })
  }

  // Handle any disconnected or cyclic nodes that didn't receive ranks
  nodes.forEach(n => {
    if (ranks[n.id] === undefined) {
      ranks[n.id] = 0
    }
  })

  // 3. Compute Lane Boundaries & Group Nodes by Actor and Rank
  const lanes = orderedActors.map((actor, index) => {
    const top = marginY + (index * laneHeight)
    return {
      actorId: actor.id,
      label: actor.label,
      icon: actor.icon,
      color: actor.color,
      hex: actor.hex,
      top,
      height: laneHeight,
      bottom: top + laneHeight
    }
  })

  // Track how many nodes share the same (actor, rank) to offset them horizontally
  const laneRankCounts = {}

  const layoutedNodes = nodes.map(node => {
    const actorId = node.data?.actor || 'SYSTEM'
    let laneIndex = orderedActors.findIndex(a => a.id === actorId)
    if (laneIndex === -1) laneIndex = 0

    const lane = lanes[laneIndex] || lanes[0]
    const rank = ranks[node.id] || 0

    const key = `${actorId}_${rank}`
    const subIndex = laneRankCounts[key] || 0
    laneRankCounts[key] = subIndex + 1

    const x = marginX + (rank * rankSpacing) + (subIndex * (nodeWidth + 40))
    const y = lane.top + ((laneHeight - nodeHeight) / 2)

    return {
      ...node,
      position: { x, y }
    }
  })

  return {
    nodes: layoutedNodes,
    edges,
    lanes
  }
}

/**
 * Get initial position for a new node
 * @param {Array} existingNodes - Current nodes
 * @returns {Object} - Position {x, y}
 */
export function getNewNodePosition(existingNodes) {
  if (existingNodes.length === 0) {
    return { x: 250, y: 150 }
  }

  // Find the rightmost node
  const rightmostNode = existingNodes.reduce((max, node) => 
    node.position.x > max.position.x ? node : max
  )

  // Place new node to the right of the rightmost node
  return {
    x: rightmostNode.position.x + 300,
    y: rightmostNode.position.y
  }
}

/**
 * Check if two nodes overlap
 * @param {Object} node1 - First node with position
 * @param {Object} node2 - Second node with position
 * @param {number} padding - Padding to consider
 * @returns {boolean}
 */
export function nodesOverlap(node1, node2, padding = 20) {
  const nodeWidth = 250
  const nodeHeight = 120

  return !(
    node1.position.x + nodeWidth + padding < node2.position.x ||
    node2.position.x + nodeWidth + padding < node1.position.x ||
    node1.position.y + nodeHeight + padding < node2.position.y ||
    node2.position.y + nodeHeight + padding < node1.position.y
  )
}

/**
 * Find non-overlapping position for a node
 * @param {Object} node - Node to position
 * @param {Array} existingNodes - Other nodes
 * @returns {Object} - Non-overlapping position
 */
export function findNonOverlappingPosition(node, existingNodes) {
  let position = { ...node.position }
  let attempts = 0
  const maxAttempts = 100
  const step = 50

  const otherNodes = existingNodes.filter(n => n.id !== node.id)

  while (attempts < maxAttempts) {
    const overlaps = otherNodes.some(n => nodesOverlap({ ...node, position }, n))
    
    if (!overlaps) {
      return position
    }

    // Move down and try again
    position = {
      x: position.x,
      y: position.y + step
    }
    attempts++
  }

  return position
}

