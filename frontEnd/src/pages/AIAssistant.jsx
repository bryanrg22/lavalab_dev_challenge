import { useState, useEffect } from "react"
import { aiAPI } from "../services/api"

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 013-3.66 2.5 2.5 0 010-3.2 2.5 2.5 0 01-2.96-3.08A2.5 2.5 0 019.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00-3-3.66 2.5 2.5 0 000-3.2 2.5 2.5 0 002.96-3.08A2.5 2.5 0 0014.5 2z" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
)

function AIAssistant() {
  const [activeTab, setActiveTab] = useState("Alerts")
  const [alerts, setAlerts] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      message: "Hello! I'm your AI procurement assistant. I can help you with inventory management, demand forecasting, and procurement decisions. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [alertsData, analysisData] = await Promise.all([
        aiAPI.getAlerts(),
        aiAPI.getAnalysis()
      ])
      
      setAlerts(alertsData.alerts || [])
      setAnalysis(analysisData)
      
    } catch (err) {
      console.error('Error loading AI data:', err)
      setError('Failed to load AI insights. Please check if the backend is running and OpenAI API key is configured.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: chatInput,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setChatLoading(true)

    try {
      const response = await aiAPI.chat(chatInput)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        message: response.response,
        timestamp: response.timestamp
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        message: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'CRITICAL':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      case 'LOW_STOCK':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      case 'REORDER':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'CRITICAL':
        return 'border-red-200 bg-red-50'
      case 'LOW_STOCK':
        return 'border-yellow-200 bg-yellow-50'
      case 'REORDER':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="flex-1 bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Uncut Sans, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' }}>
            <span style={{ color: '#1A1A1A' }}>AI Assistant</span>
            <span style={{ color: '#AAAAAA' }}> / Procurement Insights</span>
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("Alerts")}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === "Alerts" 
                ? "bg-white shadow-sm" 
                : "hover:bg-gray-50"
            }`}
            style={{
              fontFamily: 'Uncut Sans, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: activeTab === "Alerts" ? '#333333' : '#808080'
            }}
          >
            <AlertIcon />
            Smart Alerts
          </button>
          <button
            onClick={() => setActiveTab("Chat")}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === "Chat" 
                ? "bg-white shadow-sm" 
                : "hover:bg-gray-50"
            }`}
            style={{
              fontFamily: 'Uncut Sans, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: activeTab === "Chat" ? '#333333' : '#808080'
            }}
          >
            <ChatIcon />
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("Analysis")}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === "Analysis" 
                ? "bg-white shadow-sm" 
                : "hover:bg-gray-50"
            }`}
            style={{
              fontFamily: 'Uncut Sans, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: activeTab === "Analysis" ? '#333333' : '#808080'
            }}
          >
            <BrainIcon />
            Analysis
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#444EAA] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading AI insights...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={loadData}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content based on active tab */}
      <div className="px-6 pb-12">
        {activeTab === "Alerts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Smart Inventory Alerts</h2>
              <span className="text-sm text-gray-500">{alerts.length} alerts</span>
            </div>
            
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Good!</h3>
                <p className="text-gray-600">No critical inventory alerts at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Material: {alert.material_name}</span>
                          <span>Current Stock: {alert.current_quantity}</span>
                          {alert.days_remaining && <span>Days Remaining: {alert.days_remaining}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Chat" && (
          <div className="h-[600px] flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#444EAA] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm" style={{ color: message.type === 'user' ? '#FFFFFF' : '#1A1A1A' }}>{message.message}</p>
                    <p className="text-xs mt-1" style={{ 
                      color: message.type === 'user' ? '#E0E7FF' : '#1A1A1A' 
                    }}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span className="text-sm" style={{ color: '#1A1A1A' }}>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about inventory, procurement, or demand forecasting..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                style={{
                  fontFamily: 'Uncut Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#1A1A1A'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="px-4 py-2 bg-[#444EAA] text-white rounded-lg hover:bg-[#3A3F8A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <SendIcon />
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === "Analysis" && analysis && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Health Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Materials</h3>
                <p className="text-2xl font-bold text-gray-900">{analysis.total_materials}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Critical Alerts</h3>
                <p className="text-2xl font-bold text-red-600">{analysis.critical_alerts?.length || 0}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Low Stock Items</h3>
                <p className="text-2xl font-bold text-yellow-600">{analysis.low_stock_alerts?.length || 0}</p>
              </div>
            </div>

            {analysis.reorder_recommendations && analysis.reorder_recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reorder Recommendations</h3>
                <div className="space-y-3">
                  {analysis.reorder_recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{rec.material.name}</h4>
                      <p className="text-sm text-gray-700 mb-2">{rec.reasoning}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Current: {rec.current_stock}</span>
                        <span>Recommended: {rec.recommended_quantity}</span>
                        <span>Days Remaining: {rec.days_remaining}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIAssistant
