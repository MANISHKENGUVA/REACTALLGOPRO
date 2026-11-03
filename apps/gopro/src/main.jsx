import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/assets/scss2/main.scss'
import App from './App.jsx'
import { validateWorkflowConfiguration } from './workflow/workflowConfig'

validateWorkflowConfiguration()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
