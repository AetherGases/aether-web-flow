import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/tokens.css'
import './styles/reset.css'
import './styles/global.css'
import './styles/high-contrast.css'
import App from './App.tsx'
import PreferencesProvider from './contexts/PreferencesProvider'
import AuthProvider from './contexts/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PreferencesProvider><AuthProvider><App /></AuthProvider></PreferencesProvider>
    </BrowserRouter>
  </StrictMode>,
)
