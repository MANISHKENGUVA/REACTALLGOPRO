import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Edit2, RotateCcw, Check, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import { useActorStore, ICON_REGISTRY, COLOR_PRESETS } from '../stores/actorStore'

export default function ActorManagerModal({ isOpen, onClose }) {
  const { actors, addActor, updateActor, deleteActor, resetToDefaults } = useActorStore()

  const [isCreating, setIsCreating] = useState(false)
  const [editingActorId, setEditingActorId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    icon: 'User',
    color: 'bg-indigo-500',
    description: ''
  })

  if (!isOpen) return null

  const resetForm = () => {
    setFormData({
      id: '',
      label: '',
      icon: 'User',
      color: 'bg-indigo-500',
      description: ''
    })
    setIsCreating(false)
    setEditingActorId(null)
    setErrorMessage('')
  }

  const handleStartCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleStartEdit = (actor) => {
    setFormData({
      id: actor.id,
      label: actor.label,
      icon: actor.icon,
      color: actor.color,
      description: actor.description || ''
    })
    setEditingActorId(actor.id)
    setIsCreating(false)
    setErrorMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.label.trim()) {
      setErrorMessage('Actor label is required')
      return
    }

    try {
      if (editingActorId) {
        updateActor(editingActorId, {
          label: formData.label.trim(),
          icon: formData.icon,
          color: formData.color,
          description: formData.description.trim()
        })
      } else {
        const generatedId = (formData.id || formData.label).toUpperCase().replace(/[^A-Z0-9_]/g, '_')
        addActor({
          id: generatedId,
          label: formData.label.trim(),
          icon: formData.icon,
          color: formData.color,
          description: formData.description.trim()
        })
      }
      resetForm()
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save actor')
    }
  }

  const handleDelete = (actorId) => {
    if (window.confirm(`Are you sure you want to delete actor "${actorId}"? Nodes using this actor will need reassignment.`)) {
      deleteActor(actorId)
      if (editingActorId === actorId) resetForm()
    }
  }

  const SelectedIconComponent = ICON_REGISTRY[formData.icon] || ICON_REGISTRY.User

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-250 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Actor Configuration Manager
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure workflow actors, assigned visual colors, and role icons
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Create or Edit Form */}
          {(isCreating || editingActorId) && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="p-4 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50/40 dark:bg-primary-950/20 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-primary-100 dark:border-primary-900">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className={clsx('w-3 h-3 rounded-full', formData.color)} />
                  {editingActorId ? `Edit Actor (${editingActorId})` : 'Create New Actor'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Actor Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Underwriter, Appraiser"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 outline-none"
                  />
                </div>

                {!editingActorId && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Actor ID (Optional uppercase code)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UNDERWRITER"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Role description in the workflow pipeline"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 outline-none"
                />
              </div>

              {/* Color Preset Palette */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: preset.bgClass })}
                      className={clsx(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all',
                        formData.color === preset.bgClass
                          ? 'border-gray-900 dark:border-white ring-2 ring-primary-300 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800'
                      )}
                    >
                      <span className={clsx('w-3.5 h-3.5 rounded-full', preset.bgClass)} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Registry Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Role Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Object.entries(ICON_REGISTRY).map(([iconKey, IconComponent]) => (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconKey })}
                      className={clsx(
                        'flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 transition-all',
                        formData.icon === iconKey
                          ? 'border-primary-400 bg-white dark:bg-gray-800 ring-2 ring-primary-300 shadow-sm text-primary-500'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-white dark:hover:bg-gray-800'
                      )}
                      title={iconKey}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-[10px] truncate max-w-full">{iconKey}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-250 hover:bg-primary-300 rounded-lg shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editingActorId ? 'Update Actor' : 'Save Actor'}
                </button>
              </div>
            </motion.form>
          )}

          {/* Actor List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Registered Workflow Actors ({actors.length})
              </span>
              {!isCreating && !editingActorId && (
                <button
                  onClick={handleStartCreate}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-primary-250 hover:bg-primary-300 rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Actor
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {actors.map((actor) => {
                const IconComponent = ICON_REGISTRY[actor.icon] || ICON_REGISTRY.User
                return (
                  <div
                    key={actor.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx('p-2 rounded-xl text-white shadow-sm', actor.color)}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            {actor.label}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {actor.id}
                          </span>
                          {actor.isSystem && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                              System
                            </span>
                          )}
                        </div>
                        {actor.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {actor.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(actor)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Edit Actor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!actor.isSystem && (
                        <button
                          onClick={() => handleDelete(actor.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Actor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={() => {
              if (window.confirm('Reset all actors to system defaults?')) {
                resetToDefaults()
                resetForm()
              }
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}
