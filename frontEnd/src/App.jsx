"use client"

import { useState, useRef, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import InventoryLandingPage from "./pages/InventoryLandingPage"
import AuthModal from "./components/AuthModal"
import IconGrid from "./pages/IconGrid"
import Materials from "./pages/Materials"
import Products from "./pages/Products"
import Fulfillment from "./pages/Fulfillment"
import Integrations from "./pages/Integrations"
import AIAssistant from "./pages/AIAssistant"

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
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

  const handleAuth = () => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
  }

  const handleToggleAuthMode = () => {
    setIsSignUp(!isSignUp)
  }

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <>
        <InventoryLandingPage 
          onShowAuth={setShowAuthModal}
          onSetSignUp={setIsSignUp}
        />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          isSignUp={isSignUp}
          onToggleMode={handleToggleAuthMode}
          onAuthenticate={handleAuth}
        />
      </>
    )
  }

  // If authenticated, show the main app
  return (
    <div className="flex h-screen bg-gray-900">
      <div ref={sidebarRef} onClick={handleSidebarClick}>
        <Sidebar 
          expanded={sidebarExpanded} 
          onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<IconGrid />} />
          <Route path="/dashboard" element={<IconGrid />} />
          <Route path="/materials" element={<Materials sidebarExpanded={sidebarExpanded} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/fulfillment" element={<Fulfillment />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
