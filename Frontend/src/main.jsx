import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { SidebarProvider } from './context/SidebarContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </HashRouter>
  </StrictMode>,
)
