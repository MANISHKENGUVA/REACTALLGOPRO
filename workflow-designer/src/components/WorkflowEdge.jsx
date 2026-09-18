import { memo, useState } from 'react'
import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  getBezierPath,
  getSmoothStepPath
} from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, GitBranch, X } from 'lucide-react'
import clsx from 'clsx'

// Custom edge component
function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
  style
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Determine if this edge leads to rejection
  const isRejectionPath = data?.ruleEngine?.conditions?.some(c => 
    c.value === 'REJECTED' || 
    c.field?.includes('reject') ||
    c.field?.includes('timeout')
  )

  // Determine edge color based on conditions
  const edgeColor = isRejectionPath 
    ? '#F5381E' 
    : selected 
      ? '#6674F4' 
      : '#94a3b8'

  // Use bezier path for smooth curves
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16
  })

  return (
    <>
      {/* Invisible wider path for easier hovering */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Visible edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: selected ? 3 : 2,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease'
        }}
      />

      {/* Edge Label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all'
          }}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            window.dispatchEvent(new CustomEvent('workflow-edge-contextmenu', {
              detail: {
                edgeId: id,
                clientX: e.clientX,
                clientY: e.clientY
              }
            }))
          }}
        >
          {/* Edge ID badge */}
          <motion.div
            initial={false}
            animate={{
              scale: selected || isHovered ? 1.1 : 1
            }}
            className={clsx(
              'px-2 py-1 rounded-md',
              'text-xs font-bold font-mono',
              'border shadow-sm',
              'transition-colors duration-200',
              'cursor-pointer',
              selected || isHovered
                ? 'bg-white dark:bg-gray-800 border-primary-300 dark:border-primary-500 text-primary-600 dark:text-primary-400'
                : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
            )}
          >
            {data?.edgeId || id}
          </motion.div>

          {/* Hover tooltip showing conditions */}
          <AnimatePresence>
            {isHovered && data?.ruleEngine && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={clsx(
                  'absolute left-1/2 -translate-x-1/2 top-full mt-2',
                  'min-w-[200px] max-w-[300px]',
                  'p-3 rounded-lg',
                  'bg-gray-900 dark:bg-gray-700',
                  'text-white text-xs',
                  'shadow-xl z-50'
                )}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
                  <GitBranch size={14} className="text-primary-400" />
                  <span className="font-semibold">
                    {data.ruleEngine.type === 'AND' ? 'All conditions must match' : 'Any condition can match'}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  {data.ruleEngine.conditions?.map((condition, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-1">
                      {index > 0 && (
                        <span className={clsx(
                          'px-1.5 py-0.5 rounded text-[10px] font-bold',
                          data.ruleEngine.type === 'AND' ? 'bg-blue-600' : 'bg-purple-600'
                        )}>
                          {data.ruleEngine.type}
                        </span>
                      )}
                      <code className="px-1.5 py-0.5 rounded bg-gray-800 font-mono">
                        {condition.field}
                      </code>
                      <span className="text-gray-400">
                        {formatOperator(condition.operator)}
                      </span>
                      <code className="px-1.5 py-0.5 rounded bg-gray-800 font-mono">
                        {String(condition.value)}
                      </code>
                    </div>
                  ))}
                </div>

                {data.metadata?.description && (
                  <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
                    {data.metadata.description}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

// Format operator for display
function formatOperator(operator) {
  const operators = {
    'equals': '==',
    'notEquals': '!=',
    'greaterThan': '>',
    'lessThan': '<',
    'greaterThanOrEqual': '>=',
    'lessThanOrEqual': '<=',
    'contains': 'contains',
    'notContains': '!contains',
    'startsWith': 'starts with',
    'endsWith': 'ends with',
    'matches': 'matches',
    'in': 'in',
    'notIn': 'not in'
  }
  return operators[operator] || operator
}

export default memo(WorkflowEdge)
