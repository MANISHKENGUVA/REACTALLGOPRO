import { create } from 'zustand'

export const DEFAULT_MODULES = [
  'APPLICATION',
  'CREDIT',
  'VERIFICATION',
  'APPROVAL',
  'GENERAL',
  'DISBURSEMENT',
  'DOCUMENTATION',
  'NOTIFICATION'
]

export const DEFAULT_OPERATORS = [
  { value: 'equals', label: 'equals (==)', symbol: '==', type: 'comparison' },
  { value: 'notEquals', label: 'not equals (!=)', symbol: '!=', type: 'comparison' },
  { value: 'greaterThan', label: 'greater than (>)', symbol: '>', type: 'numeric' },
  { value: 'lessThan', label: 'less than (<)', symbol: '<', type: 'numeric' },
  { value: 'greaterThanOrEqual', label: 'greater than or equal (>=)', symbol: '>=', type: 'numeric' },
  { value: 'lessThanOrEqual', label: 'less than or equal (<=)', symbol: '<=', type: 'numeric' },
  { value: 'contains', label: 'contains', symbol: 'contains', type: 'string' },
  { value: 'notContains', label: 'not contains', symbol: '!contains', type: 'string' },
  { value: 'startsWith', label: 'starts with', symbol: '^=', type: 'string' },
  { value: 'endsWith', label: 'ends with', symbol: '$=', type: 'string' },
  { value: 'in', label: 'in list', symbol: 'in', type: 'collection' },
  { value: 'notIn', label: 'not in list', symbol: 'not in', type: 'collection' },
  { value: 'matches', label: 'matches regex', symbol: '~=', type: 'regex' },
  { value: 'exists', label: 'field exists', symbol: 'exists', type: 'boolean' }
]

export const DEFAULT_NODE_TYPES = [
  { id: 'FORM', label: 'Form', description: 'Interactive user form or input screen' },
  { id: 'SYSTEM', label: 'System', description: 'Automated background execution or service integration' },
  { id: 'WAIT', label: 'Wait', description: 'Asynchronous holding state awaiting approval or webhook' },
  { id: 'TERMINAL', label: 'Terminal', description: 'Terminal approval or rejection outcome' }
]

const MODULES_STORAGE_KEY = 'workflow_designer_modules_v1'
const OPERATORS_STORAGE_KEY = 'workflow_designer_operators_v1'

const loadInitialModules = () => {
  try {
    const saved = localStorage.getItem(MODULES_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn('Failed to load modules from localStorage', e)
  }
  return DEFAULT_MODULES
}

const loadInitialOperators = () => {
  try {
    const saved = localStorage.getItem(OPERATORS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn('Failed to load operators from localStorage', e)
  }
  return DEFAULT_OPERATORS
}

export const useWorkflowConfigStore = create((set, get) => ({
  modules: loadInitialModules(),
  operators: loadInitialOperators(),
  nodeTypes: DEFAULT_NODE_TYPES,

  // Module CRUD
  addModule: (moduleName) => {
    const cleanName = moduleName.trim().toUpperCase()
    if (!cleanName) return
    const { modules } = get()
    if (modules.includes(cleanName)) return
    const updated = [...modules, cleanName]
    set({ modules: updated })
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn(e)
    }
  },

  removeModule: (moduleName) => {
    const { modules } = get()
    const updated = modules.filter(m => m !== moduleName)
    set({ modules: updated })
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn(e)
    }
  },

  resetModules: () => {
    set({ modules: DEFAULT_MODULES })
    try {
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(DEFAULT_MODULES))
    } catch (e) {
      console.warn(e)
    }
  },

  // Operator CRUD
  addOperator: (operator) => {
    const { operators } = get()
    if (operators.some(o => o.value === operator.value)) return
    const updated = [...operators, operator]
    set({ operators: updated })
    try {
      localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn(e)
    }
  },

  resetOperators: () => {
    set({ operators: DEFAULT_OPERATORS })
    try {
      localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(DEFAULT_OPERATORS))
    } catch (e) {
      console.warn(e)
    }
  },

  getOperator: (value) => {
    const { operators } = get()
    return operators.find(o => o.value === value) || { value, label: value, symbol: value }
  }
}))
