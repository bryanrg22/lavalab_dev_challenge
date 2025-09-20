import { useState, useEffect } from "react"
import { integrationsAPI } from "../services/api"

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const ShoppingCartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
)

const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

function Integrations() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState("")
  const [newApiKey, setNewApiKey] = useState("")

  // Load data from backend on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const integrationsData = await integrationsAPI.getAll()
      setIntegrations(integrationsData)
      
    } catch (err) {
      console.error('Error loading integrations:', err)
      setError('Failed to load integrations. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const toggleIntegration = async (integrationId) => {
    try {
      const integration = integrations.find(i => i.id === integrationId)
      if (integration) {
        const updatedIntegration = await integrationsAPI.update(integrationId, { 
          enabled: !integration.enabled 
        })
        setIntegrations(prev => 
          prev.map(i => i.id === integrationId ? updatedIntegration : i)
        )
      }
    } catch (err) {
      console.error('Error toggling integration:', err)
      setError('Failed to update integration. Please try again.')
    }
  }

  const updateIntegration = async (integrationId, field, value) => {
    try {
      const integration = integrations.find(i => i.id === integrationId)
      if (integration) {
        const updatedIntegration = await integrationsAPI.update(integrationId, { 
          [field]: value 
        })
        setIntegrations(prev => 
          prev.map(i => i.id === integrationId ? updatedIntegration : i)
        )
      }
    } catch (err) {
      console.error('Error updating integration:', err)
      setError('Failed to update integration. Please try again.')
    }
  }

  const handleSaveApiKey = async () => {
    if (selectedIntegration && newApiKey) {
      try {
        await updateIntegration(selectedIntegration, "api_key", newApiKey)
        setShowApiKeyModal(false)
        setNewApiKey("")
        setSelectedIntegration("")
      } catch (err) {
        console.error('Error saving API key:', err)
        setError('Failed to save API key. Please try again.')
      }
    }
  }

  // Get icon for integration type
  const getIcon = (name) => {
    switch (name) {
      case 'email': return <MailIcon />
      case 'shopify': return <ShoppingCartIcon />
      case 'woocommerce': return <ShoppingCartIcon />
      case 'slack': return <BellIcon />
      case 'webhooks': return <DatabaseIcon />
      default: return <DatabaseIcon />
    }
  }

  return (
    <div className="flex-1 bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Uncut Sans, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' }}>
            <span style={{ color: '#1A1A1A' }}>Integrations</span>
            <span style={{ color: '#AAAAAA' }}> / Connections</span>
          </h1>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#444EAA] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading integrations...</p>
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

      {/* Integration Cards */}
      <div className="px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(integrations || []).map((integration) => (
            <div
              key={integration.id}
              className="p-6 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    {getIcon(integration.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.display_name}</h3>
                    <p className="text-sm text-gray-600">Integration service</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => toggleIntegration(integration.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* API Key Management */}
              {integration.enabled && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">API Configuration</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {integration.api_key ? "API Key configured" : "API Key required"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedIntegration(integration.id)
                        setNewApiKey(integration.api_key || "")
                        setShowApiKeyModal(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      {integration.api_key ? "Update" : "Configure"}
                      <ExternalLinkIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Webhook URLs */}
              {integration.enabled && integration.id === "webhooks" && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Webhook URLs</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-xs text-gray-600">Order Created</span>
                      <span className="text-xs font-mono text-gray-800 truncate max-w-48">
                        {integrations.webhooks.orderCreated}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-xs text-gray-600">Order Shipped</span>
                      <span className="text-xs font-mono text-gray-800 truncate max-w-48">
                        {integrations.webhooks.orderShipped}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-xs text-gray-600">Low Stock</span>
                      <span className="text-xs font-mono text-gray-800 truncate max-w-48">
                        {integrations.webhooks.lowStock}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Indicator */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className={`w-2 h-2 rounded-full ${integration.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500">
                  {integration.enabled ? 'Connected' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Configure API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedIntegration === "email" && "Resend API Key"}
                  {selectedIntegration === "shopify" && "Shopify Access Token"}
                  {selectedIntegration === "woocommerce" && "WooCommerce Consumer Key"}
                  {selectedIntegration === "slack" && "Slack Webhook URL"}
                </label>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="Enter your API key"
                />
              </div>
              
              {selectedIntegration === "email" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                  <input
                    type="email"
                    value={integrations.email.fromEmail}
                    onChange={(e) => updateIntegration("email", "fromEmail", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                    placeholder="orders@tally.com"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="flex-1 px-4 py-2 bg-[#444EAA] text-white rounded-lg hover:bg-[#3A3F8A] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Integrations
