import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  User,
  Users,
  Settings,
  FileText,
  Clock,
  CheckCircle2,
  GripVertical,
  SlidersHorizontal,
  UserPlus
} from 'lucide-react'
import clsx from 'clsx'
import { useWorkflowStore } from '../stores/workflowStore'
import { useActorStore, ICON_REGISTRY } from '../stores/actorStore'
import AddNodeModal from './AddNodeModal'
import ActorManagerModal from './ActorManagerModal'

// Node type configurations for palette
const nodeTypes = [
  { 
    id: 'FORM', 
    label: 'Form', 
    icon: FileText, 
    color: 'bg-blue-500',
    description: 'User input form'
  },
  { 
    id: 'SYSTEM', 
    label: 'System', 
    icon: Settings, 
    color: 'bg-purple-500',
    description: 'Automated system process'
  },
  { 
    id: 'WAIT', 
    label: 'Wait', 
    icon: Clock, 
    color: 'bg-amber-500',
    description: 'Wait for external action'
  },
  { 
    id: 'TERMINAL', 
    label: 'Terminal', 
    icon: CheckCircle2, 
    color: 'bg-emerald-500',
    description: 'End state (Approved/Rejected)'
  }
]

function LeftSidebar() {
  const { nodes, searchQuery, setSearchQuery, setSelectedNode } = useWorkflowStore()
  const { actors } = useActorStore()

  const [expandedActors, setExpandedActors] = useState(
    () => actors.reduce((acc, actor) => ({ ...acc, [actor.id]: true }), {})
  )
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false)
  const [isActorManagerOpen, setIsActorManagerOpen] = useState(false)
  const [targetActorForModal, setTargetActorForModal] = useState(null)
  const [targetTypeForModal, setTargetTypeForModal] = useState(null)

  // Group existing nodes by actor
  const groupedNodes = useMemo(() => {
    const groups = {}
    actors.forEach(actor => {
      groups[actor.id] = nodes.filter(node => node.data.actor === actor.id)
    })
    // Group any nodes belonging to actors not in current list
    nodes.forEach(node => {
      const actorId = node.data.actor || 'SYSTEM'
      if (!groups[actorId]) {
        groups[actorId] = [node]
      }
    })
    return groups
  }, [nodes, actors])

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes
    return nodes.filter(node => 
      node.data.nodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.data.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.data.module.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [nodes, searchQuery])

  // Toggle actor group expansion
  const toggleActor = (actorId) => {
    setExpandedActors(prev => ({
      ...prev,
      [actorId]: prev[actorId] === undefined ? false : !prev[actorId]
    }))
  }

  // Handle drag start
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }

  // Open modal with preselected actor
  const handleOpenAddModal = (actorId = null, type = 'FORM') => {
    setTargetActorForModal(actorId)
    setTargetTypeForModal(type)
    setIsAddNodeModalOpen(true)
    setShowAddMenu(false)
  }

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={clsx(
          'w-72 flex flex-col',
          'bg-white dark:bg-gray-900',
          'border-r border-gray-200 dark:border-gray-800',
          'shadow-sm'
        )}
      >
        {/* Header */}
        <div className={clsx(
          'p-4 border-b border-gray-200 dark:border-gray-800',
          'bg-gradient-to-r from-primary-50 to-white',
          'dark:from-gray-800 dark:to-gray-900'
        )}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Node Palette
            </h2>
            <button
              onClick={() => setIsActorManagerOpen(true)}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary-300 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 transition-colors"
              title="Configure Actors, Roles & Colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Actors
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className={clsx(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'w-4 h-4 text-gray-400'
            )} />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                'w-full pl-10 pr-4 py-2',
                'bg-white dark:bg-gray-800',
                'border border-gray-300 dark:border-gray-700',
                'rounded-lg text-sm',
                'text-gray-900 dark:text-white',
                'placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600',
                'transition-all'
              )}
            />
          </div>
        </div>

        {/* Add Node Button */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <button
              onClick={() => handleOpenAddModal()}
              className={clsx(
                'w-full flex items-center justify-center gap-2',
                'px-4 py-2.5',
                'bg-primary-250 hover:bg-primary-300',
                'dark:bg-primary-350 dark:hover:bg-primary-400',
                'text-white font-semibold',
                'rounded-lg',
                'shadow-sm hover:shadow',
                'transition-all'
              )}
            >
              <Plus className="w-4 h-4" />
              Add New Node
            </button>
          </div>
        </div>

        {/* Node List by Actor */}
        <div className="flex-1 overflow-y-auto p-2">
          {actors.map(actor => {
            const ActorIcon = (actor.icon && ICON_REGISTRY[actor.icon]) ? ICON_REGISTRY[actor.icon] : User
            const actorNodes = searchQuery 
              ? filteredNodes.filter(n => n.data.actor === actor.id)
              : groupedNodes[actor.id] || []
            
            if (searchQuery && actorNodes.length === 0) return null
            const isExpanded = expandedActors[actor.id] !== false
            
            return (
              <div key={actor.id} className="mb-2">
                {/* Actor Header */}
                <div className="flex items-center gap-1 group">
                  <button
                    onClick={() => toggleActor(actor.id)}
                    className={clsx(
                      'flex-1 flex items-center gap-2 px-2.5 py-2',
                      'rounded-lg',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'transition-colors text-left'
                    )}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={clsx('p-1 rounded-md text-white shrink-0', actor.color)}>
                      <ActorIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                      {actor.label}
                    </span>
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-bold',
                      'bg-gray-100 dark:bg-gray-800',
                      'text-gray-600 dark:text-gray-400'
                    )}>
                      {actorNodes.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenAddModal(actor.id)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 rounded-lg text-gray-400 hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    title={`Add node for ${actor.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Actor Nodes */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pr-2 py-1 space-y-1">
                        {actorNodes.map(node => (
                          <div
                            key={node.id}
                            draggable
                            onClick={() => {
                              setSelectedNode(node)
                              window.dispatchEvent(new CustomEvent('workflow-focus-node', { detail: { nodeId: node.id } }))
                            }}
                            onDragStart={(e) => onDragStart(e, node.data)}
                            className={clsx(
                              'flex items-center gap-2 px-3 py-2',
                              'bg-gray-50 dark:bg-gray-800/50',
                              'border border-gray-200 dark:border-gray-700',
                              'rounded-lg',
                              'cursor-pointer hover:shadow-sm hover:border-primary-300 dark:hover:border-primary-600',
                              'transition-all'
                            )}
                          >
                            <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-primary-300 dark:text-primary-400">
                                  {node.data.nodeId}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">
                                  {node.data.nodeType}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {node.data.component}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {actorNodes.length === 0 && !searchQuery && (
                          <div className="px-3 py-3 text-xs text-gray-400 text-center flex flex-col items-center gap-1">
                            <span>No nodes assigned</span>
                            <button
                              onClick={() => handleOpenAddModal(actor.id)}
                              className="text-primary-300 dark:text-primary-400 hover:underline text-[11px] font-semibold"
                            >
                              + Add first node
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Footer Stats */}
        <div className={clsx(
          'p-3 border-t border-gray-200 dark:border-gray-800',
          'bg-gray-50 dark:bg-gray-800/50'
        )}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Total Nodes / Actors
            </span>
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {nodes.length} / {actors.length}
            </span>
          </div>
        </div>
      </motion.aside>

      {/* Add Node Modal */}
      <AddNodeModal
        isOpen={isAddNodeModalOpen}
        onClose={() => setIsAddNodeModalOpen(false)}
        initialActor={targetActorForModal}
        initialNodeType={targetTypeForModal}
      />

      {/* Actor Configuration Modal */}
      <ActorManagerModal
        isOpen={isActorManagerOpen}
        onClose={() => setIsActorManagerOpen(false)}
      />
    </>
  )
}

export default LeftSidebar
