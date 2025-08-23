import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/assets/scss2/main.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
