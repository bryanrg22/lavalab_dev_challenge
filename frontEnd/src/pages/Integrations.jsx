import { useState } from "react"

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
  const [integrations, setIntegrations] = useState({
    email: {
      enabled: true,
      provider: "resend",
      apiKey: "re_1234567890abcdef",
      fromEmail: "orders@tally.com",
      lowStockAlerts: true,
      orderUpdates: true,
      weeklyDigest: false
    },
    shopify: {
      enabled: false,
      shopDomain: "",
      accessToken: "",
      webhookSecret: "",
      syncProducts: false,
      syncOrders: false
    },
    woocommerce: {
      enabled: false,
      siteUrl: "",
      consumerKey: "",
      consumerSecret: "",
      syncProducts: false,
      syncOrders: false
    },
    slack: {
      enabled: true,
      webhookUrl: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      lowStockAlerts: true,
      orderUpdates: false,
      weeklyDigest: true
    },
    webhooks: {
      enabled: true,
      orderCreated: "https://api.example.com/webhooks/order-created",
      orderShipped: "https://api.example.com/webhooks/order-shipped",
      lowStock: "https://api.example.com/webhooks/low-stock"
    }
  })

  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState("")
  const [newApiKey, setNewApiKey] = useState("")

  const toggleIntegration = (category, field) => {
    setIntegrations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }))
  }

  const updateIntegration = (category, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSaveApiKey = () => {
    if (selectedIntegration && newApiKey) {
      updateIntegration(selectedIntegration, "apiKey", newApiKey)
      setShowApiKeyModal(false)
      setNewApiKey("")
      setSelectedIntegration("")
    }
  }

  const integrationCards = [
    {
      id: "email",
      title: "Email Provider",
      description: "Send transactional emails and alerts",
      icon: <MailIcon />,
      provider: integrations.email.provider,
      enabled: integrations.email.enabled,
      config: [
        { key: "lowStockAlerts", label: "Low Stock Alerts", type: "toggle" },
        { key: "orderUpdates", label: "Order Status Updates", type: "toggle" },
        { key: "weeklyDigest", label: "Weekly Inventory Digest", type: "toggle" }
      ]
    },
    {
      id: "shopify",
      title: "Shopify",
      description: "Sync products and orders with Shopify store",
      icon: <ShoppingCartIcon />,
      provider: "shopify",
      enabled: integrations.shopify.enabled,
      config: [
        { key: "syncProducts", label: "Sync Products", type: "toggle" },
        { key: "syncOrders", label: "Sync Orders", type: "toggle" }
      ]
    },
    {
      id: "woocommerce",
      title: "WooCommerce",
      description: "Connect with WooCommerce store",
      icon: <ShoppingCartIcon />,
      provider: "woocommerce",
      enabled: integrations.woocommerce.enabled,
      config: [
        { key: "syncProducts", label: "Sync Products", type: "toggle" },
        { key: "syncOrders", label: "Sync Orders", type: "toggle" }
      ]
    },
    {
      id: "slack",
      title: "Slack",
      description: "Get notifications in Slack channels",
      icon: <BellIcon />,
      provider: "slack",
      enabled: integrations.slack.enabled,
      config: [
        { key: "lowStockAlerts", label: "Low Stock Alerts", type: "toggle" },
        { key: "orderUpdates", label: "Order Updates", type: "toggle" },
        { key: "weeklyDigest", label: "Weekly Digest", type: "toggle" }
      ]
    },
    {
      id: "webhooks",
      title: "Webhooks",
      description: "Custom webhook endpoints for events",
      icon: <DatabaseIcon />,
      provider: "webhooks",
      enabled: integrations.webhooks.enabled,
      config: []
    }
  ]

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Uncut Sans, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' }}>
            <span style={{ color: '#1A1A1A' }}>Integrations</span>
            <span style={{ color: '#AAAAAA' }}> / Connections</span>
          </h1>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrationCards.map((integration) => (
            <div
              key={integration.id}
              className="p-6 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.title}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => toggleIntegration(integration.id, "enabled")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Configuration Options */}
              {integration.enabled && integration.config.length > 0 && (
                <div className="space-y-3">
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Configuration</h4>
                    <div className="space-y-2">
                      {integration.config.map((config) => (
                        <div key={config.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{config.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={integrations[integration.id][config.key]}
                              onChange={() => toggleIntegration(integration.id, config.key)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Key Management */}
              {integration.enabled && integration.id !== "webhooks" && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">API Configuration</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {integrations[integration.id].apiKey ? "API Key configured" : "API Key required"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedIntegration(integration.id)
                        setNewApiKey(integrations[integration.id].apiKey || "")
                        setShowApiKeyModal(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      {integrations[integration.id].apiKey ? "Update" : "Configure"}
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
