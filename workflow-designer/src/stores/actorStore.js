import { create } from 'zustand'
import { 
  User, 
  Users, 
  Building2, 
  Shield, 
  Settings, 
  Bot, 
  Briefcase, 
  Landmark, 
  UserCheck, 
  Stethoscope, 
  Wallet, 
  Scale, 
  Headphones, 
  FileCheck, 
  Truck, 
  Cpu 
} from 'lucide-react'

// Registry of available icons for actors
export const ICON_REGISTRY = {
  User,
  Users,
  Building2,
  Shield,
  Settings,
  Bot,
  Briefcase,
  Landmark,
  UserCheck,
  Stethoscope,
  Wallet,
  Scale,
  Headphones,
  FileCheck,
  Truck,
  Cpu
}

// Available color presets with tailwind class and hex color
export const COLOR_PRESETS = [
  { id: 'indigo', name: 'Indigo', bgClass: 'bg-indigo-500', textClass: 'text-indigo-500', hex: '#6366F1' },
  { id: 'pink', name: 'Pink', bgClass: 'bg-pink-500', textClass: 'text-pink-500', hex: '#EC4899' },
  { id: 'cyan', name: 'Cyan', bgClass: 'bg-cyan-500', textClass: 'text-cyan-500', hex: '#06B6D4' },
  { id: 'violet', name: 'Violet', bgClass: 'bg-violet-500', textClass: 'text-violet-500', hex: '#8B5CF6' },
  { id: 'slate', name: 'Slate', bgClass: 'bg-slate-500', textClass: 'text-slate-500', hex: '#64748B' },
  { id: 'emerald', name: 'Emerald', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500', hex: '#10B981' },
  { id: 'amber', name: 'Amber', bgClass: 'bg-amber-500', textClass: 'text-amber-500', hex: '#F59E0B' },
  { id: 'rose', name: 'Rose', bgClass: 'bg-rose-500', textClass: 'text-rose-500', hex: '#F43F5E' },
  { id: 'sky', name: 'Sky', bgClass: 'bg-sky-500', textClass: 'text-sky-500', hex: '#0EA5E9' },
  { id: 'orange', name: 'Orange', bgClass: 'bg-orange-500', textClass: 'text-orange-500', hex: '#F97316' },
  { id: 'teal', name: 'Teal', bgClass: 'bg-teal-500', textClass: 'text-teal-500', hex: '#14B8A6' },
  { id: 'purple', name: 'Purple', bgClass: 'bg-purple-500', textClass: 'text-purple-500', hex: '#A855F7' }
]

// Default actors configuration
export const DEFAULT_ACTORS = [
  {
    id: 'BORROWER',
    label: 'Borrower',
    icon: 'User',
    color: 'bg-indigo-500',
    hex: '#6366F1',
    description: 'Primary loan applicant submitting the request',
    isSystem: true
  },
  {
    id: 'COBORROWER',
    label: 'Coborrower',
    icon: 'Users',
    color: 'bg-pink-500',
    hex: '#EC4899',
    description: 'Secondary applicant / guarantor for the loan',
    isSystem: true
  },
  {
    id: 'LENDER',
    label: 'Lender',
    icon: 'Building2',
    color: 'bg-cyan-500',
    hex: '#06B6D4',
    description: 'Financial institution or lending partner',
    isSystem: true
  },
  {
    id: 'MANAGER',
    label: 'Manager',
    icon: 'Shield',
    color: 'bg-violet-500',
    hex: '#8B5CF6',
    description: 'Internal approval authority / branch manager',
    isSystem: true
  },
  {
    id: 'SYSTEM',
    label: 'System',
    icon: 'Settings',
    color: 'bg-slate-500',
    hex: '#64748B',
    description: 'Automated background services and rule engines',
    isSystem: true
  }
]

const STORAGE_KEY = 'workflow_designer_actors_v1'

const loadInitialActors = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to load actors from localStorage', e)
  }
  return DEFAULT_ACTORS
}

export const useActorStore = create((set, get) => ({
  actors: loadInitialActors(),

  // Add a new actor
  addActor: (actorData) => {
    const { actors } = get()
    const id = (actorData.id || actorData.label || 'ACTOR').toUpperCase().replace(/\s+/g, '_')
    
    // Check if ID already exists
    if (actors.some(a => a.id === id)) {
      throw new Error(`Actor with ID "${id}" already exists`)
    }

    const colorPreset = COLOR_PRESETS.find(c => c.bgClass === actorData.color) || COLOR_PRESETS[0]

    const newActor = {
      id,
      label: actorData.label || id,
      icon: actorData.icon || 'User',
      color: actorData.color || colorPreset.bgClass,
      hex: actorData.hex || colorPreset.hex,
      description: actorData.description || '',
      isSystem: false
    }

    const updated = [...actors, newActor]
    set({ actors: updated })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to persist actors', e)
    }

    return newActor
  },

  // Update existing actor
  updateActor: (actorId, updates) => {
    const { actors } = get()
    const updated = actors.map(actor => {
      if (actor.id === actorId) {
        let hex = updates.hex || actor.hex
        if (updates.color && !updates.hex) {
          const match = COLOR_PRESETS.find(c => c.bgClass === updates.color)
          if (match) hex = match.hex
        }
        return {
          ...actor,
          ...updates,
          hex,
          id: actor.id // prevent altering ID of existing actor
        }
      }
      return actor
    })

    set({ actors: updated })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to persist actors', e)
    }
  },

  // Delete actor
  deleteActor: (actorId) => {
    const { actors } = get()
    const updated = actors.filter(a => a.id !== actorId)
    set({ actors: updated })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn('Failed to persist actors', e)
    }
  },

  // Reset to default actors
  resetToDefaults: () => {
    set({ actors: DEFAULT_ACTORS })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACTORS))
    } catch (e) {
      console.warn('Failed to persist actors', e)
    }
  },

  // Helper getters
  getActor: (id) => {
    const { actors } = get()
    return actors.find(a => a.id === id) || {
      id: id || 'UNKNOWN',
      label: id || 'Unknown',
      icon: 'User',
      color: 'bg-gray-500',
      hex: '#6B7280',
      description: ''
    }
  },

  getActorIconComponent: (iconKey) => {
    return ICON_REGISTRY[iconKey] || User
  }
}))
