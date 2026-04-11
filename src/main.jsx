import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ✅ Load external libraries first
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css"

// ✅ Load your own styles last so they override Bootstrap/SLDS
import "./index.css"

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
