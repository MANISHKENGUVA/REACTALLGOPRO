import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Settings, 
  Clock, 
  CheckCircle2, 
  XCircle,
  User,
  Users,
  Building2,
  Shield
} from 'lucide-react'
import clsx from 'clsx'

import { useActorStore, ICON_REGISTRY } from '../stores/actorStore'

// Node type configurations
const nodeTypeConfig = {
  FORM: {
    icon: FileText,
    gradient: 'from-blue-100 via-blue-50 to-white',
    darkGradient: 'from-blue-900 via-blue-800 to-blue-900',
    border: 'border-blue-300',
    darkBorder: 'border-blue-500',
    iconBg: 'bg-blue-500',
    color: '#4455E8',
    label: 'Form'
  },
  SYSTEM: {
    icon: Settings,
    gradient: 'from-purple-100 via-purple-50 to-white',
    darkGradient: 'from-purple-900 via-purple-800 to-purple-900',
    border: 'border-purple-300',
    darkBorder: 'border-purple-500',
    iconBg: 'bg-purple-500',
    color: '#7C45F8',
    label: 'System'
  },
  WAIT: {
    icon: Clock,
    gradient: 'from-amber-100 via-amber-50 to-white',
    darkGradient: 'from-amber-900 via-amber-800 to-amber-900',
    border: 'border-amber-300',
    darkBorder: 'border-amber-500',
    iconBg: 'bg-amber-500',
    color: '#F5A800',
    label: 'Wait'
  },
  TERMINAL: {
    icon: CheckCircle2,
    gradient: 'from-emerald-100 via-emerald-50 to-white',
    darkGradient: 'from-emerald-900 via-emerald-800 to-emerald-900',
    border: 'border-emerald-300',
    darkBorder: 'border-emerald-500',
    iconBg: 'bg-emerald-500',
    color: '#00BA6E',
    label: 'Terminal'
  }
}

function WorkflowNode({ data, selected }) {
  const getActor = useActorStore(state => state.getActor)
  const actorConfig = getActor(data.actor)
  const ActorIcon = (actorConfig?.icon && ICON_REGISTRY[actorConfig.icon]) ? ICON_REGISTRY[actorConfig.icon] : User
  const actorColorClass = actorConfig?.color || 'bg-indigo-500'

  const config = nodeTypeConfig[data.nodeType] || nodeTypeConfig.FORM
  const NodeIcon = config.icon


  // Terminal state overrides
  const isTerminalApproved = data.nodeType === 'TERMINAL' && data.terminalState === 'APPROVED'
  const isTerminalRejected = data.nodeType === 'TERMINAL' && data.terminalState === 'REJECTED'

  // Extract short node name from full ID
  const shortNodeId = data.nodeId.split('-').pop() || data.nodeId

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'relative group',
        'min-w-[220px] max-w-[280px]',
        'rounded-xl overflow-visible',
        'border-2',
        'shadow-node hover:shadow-node-hover hover:border-primary-400 dark:hover:border-primary-500',
        selected && 'ring-2 ring-offset-2 ring-primary-300 dark:ring-primary-400 shadow-lg',
        isTerminalApproved && 'border-emerald-400 dark:border-emerald-500',
        isTerminalRejected && 'border-red-400 dark:border-red-500',
        !isTerminalApproved && !isTerminalRejected && config.border,
        !isTerminalApproved && !isTerminalRejected && `dark:${config.darkBorder}`
      )}
      style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`
      }}
    >
      {/* Gradient background */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        config.gradient,
        `dark:bg-gradient-to-br dark:${config.darkGradient}`
      )} />

      {/* Content */}
      <div className="relative p-3">
        {/* Header with Node ID and Type */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={clsx(
              'p-1.5 rounded-lg shadow-sm',
              config.iconBg,
              'text-white'
            )}>
              <NodeIcon size={14} />
            </div>
            <span className={clsx(
              'text-xs font-bold font-mono',
              'text-gray-700 dark:text-gray-200'
            )}>
              {shortNodeId}
            </span>
          </div>
          
          {/* Terminal state indicator */}
          {data.nodeType === 'TERMINAL' && (
            <div className={clsx(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              isTerminalApproved && 'bg-emerald-500 text-white',
              isTerminalRejected && 'bg-red-500 text-white'
            )}>
              {isTerminalApproved ? (
                <>
                  <CheckCircle2 size={12} />
                  <span>Approved</span>
                </>
              ) : (
                <>
                  <XCircle size={12} />
                  <span>Rejected</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Component name */}
        <h3 className={clsx(
          'text-sm font-bold mb-1.5 truncate',
          'text-gray-900 dark:text-white'
        )}>
          {data.component}
        </h3>

        {/* Module */}
        <div className={clsx(
          'text-xs mb-2',
          'text-gray-500 dark:text-gray-400'
        )}>
          {data.module}
        </div>

        {/* Actor badge */}
        <div className="flex items-center gap-2">
          <div className={clsx(
            'flex items-center gap-1.5 px-2 py-0.5 rounded-full',
            'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm',
            'text-xs font-semibold',
            'text-gray-700 dark:text-gray-300'
          )}>
            <span className={clsx('w-2 h-2 rounded-full shrink-0', actorColorClass)} />
            <ActorIcon size={12} className="shrink-0" />
            <span className="truncate max-w-[110px]">{actorConfig?.label || data.actor}</span>
          </div>
          
          {data.version && (
            <span className={clsx(
              'text-xs',
              'text-gray-400 dark:text-gray-500'
            )}>
              v{data.version}
            </span>
          )}
        </div>

        {/* Description tooltip on hover */}
        {data.description && (
          <div className={clsx(
            'absolute left-0 right-0 -bottom-1 translate-y-full',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200',
            'z-10 pointer-events-none'
          )}>
            <div className={clsx(
              'mx-2 p-2 rounded-lg',
              'bg-gray-900 dark:bg-gray-700',
              'text-xs text-white',
              'shadow-lg'
            )}>
              {data.description}
            </div>
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}
        className={clsx(
          '!w-3.5 !h-3.5',
          '!border-2',
          '!bg-white dark:!bg-gray-800',
          '!border-primary-400 dark:!border-primary-400',
          'cursor-crosshair shadow-sm hover:!bg-primary-50 dark:hover:!bg-primary-950'
        )}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        className={clsx(
          '!w-3.5 !h-3.5',
          '!border-2',
          '!bg-white dark:!bg-gray-800',
          '!border-primary-400 dark:!border-primary-400',
          'cursor-crosshair shadow-sm hover:!bg-primary-50 dark:hover:!bg-primary-950'
        )}
      />
    </motion.div>
  )
}

export default memo(WorkflowNode)
