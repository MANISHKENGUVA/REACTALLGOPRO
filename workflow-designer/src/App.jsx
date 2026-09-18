import { useState, useEffect, useCallback } from 'react'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import WorkflowCanvas from './components/WorkflowCanvas'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import TopToolbar from './components/TopToolbar'
import { useWorkflowStore } from './stores/workflowStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import clsx from 'clsx'

function WorkflowDesigner() {
  const { theme, initFromJSON } = useWorkflowStore()
  const { fitView } = useReactFlow()
  
  // Initialize with sample data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/sample-workflow.json')
        if (response.ok) {
          const data = await response.json()
          initFromJSON(data)
          setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100)
        }
      } catch (error) {
        console.log('No sample data loaded, starting with empty canvas')
      }
    }
    loadData()
  }, [initFromJSON, fitView])
  
  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts()
  
  return (
    <div className={clsx(
      'h-screen w-screen flex flex-col overflow-hidden',
      'bg-gray-50 dark:bg-gray-950',
      'text-gray-900 dark:text-gray-100'
    )}>
      {/* Top Toolbar */}
      <TopToolbar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Palette */}
        <LeftSidebar />
        
        {/* Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>
        
        {/* Right Sidebar - Inspector */}
        <RightSidebar />
      </div>
    </div>
  )
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  )
}

export default App
