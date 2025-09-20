"use client"

import { useState, useRef, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import IconGrid from "./pages/IconGrid"
import Materials from "./pages/Materials"
import Products from "./pages/Products"
import Fulfillment from "./pages/Fulfillment"
import Integrations from "./pages/Integrations"

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const sidebarRef = useRef(null)

  // Handle click outside sidebar to collapse it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Only collapse if sidebar is expanded
        if (sidebarExpanded) {
          setSidebarExpanded(false)
        }
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarExpanded])

  const handleSidebarClick = () => {
    // If sidebar is collapsed, expand it when clicked
    if (!sidebarExpanded) {
      setSidebarExpanded(true)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <div ref={sidebarRef} onClick={handleSidebarClick}>
        <Sidebar 
          expanded={sidebarExpanded} 
          onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        />
      </div>
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<IconGrid />} />
          <Route path="/materials" element={<Materials sidebarExpanded={sidebarExpanded} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/fulfillment" element={<Fulfillment />} />
          <Route path="/integrations" element={<Integrations />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
