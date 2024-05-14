import React from 'react'
import ReactDOM from 'react-dom/client'
import * as c2a from 'circom-2-arithc'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

c2a.init()
