import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Download, 
  Layout, 
  Maximize2, 
  Search,
  Sun,
  Moon,
  Filter,
  Undo2,
  Redo2,
  FileJson,
  ChevronDown,
  X,
  Rows
} from 'lucide-react'
import clsx from 'clsx'
import { useReactFlow } from '@xyflow/react'
import { useWorkflowStore } from '../stores/workflowStore'
import { useActorStore } from '../stores/actorStore'
import { getAutoLayout, getSwimlaneLayout } from '../utils/autoLayout'


const typeFilters = [
  { value: null, label: 'All Types' },
  { value: 'FORM', label: 'Form' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'WAIT', label: 'Wait' },
  { value: 'TERMINAL', label: 'Terminal' }
]

function TopToolbar() {
  const { 
    workflow,
    nodes,
    edges,
    theme,
    toggleTheme,
    setSearchQuery,
    filterActor,
    setFilterActor,
    filterType,
    setFilterType,
    undo,
    redo,
    history,
    historyIndex,
    initFromJSON,
    setNodes,
    setEdges,
    addToHistory
  } = useWorkflowStore()
  
  const { actors } = useActorStore()
  const reactFlowInstance = useReactFlow()
  const fileInputRef = useRef(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [localSearch, setLocalSearch] = useState('')

  const dynamicActorFilters = [
    { value: null, label: 'All Actors' },
    ...actors.map(a => ({ value: a.id, label: a.label }))
  ]

  // Import JSON
  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result)
        initFromJSON(json)
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2, duration: 300 })
        }, 100)
      } catch (error) {
        console.error('Import error:', error)
        alert('Invalid JSON file. Please check the format.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Export JSON
  const handleExport = () => {
    const { exportJSON } = useWorkflowStore.getState()
    const json = exportJSON()
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${workflow.flowId || 'workflow'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Auto layout
  const handleAutoLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getAutoLayout(nodes, edges, {
      direction: 'LR',
      nodeSpacing: 100,
      rankSpacing: 150
    })
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    addToHistory(layoutedNodes, layoutedEdges, workflow)
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 500 })
    }, 50)
  }

  // Swimlane auto-layout by actor
  const handleSwimlaneLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getSwimlaneLayout(nodes, edges, actors, {
      laneHeight: 180,
      rankSpacing: 320,
      nodeWidth: 240,
      nodeHeight: 110,
      marginX: 100,
      marginY: 80
    })
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    addToHistory(layoutedNodes, layoutedEdges, workflow)
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 500 })
    }, 50)
  }

  // Fit view
  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 300 })
  }

  // Handle search
  const handleSearch = (value) => {
    setLocalSearch(value)
    setSearchQuery(value)
  }

  // Check if can undo/redo
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <header className={clsx(
      'flex items-center justify-between px-4 py-2',
      'bg-white dark:bg-gray-900',
      'border-b border-gray-200 dark:border-gray-800',
      'shadow-sm'
    )}>
      {/* Left Section - Title & Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-primary-300" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {workflow.flowName || 'Workflow Designer'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {workflow.flowId} v{workflow.version}
            </p>
          </div>
        </div>
      </div>

      {/* Center Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={clsx(
              'p-2 rounded-lg',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'transition-colors'
            )}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={clsx(
              'p-2 rounded-lg',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'transition-colors'
            )}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5',
            'bg-gray-100 dark:bg-gray-800',
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            'text-gray-700 dark:text-gray-300',
            'font-medium text-sm',
            'rounded-lg',
            'transition-colors'
          )}
        >
          <Upload className="w-4 h-4" />
          Import
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5',
            'bg-primary-250 hover:bg-primary-300',
            'dark:bg-primary-350 dark:hover:bg-primary-400',
            'text-white',
            'font-medium text-sm',
            'rounded-lg',
            'transition-colors'
          )}
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Auto Layout */}
        <button
          onClick={handleAutoLayout}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5',
            'bg-gray-100 dark:bg-gray-800',
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            'text-gray-700 dark:text-gray-300',
            'font-medium text-sm',
            'rounded-lg',
            'transition-colors'
          )}
          title="Auto Layout (Dagre)"
        >
          <Layout className="w-4 h-4" />
          Auto Layout
        </button>

        {/* Swimlane Layout */}
        <button
          onClick={handleSwimlaneLayout}
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5',
            'bg-indigo-50 dark:bg-indigo-950/50',
            'hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
            'text-indigo-700 dark:text-indigo-300',
            'border border-indigo-200 dark:border-indigo-800/80',
            'font-medium text-sm',
            'rounded-lg',
            'transition-colors shadow-sm'
          )}
          title="Swimlane Layout by Actor"
        >
          <Rows className="w-4 h-4" />
          Swimlane Layout
        </button>


        {/* Fit View */}
        <button
          onClick={handleFitView}
          className={clsx(
            'p-2 rounded-lg',
            'text-gray-500 dark:text-gray-400',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors'
          )}
          title="Fit View (Ctrl+1)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section - Search, Filter, Theme */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <Search className={clsx(
                    'absolute left-3 top-1/2 -translate-y-1/2',
                    'w-4 h-4 text-gray-400'
                  )} />
                  <input
                    type="text"
                    placeholder="Search nodes..."
                    value={localSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                    className={clsx(
                      'w-full pl-9 pr-8 py-1.5',
                      'bg-gray-100 dark:bg-gray-800',
                      'border border-gray-300 dark:border-gray-700',
                      'rounded-lg text-sm',
                      'text-gray-900 dark:text-white',
                      'placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-primary-300'
                    )}
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false)
                      handleSearch('')
                    }}
                    className={clsx(
                      'absolute right-2 top-1/2 -translate-y-1/2',
                      'p-1 rounded',
                      'text-gray-400 hover:text-gray-600',
                      'hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onClick={() => setShowSearch(true)}
                className={clsx(
                  'p-2 rounded-lg',
                  'text-gray-500 dark:text-gray-400',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors'
                )}
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filter */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5',
              'bg-gray-100 dark:bg-gray-800',
              'hover:bg-gray-200 dark:hover:bg-gray-700',
              'text-gray-700 dark:text-gray-300',
              'font-medium text-sm',
              'rounded-lg',
              'transition-colors',
              (filterActor || filterType) && 'ring-2 ring-primary-300'
            )}
          >
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={clsx(
                  'absolute right-0 top-full mt-2 z-50',
                  'w-64',
                  'bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'rounded-lg shadow-lg',
                  'overflow-hidden'
                )}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Filter by Actor
                  </h3>
                  <div className="space-y-1">
                    {dynamicActorFilters.map(filter => (
                      <button
                        key={String(filter.value)}
                        onClick={() => {
                          setFilterActor(filter.value)
                          setShowFilterMenu(false)
                        }}
                        className={clsx(
                          'w-full text-left px-2 py-1.5 rounded text-sm',
                          filterActor === filter.value 
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                </div>

                <div className="p-3">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Filter by Type
                  </h3>
                  <div className="space-y-1">
                    {typeFilters.map(filter => (
                      <button
                        key={String(filter.value)}
                        onClick={() => {
                          setFilterType(filter.value)
                          setShowFilterMenu(false)
                        }}
                        className={clsx(
                          'w-full text-left px-2 py-1.5 rounded text-sm',
                          filterType === filter.value 
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(filterActor || filterType) && (
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setFilterActor(null)
                        setFilterType(null)
                        setShowFilterMenu(false)
                      }}
                      className={clsx(
                        'w-full text-center text-sm text-red-500 hover:text-red-600',
                        'py-1'
                      )}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={clsx(
            'p-2 rounded-lg',
            'text-gray-500 dark:text-gray-400',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors'
          )}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  )
}

export default TopToolbar
