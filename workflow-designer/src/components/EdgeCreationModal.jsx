import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  GitBranch, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import clsx from 'clsx'
import { useWorkflowStore } from '../stores/workflowStore'
import { useWorkflowConfigStore } from '../stores/workflowConfigStore'

const FIELD_SUGGESTIONS = [
  'creditScore',
  'applicationStatus',
  'monthlyIncome',
  'loanAmount',
  'managerDecision',
  'ekycStatus',
  'employmentType',
  'panVerification'
]

export default function EdgeCreationModal({
  isOpen,
  onClose,
  initialSource = '',
  initialTarget = '',
  edgeToEdit = null
}) {
  const { nodes, edges, addEdge, updateEdge } = useWorkflowStore()
  const { operators } = useWorkflowConfigStore()

  // Generate next default edge ID (e.g. ED06)
  const generateNextEdgeId = () => {
    let maxNum = 0
    edges.forEach(e => {
      const match = (e.data?.edgeId || e.id)?.match(/ED(\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNum) maxNum = num
      }
    })
    return `ED${String(maxNum + 1).padStart(2, '0')}`
  }

  const [formData, setFormData] = useState({
    edgeId: '',
    sourceId: '',
    targetId: '',
    ruleType: 'AND',
    conditions: [],
    animated: false,
    description: ''
  })

  const [newCondition, setNewCondition] = useState({
    field: '',
    operator: 'equals',
    value: ''
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (edgeToEdit) {
        setFormData({
          edgeId: edgeToEdit.data?.edgeId || edgeToEdit.id,
          sourceId: edgeToEdit.source,
          targetId: edgeToEdit.target,
          ruleType: edgeToEdit.data?.ruleEngine?.type || 'AND',
          conditions: [...(edgeToEdit.data?.ruleEngine?.conditions || [])],
          animated: edgeToEdit.animated || false,
          description: edgeToEdit.data?.metadata?.description || ''
        })
      } else {
        setFormData({
          edgeId: generateNextEdgeId(),
          sourceId: initialSource || (nodes.length > 0 ? nodes[0].id : ''),
          targetId: initialTarget || (nodes.length > 1 ? nodes[1].id : ''),
          ruleType: 'AND',
          conditions: [],
          animated: false,
          description: ''
        })
      }
      setNewCondition({ field: '', operator: 'equals', value: '' })
      setError('')
    }
  }, [isOpen, edgeToEdit, initialSource, initialTarget, nodes, edges])

  if (!isOpen) return null

  const handleAddCondition = () => {
    if (!newCondition.field.trim()) {
      setError('Field name is required for condition')
      return
    }
    setError('')
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { 
        field: newCondition.field.trim(), 
        operator: newCondition.operator, 
        value: newCondition.value.trim() 
      }]
    }))
    setNewCondition({ field: '', operator: 'equals', value: '' })
  }

  const handleRemoveCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.sourceId) {
      setError('Please select a source node')
      return
    }
    if (!formData.targetId) {
      setError('Please select a target node')
      return
    }
    if (formData.sourceId === formData.targetId) {
      setError('Source and target nodes cannot be identical')
      return
    }

    const cleanEdgeId = formData.edgeId.trim() || generateNextEdgeId()

    // Check duplicate ID if new edge
    if (!edgeToEdit && edges.some(e => e.id === cleanEdgeId || e.data?.edgeId === cleanEdgeId)) {
      setError(`Edge ID "${cleanEdgeId}" already exists. Please pick a unique ID.`)
      return
    }

    const ruleEngine = {
      type: formData.ruleType,
      conditions: formData.conditions
    }

    const metadata = {
      description: formData.description.trim()
    }

    if (edgeToEdit) {
      updateEdge(edgeToEdit.id, {
        edgeId: cleanEdgeId,
        ruleEngine,
        metadata
      })
      // Also update xyflow props if needed
      useWorkflowStore.setState(state => ({
        edges: state.edges.map(ed => {
          if (ed.id === edgeToEdit.id) {
            return {
              ...ed,
              source: formData.sourceId,
              target: formData.targetId,
              animated: formData.animated
            }
          }
          return ed
        })
      }))
    } else {
      addEdge({
        edgeId: cleanEdgeId,
        sourceId: formData.sourceId,
        targetId: formData.targetId,
        ruleEngine,
        metadata
      })
    }

    onClose()
  }

  const sourceNode = nodes.find(n => n.id === formData.sourceId)
  const targetNode = nodes.find(n => n.id === formData.targetId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-250 text-white shadow-sm">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {edgeToEdit ? 'Edit Workflow Connection' : 'Connect Workflow Nodes'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Define transition logic, routing rules, and business decision conditions
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Source and Target Node Selection Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            {/* Source */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Source Node (From)
              </label>
              <select
                value={formData.sourceId}
                onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.id} - {n.data?.component} ({n.data?.actor})
                  </option>
                ))}
              </select>
            </div>

            {/* Transition Arrow */}
            <div className="flex justify-center text-primary-400">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Target */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Target Node (To)
              </label>
              <select
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.id} - {n.data?.component} ({n.data?.actor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Edge ID & Animated Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Edge ID *
              </label>
              <input
                type="text"
                required
                value={formData.edgeId}
                onChange={(e) => setFormData({ ...formData, edgeId: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="ED01"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Transition Description / Label
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. Credit score threshold met (> 700)"
              />
            </div>
          </div>

          {/* Condition Builder Section */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Routing Rule Conditions
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 font-bold">
                  {formData.conditions.length}
                </span>
              </div>

              {/* Match Strategy */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Match Strategy:</span>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ruleType: 'AND' })}
                    className={clsx(
                      'px-2.5 py-1 font-semibold transition-colors',
                      formData.ruleType === 'AND'
                        ? 'bg-primary-250 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    AND (All)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ruleType: 'OR' })}
                    className={clsx(
                      'px-2.5 py-1 font-semibold transition-colors',
                      formData.ruleType === 'OR'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    OR (Any)
                  </button>
                </div>
              </div>
            </div>

            {/* List of current conditions */}
            {formData.conditions.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                No conditions attached. This transition will execute unconditionally by default.
              </div>
            ) : (
              <div className="space-y-2">
                {formData.conditions.map((cond, idx) => {
                  const opObj = operators.find(o => o.value === cond.operator)
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        {idx > 0 && (
                          <span className={clsx(
                            'px-1.5 py-0.5 rounded text-[10px] font-bold text-white',
                            formData.ruleType === 'AND' ? 'bg-primary-250' : 'bg-purple-600'
                          )}>
                            {formData.ruleType}
                          </span>
                        )}
                        <span className="font-mono font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {cond.field}
                        </span>
                        <span className="text-gray-500 font-semibold">
                          {opObj ? opObj.symbol || opObj.label : cond.operator}
                        </span>
                        <span className="font-mono text-primary-400 font-bold bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded">
                          {String(cond.value)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(idx)}
                        className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add Condition Input Row */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                + Add Condition Rule
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                {/* Field */}
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    list="field-suggestions"
                    placeholder="Field name (e.g. creditScore)"
                    value={newCondition.field}
                    onChange={(e) => setNewCondition({ ...newCondition, field: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-400 font-mono"
                  />
                  <datalist id="field-suggestions">
                    {FIELD_SUGGESTIONS.map(f => (
                      <option key={f} value={f} />
                    ))}
                  </datalist>
                </div>

                {/* Operator */}
                <div className="sm:col-span-3">
                  <select
                    value={newCondition.operator}
                    onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-400"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value */}
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Value (e.g. 700, APPROVED)"
                    value={newCondition.value}
                    onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-400"
                  />
                </div>

                {/* Add Button */}
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="p-1.5 bg-primary-250 hover:bg-primary-300 text-white rounded-lg transition-colors shadow-sm"
                    title="Add Condition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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
              <Check className="w-4 h-4" />
              {edgeToEdit ? 'Save Changes' : 'Create Connection'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
