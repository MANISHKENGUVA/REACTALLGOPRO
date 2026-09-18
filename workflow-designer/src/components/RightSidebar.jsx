import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Settings, 
  Trash2, 
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Save,
  Edit3,
  GitBranch,
  AlertCircle
} from 'lucide-react'
import clsx from 'clsx'
import { useWorkflowStore } from '../stores/workflowStore'
import { useActorStore } from '../stores/actorStore'
import { useWorkflowConfigStore } from '../stores/workflowConfigStore'


// Node type options
const nodeTypeOptions = [
  { value: 'FORM', label: 'Form' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'WAIT', label: 'Wait' },
  { value: 'TERMINAL', label: 'Terminal' }
]

// Terminal state options
const terminalStateOptions = [
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' }
]

function RightSidebar() {
  const { 
    selectedNode, 
    selectedEdge,
    nodes,
    edges,
    updateNode,
    updateEdge,
    deleteNode,
    deleteEdge,
    addEdge,
    setSelectedNode,
    setSelectedEdge
  } = useWorkflowStore()

  const { actors } = useActorStore()
  const { operators, modules } = useWorkflowConfigStore()

  const [isEditing, setIsEditing] = useState(false)

  const [editData, setEditData] = useState({})
  const [showConditionEditor, setShowConditionEditor] = useState(false)
  const [newCondition, setNewCondition] = useState({ field: '', operator: 'equals', value: '' })

  // Start editing
  const startEditing = () => {
    if (selectedNode) {
      setEditData({ ...selectedNode.data })
      setIsEditing(true)
    } else if (selectedEdge) {
      setEditData({ ...selectedEdge.data })
      setIsEditing(true)
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false)
    setEditData({})
  }

  // Save changes
  const saveChanges = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, editData)
    } else if (selectedEdge) {
      updateEdge(selectedEdge.id, editData)
    }
    setIsEditing(false)
    setEditData({})
  }

  // Add condition to edge
  const addCondition = () => {
    if (!newCondition.field || !newCondition.value) return
    
    const currentConditions = editData.ruleEngine?.conditions || []
    const updatedRuleEngine = {
      type: editData.ruleEngine?.type || 'AND',
      conditions: [...currentConditions, { ...newCondition }]
    }
    
    setEditData({
      ...editData,
      ruleEngine: updatedRuleEngine
    })
    setNewCondition({ field: '', operator: 'equals', value: '' })
  }

  // Remove condition from edge
  const removeCondition = (index) => {
    const currentConditions = editData.ruleEngine?.conditions || []
    const updatedConditions = currentConditions.filter((_, i) => i !== index)
    
    setEditData({
      ...editData,
      ruleEngine: {
        ...editData.ruleEngine,
        conditions: updatedConditions
      }
    })
  }

  // Get outgoing edges for selected node
  const outgoingEdges = selectedNode 
    ? edges.filter(e => e.source === selectedNode.id)
    : []

  // Nothing selected
  if (!selectedNode && !selectedEdge) {
    return (
      <motion.aside
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={clsx(
          'w-80 flex flex-col items-center justify-center',
          'bg-white dark:bg-gray-900',
          'border-l border-gray-200 dark:border-gray-800',
          'text-gray-400'
        )}
      >
        <Settings className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm text-center px-8">
          Select a node or edge to view and edit properties
        </p>
      </motion.aside>
    )
  }

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={clsx(
        'w-80 flex flex-col',
        'bg-white dark:bg-gray-900',
        'border-l border-gray-200 dark:border-gray-800',
        'shadow-sm'
      )}
    >
      {/* Header */}
      <div className={clsx(
        'flex items-center justify-between p-4',
        'border-b border-gray-200 dark:border-gray-800',
        'bg-gradient-to-r from-primary-50 to-white',
        'dark:from-gray-800 dark:to-gray-900'
      )}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Inspector
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={cancelEditing}
                className={clsx(
                  'p-2 rounded-lg',
                  'text-gray-500 hover:text-gray-700',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors'
                )}
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={saveChanges}
                className={clsx(
                  'p-2 rounded-lg',
                  'bg-primary-250 hover:bg-primary-300',
                  'text-white',
                  'transition-colors'
                )}
              >
                <Save className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={startEditing}
              className={clsx(
                'p-2 rounded-lg',
                'text-gray-500 hover:text-gray-700',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'transition-colors'
              )}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Node Properties */}
        {selectedNode && (
          <div className="space-y-4">
            {/* Node ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Node ID
              </label>
              <input
                type="text"
                value={isEditing ? editData.nodeId : selectedNode.data.nodeId}
                onChange={(e) => setEditData({ ...editData, nodeId: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  'font-mono text-sm',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              />
            </div>

            {/* Node Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Node Type
              </label>
              <select
                value={isEditing ? editData.nodeType : selectedNode.data.nodeType}
                onChange={(e) => setEditData({ ...editData, nodeType: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              >
                {nodeTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Terminal State (only for TERMINAL type) */}
            {(isEditing ? editData.nodeType : selectedNode.data.nodeType) === 'TERMINAL' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Terminal State
                </label>
                <select
                  value={isEditing ? editData.terminalState : selectedNode.data.terminalState}
                  onChange={(e) => setEditData({ ...editData, terminalState: e.target.value })}
                  disabled={!isEditing}
                  className={clsx(
                    'w-full px-3 py-2 rounded-lg',
                    'border border-gray-300 dark:border-gray-700',
                    'bg-white dark:bg-gray-800',
                    'text-gray-900 dark:text-white',
                    isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                  )}
                >
                  {terminalStateOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Component */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Component
              </label>
              <input
                type="text"
                value={isEditing ? editData.component : selectedNode.data.component}
                onChange={(e) => setEditData({ ...editData, component: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              />
            </div>

            {/* Actor */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Actor
              </label>
              <select
                value={isEditing ? editData.actor : selectedNode.data.actor}
                onChange={(e) => setEditData({ ...editData, actor: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              >
                {actors.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label} ({opt.id})</option>
                ))}
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Module
              </label>
              <input
                type="text"
                list="sidebar-module-options"
                value={isEditing ? editData.module : selectedNode.data.module}
                onChange={(e) => setEditData({ ...editData, module: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              />
              <datalist id="sidebar-module-options">
                {modules.map(mod => (
                  <option key={mod} value={mod} />
                ))}
              </datalist>
            </div>


            {/* Version */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Version
              </label>
              <input
                type="text"
                value={isEditing ? editData.version : selectedNode.data.version}
                onChange={(e) => setEditData({ ...editData, version: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={isEditing ? editData.description : selectedNode.data.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg resize-none',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              />
            </div>

            {/* Outgoing Edges */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Outgoing Edges ({outgoingEdges.length})
              </label>
              <div className="space-y-2">
                {outgoingEdges.map(edge => (
                  <button
                    key={edge.id}
                    onClick={() => setSelectedEdge(edge)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2',
                      'bg-gray-50 dark:bg-gray-800',
                      'border border-gray-200 dark:border-gray-700',
                      'rounded-lg text-left',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      'transition-colors'
                    )}
                  >
                    <GitBranch className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">
                      {edge.data?.edgeId}
                    </span>
                    <span className="text-xs text-gray-400">
                      → {edge.target}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delete Button */}
            {isEditing && (
              <button
                onClick={() => {
                  deleteNode(selectedNode.id)
                  setSelectedNode(null)
                }}
                className={clsx(
                  'w-full flex items-center justify-center gap-2',
                  'px-4 py-2',
                  'bg-red-500 hover:bg-red-600',
                  'text-white font-semibold',
                  'rounded-lg',
                  'transition-colors'
                )}
              >
                <Trash2 className="w-4 h-4" />
                Delete Node
              </button>
            )}
          </div>
        )}

        {/* Edge Properties */}
        {selectedEdge && (
          <div className="space-y-4">
            {/* Edge ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Edge ID
              </label>
              <input
                type="text"
                value={isEditing ? editData.edgeId : selectedEdge.data?.edgeId}
                onChange={(e) => setEditData({ ...editData, edgeId: e.target.value })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  'font-mono text-sm',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              />
            </div>

            {/* Source & Target */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Source
                </label>
                <div className={clsx(
                  'px-3 py-2 rounded-lg',
                  'bg-gray-50 dark:bg-gray-800/50',
                  'border border-gray-200 dark:border-gray-700',
                  'text-sm font-mono text-gray-700 dark:text-gray-300'
                )}>
                  {selectedEdge.source}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Target
                </label>
                <div className={clsx(
                  'px-3 py-2 rounded-lg',
                  'bg-gray-50 dark:bg-gray-800/50',
                  'border border-gray-200 dark:border-gray-700',
                  'text-sm font-mono text-gray-700 dark:text-gray-300'
                )}>
                  {selectedEdge.target}
                </div>
              </div>
            </div>

            {/* Rule Engine Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Condition Logic
              </label>
              <select
                value={isEditing ? editData.ruleEngine?.type : selectedEdge.data?.ruleEngine?.type}
                onChange={(e) => setEditData({
                  ...editData,
                  ruleEngine: {
                    ...editData.ruleEngine,
                    type: e.target.value,
                    conditions: editData.ruleEngine?.conditions || selectedEdge.data?.ruleEngine?.conditions || []
                  }
                })}
                disabled={!isEditing}
                className={clsx(
                  'w-full px-3 py-2 rounded-lg',
                  'border border-gray-300 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'text-gray-900 dark:text-white',
                  isEditing ? 'focus:ring-2 focus:ring-primary-300' : 'bg-gray-50 dark:bg-gray-800/50'
                )}
              >
                <option value="AND">ALL conditions must match (AND)</option>
                <option value="OR">ANY condition can match (OR)</option>
              </select>
            </div>

            {/* Conditions */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Conditions ({(isEditing ? editData.ruleEngine?.conditions : selectedEdge.data?.ruleEngine?.conditions)?.length || 0})
              </label>
              
              <div className="space-y-2 mb-3">
                {(isEditing ? editData.ruleEngine?.conditions : selectedEdge.data?.ruleEngine?.conditions)?.map((condition, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'p-2 rounded-lg',
                      'bg-gray-50 dark:bg-gray-800',
                      'border border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1 text-xs">
                        <div className="font-mono text-gray-700 dark:text-gray-300">
                          {condition.field}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <span>{condition.operator}</span>
                          <span className="font-mono text-primary-400">
                            {String(condition.value)}
                          </span>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeCondition(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Condition */}
              {isEditing && (
                <div className={clsx(
                  'p-3 rounded-lg',
                  'bg-gray-50 dark:bg-gray-800',
                  'border border-dashed border-gray-300 dark:border-gray-600'
                )}>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Field (e.g., creditScore)"
                      value={newCondition.field}
                      onChange={(e) => setNewCondition({ ...newCondition, field: e.target.value })}
                      className={clsx(
                        'w-full px-2 py-1.5 text-sm rounded',
                        'border border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-700',
                        'text-gray-900 dark:text-white',
                        'focus:ring-1 focus:ring-primary-300'
                      )}
                    />
                    <select
                      value={newCondition.operator}
                      onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value })}
                      className={clsx(
                        'w-full px-2 py-1.5 text-sm rounded',
                        'border border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-700',
                        'text-gray-900 dark:text-white'
                      )}
                    >
                      {operators.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      value={newCondition.value}
                      onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                      className={clsx(
                        'w-full px-2 py-1.5 text-sm rounded',
                        'border border-gray-300 dark:border-gray-600',
                        'bg-white dark:bg-gray-700',
                        'text-gray-900 dark:text-white',
                        'focus:ring-1 focus:ring-primary-300'
                      )}
                    />
                    <button
                      onClick={addCondition}
                      disabled={!newCondition.field || !newCondition.value}
                      className={clsx(
                        'w-full flex items-center justify-center gap-1',
                        'px-3 py-1.5',
                        'bg-primary-250 hover:bg-primary-300',
                        'disabled:bg-gray-300 disabled:cursor-not-allowed',
                        'text-white text-sm font-semibold',
                        'rounded transition-colors'
                      )}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Condition
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            {isEditing && (
              <button
                onClick={() => {
                  deleteEdge(selectedEdge.id)
                  setSelectedEdge(null)
                }}
                className={clsx(
                  'w-full flex items-center justify-center gap-2',
                  'px-4 py-2',
                  'bg-red-500 hover:bg-red-600',
                  'text-white font-semibold',
                  'rounded-lg',
                  'transition-colors'
                )}
              >
                <Trash2 className="w-4 h-4" />
                Delete Edge
              </button>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  )
}

export default RightSidebar
