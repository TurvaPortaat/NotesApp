import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App.jsx'
import { DataProvider } from './data/dataContext.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App/>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>
);

