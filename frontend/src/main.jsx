import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/instrument-sans'
import '@fontsource/ibm-plex-mono/500.css'

import App from './App.jsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/formulario.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
