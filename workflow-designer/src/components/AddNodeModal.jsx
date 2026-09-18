import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plus, 
  FileText, 
  Settings, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react'
import clsx from 'clsx'
import { useWorkflowStore } from '../stores/workflowStore'
import { useActorStore, ICON_REGISTRY } from '../stores/actorStore'
import { useWorkflowConfigStore } from '../stores/workflowConfigStore'
import { getNewNodePosition } from '../utils/autoLayout'

const NODE_TYPE_OPTIONS = [
  { id: 'FORM', label: 'Form', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800' },
  { id: 'SYSTEM', label: 'System', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800' },
  { id: 'WAIT', label: 'Wait', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' },
  { id: 'TERMINAL', label: 'Terminal', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' }
]

const normalizeVersion = (version) => {
  const match = String(version || '').match(/v?(\d+)/i)
  return match ? `V${match[1]}` : 'V1'
}

const normalizeSegment = (value, fallback) => {
  const segment = String(value || fallback)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return segment || fallback
}

const buildStateId = (actor, module, moduleVersion, node, nodeVersion) => [
  normalizeSegment(actor, 'SYSTEM'),
  normalizeSegment(module, 'GENERAL'),
  normalizeVersion(moduleVersion),
  normalizeSegment(node, 'NODE'),
  normalizeVersion(nodeVersion)
].join('-')

export default function AddNodeModal({ isOpen, onClose, initialActor, initialNodeType }) {
  const { nodes, addNode } = useWorkflowStore()
  const { actors } = useActorStore()
  const { modules, addModule } = useWorkflowConfigStore()

  // Generate next default node ID (e.g. ND06)
  const generateNextNodeId = () => {
    let maxNum = 0
    nodes.forEach(n => {
      const match = n.id?.match(/ND(\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNum) maxNum = num
      }
    })
    return `ND${String(maxNum + 1).padStart(2, '0')}`
  }

  const [formData, setFormData] = useState({
    nodeId: '',
    component: '',
    nodeType: 'FORM',
    actor: 'BORROWER',
    module: 'APPLICATION',
    customModule: '',
    terminalState: 'APPROVED',
    version: 'V1',
    moduleVersion: 'V1',
    description: ''
  })

  const [isCustomModule, setIsCustomModule] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const defaultActor = initialActor || (actors.length > 0 ? actors[0].id : 'BORROWER')
      const defaultType = initialNodeType || 'FORM'
      const defaultModule = modules.length > 0 ? modules[0] : 'GENERAL'

      setFormData({
        nodeId: generateNextNodeId(),
        component: '',
        nodeType: defaultType,
        actor: defaultActor,
        module: defaultModule,
        customModule: '',
        terminalState: 'APPROVED',
        version: 'V1',
        moduleVersion: 'V1',
        description: ''
      })
      setIsCustomModule(false)
      setError('')
    }
  }, [isOpen, initialActor, initialNodeType, actors, modules, nodes])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const cleanComponent = formData.component.trim()
    if (!cleanComponent) {
      setError('Component / Node Name is required')
      return
    }

    const cleanNodeName = formData.nodeId.trim()
    if (!cleanNodeName) {
      setError('Node ID is required')
      return
    }

    const nodeVersion = normalizeVersion(formData.version)
    const moduleVersion = normalizeVersion(formData.moduleVersion)
    const finalModule = isCustomModule 
      ? (formData.customModule.trim().toUpperCase() || 'GENERAL')
      : formData.module

    // Check duplicate ID
    const cleanNodeId = buildStateId(
      formData.actor,
      finalModule,
      moduleVersion,
      cleanNodeName,
      nodeVersion
    )

    if (nodes.some(n => n.id === cleanNodeId)) {
      setError(`Node with ID "${cleanNodeId}" already exists. Please choose a unique ID.`)
      return
    }

    if (isCustomModule && formData.customModule.trim()) {
      addModule(formData.customModule.trim())
    }

    // Compute nice initial position
    const position = getNewNodePosition(nodes)

    addNode({
      nodeId: cleanNodeId,
      nodeType: formData.nodeType,
      component: cleanComponent,
      actor: formData.actor,
      module: finalModule,
      version: nodeVersion,
      metadata: {
        node: cleanNodeName,
        moduleVersion,
        nodeVersion
      },
      description: formData.description.trim(),
      terminalState: formData.nodeType === 'TERMINAL' ? formData.terminalState : undefined,
      position
    })

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('workflow-focus-node', { detail: { nodeId: cleanNodeId } }))
    }, 100)

    onClose()
  }

  const selectedActorObj = actors.find(a => a.id === formData.actor) || actors[0]
  const ActorIconComponent = selectedActorObj 
    ? (ICON_REGISTRY[selectedActorObj.icon] || ICON_REGISTRY.User) 
    : ICON_REGISTRY.User

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-250 text-white shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Add Workflow Node
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure actor assignment, module, and state specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Node ID and Component Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Node ID *
              </label>
              <input
                type="text"
                required
                value={formData.nodeId}
                onChange={(e) => setFormData({ ...formData, nodeId: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 outline-none"
                placeholder="ND01"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Component / Node Name *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={formData.component}
                onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 outline-none"
                placeholder="e.g. IdentityVerificationForm"
              />
            </div>
          </div>

          {/* Node Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Node Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NODE_TYPE_OPTIONS.map((type) => {
                const Icon = type.icon
                const isSelected = formData.nodeType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, nodeType: type.id })}
                    className={clsx(
                      'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all',
                      isSelected
                        ? `${type.bg} ring-2 ring-primary-300 dark:ring-primary-600 font-bold shadow-sm`
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    <Icon className={clsx('w-4 h-4', type.color)} />
                    <span>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conditional Terminal State */}
          {formData.nodeType === 'TERMINAL' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2"
            >
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                Terminal Outcome
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, terminalState: 'APPROVED' })}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all',
                    formData.terminalState === 'APPROVED'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  APPROVED
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, terminalState: 'REJECTED' })}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all',
                    formData.terminalState === 'REJECTED'
                      ? 'bg-red-500 text-white border-red-600 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  )}
                >
                  <XCircle className="w-4 h-4" />
                  REJECTED
                </button>
              </div>
            </motion.div>
          )}

          {/* Actor Selection (Dynamic) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
              Assigned Actor
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {actors.map((actor) => {
                const Icon = ICON_REGISTRY[actor.icon] || ICON_REGISTRY.User
                const isSelected = formData.actor === actor.id
                return (
                  <button
                    key={actor.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, actor: actor.id })}
                    className={clsx(
                      'flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left',
                      isSelected
                        ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/40 ring-2 ring-primary-300 dark:ring-primary-600 font-bold shadow-sm text-gray-900 dark:text-white'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <span className={clsx('p-1.5 rounded-lg text-white shrink-0', actor.color)}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{actor.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Module Selection (Dynamic + Add Custom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Module
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomModule(!isCustomModule)}
                  className="text-[11px] text-primary-300 dark:text-primary-400 hover:underline font-semibold"
                >
                  {isCustomModule ? 'Choose existing' : '+ New module'}
                </button>
              </div>

              {isCustomModule ? (
                <input
                  type="text"
                  placeholder="NEW_MODULE_NAME"
                  value={formData.customModule}
                  onChange={(e) => setFormData({ ...formData, customModule: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400 font-mono"
                />
              ) : (
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {modules.map((mod) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Node Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="V1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Module Version
              </label>
              <input
                type="text"
                value={formData.moduleVersion}
                onChange={(e) => setFormData({ ...formData, moduleVersion: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="V1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              placeholder="Provide context or instructions for this step..."
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-primary-250 hover:bg-primary-300 dark:bg-primary-350 dark:hover:bg-primary-400 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Node to Canvas
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
