import { useState } from "react"

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </svg>
)

const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 16L9 10L15 16" />
    <path d="M3 8L9 14L15 8" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TShirtIcon = ({ color = "red" }) => (
  <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
    {color === "red" ? (
      <div className="w-8 h-8 bg-red-500 rounded"></div>
    ) : color === "black" ? (
      <div className="w-8 h-8 bg-gray-900 rounded"></div>
    ) : color === "white" ? (
      <div className="w-8 h-8 bg-white border border-gray-300 rounded"></div>
    ) : (
      <div className="w-8 h-8 bg-gray-500 rounded"></div>
    )}
  </div>
)

const inventoryData = [
  { id: 1, name: "Gildan T-Shirt - Red / M", color: "red", quantity: 13, unit: "24 PCS", required: 24 },
  { id: 2, name: "Gildan T-Shirt - Red / L", color: "red", quantity: 46, unit: "24 PCS", required: 24 },
  { id: 3, name: "Gildan T-Shirt - Black / S", color: "black", quantity: 21, unit: "24 PCS", required: 24 },
  { id: 4, name: "Gildan T-Shirt - Black / M", color: "black", quantity: 34, unit: "24 PCS", required: 24 },
  { id: 5, name: "Gildan T-Shirt - Black / L", color: "black", quantity: 27, unit: "24 PCS", required: 24 },
  { id: 6, name: "Gildan T-Shirt - White / S", color: "white", quantity: 34, unit: "24 PCS", required: 24 },
  { id: 7, name: "Gildan T-Shirt - White / M", color: "white", quantity: 51, unit: "24 PCS", required: 24 },
  { id: 8, name: "Gildan T-Shirt - White / L", color: "white", quantity: 29, unit: "24 PCS", required: 24 },
]

// Sample order queue data
const orderQueueData = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john@example.com",
    status: "Queued",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-20",
    items: [
      { materialId: 1, materialName: "Gildan T-Shirt - Red / M", quantity: 2 },
      { materialId: 5, materialName: "Gildan T-Shirt - Black / L", quantity: 1 }
    ],
    total: 77.97,
    canFulfill: true
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    status: "Reserved",
    orderDate: "2024-01-16",
    expectedDelivery: "2024-01-22",
    items: [
      { materialId: 6, materialName: "Gildan T-Shirt - White / S", quantity: 3 }
    ],
    total: 77.97,
    canFulfill: true
  },
  {
    id: "ORD-003",
    customer: "Mike Wilson",
    email: "mike@example.com",
    status: "Queued",
    orderDate: "2024-01-17",
    expectedDelivery: "2024-01-23",
    items: [
      { materialId: 1, materialName: "Gildan T-Shirt - Red / M", quantity: 5 }
    ],
    total: 129.95,
    canFulfill: false,
    shortage: "Insufficient Red / M inventory"
  }
]

const statusColors = {
  "Queued": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Reserved": "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-orange-100 text-orange-800 border-orange-200",
  "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
  "Fulfilled": "bg-green-100 text-green-800 border-green-200",
  "Cancelled": "bg-red-100 text-red-800 border-red-200"
}

function Materials({ sidebarExpanded }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Inventory")
  const [quantities, setQuantities] = useState(
    inventoryData.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {}),
  )
  const [showAddModal, setShowAddModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    color: "red",
    quantity: 0,
    unit: "24 PCS",
    required: 24
  })
  const [newOrder, setNewOrder] = useState({
    customer: "",
    email: "",
    items: []
  })

  const updateQuantity = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + change),
    }))
  }

  const filteredData = inventoryData.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredOrders = orderQueueData.filter((order) => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddMaterial = () => {
    // In real app, this would save to database
    console.log("Adding material:", newMaterial)
    setShowAddModal(false)
    setNewMaterial({ name: "", color: "red", quantity: 0, unit: "24 PCS", required: 24 })
  }

  const handleCreateOrder = () => {
    // In real app, this would save to database
    console.log("Creating order:", newOrder)
    setShowOrderModal(false)
    setNewOrder({ customer: "", email: "", items: [] })
  }

  const handleStatusChange = (orderId, newStatus) => {
    // In real app, this would update the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Uncut Sans, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' }}>
            <span style={{ color: '#1A1A1A' }}>Materials</span>
            <span style={{ color: '#AAAAAA' }}> / Blanks</span>
          </h1>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("Inventory")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "Inventory" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-50"
              }`}
              style={{
                fontFamily: 'Uncut Sans, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: activeTab === "Inventory" ? '#333333' : '#808080'
              }}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("Order Queue")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "Order Queue" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-50"
              }`}
              style={{
                fontFamily: 'Uncut Sans, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: activeTab === "Order Queue" ? '#333333' : '#808080'
              }}
            >
              Order Queue
            </button>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder={activeTab === "Inventory" ? "Search Materials" : "Search Orders"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none w-80 text-gray-900"
                style={{
                  fontFamily: 'Uncut Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#858585'
                }}
              />
            </div>

            <div className="flex gap-2">
              <button className="flex items-center justify-center w-9 h-9 text-[#6B7280] hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <FilterIcon />
              </button>

              <button className="flex items-center justify-center w-9 h-9 text-[#6B7280] hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <SortIcon />
              </button>
            </div>
          </div>

          <button 
            onClick={() => activeTab === "Inventory" ? setShowAddModal(true) : setShowOrderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#444EAA] rounded-lg hover:bg-[#3A3F8A] transition-colors"
          >
            <PlusIcon />
            <span style={{
              fontFamily: 'Uncut Sans, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#FFFFFF'
            }}>{activeTab === "Inventory" ? "Add New Material" : "Create Order"}</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="px-6 pb-6">
        {activeTab === "Inventory" ? (
          /* Inventory List */
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-6 px-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <TShirtIcon color={item.color} />
                  <span style={{ 
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000'
                  }}>
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center">
                  {/* Minus Button */}
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="flex items-center justify-center hover:bg-gray-50 transition-colors"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderTop: '1px solid #C19A4D',
                      borderBottom: '1px solid #C19A4D',
                      borderLeft: '1px solid #C19A4D',
                      borderRight: 'none',
                      borderTopLeftRadius: '4px',
                      borderBottomLeftRadius: '4px',
                      backgroundColor: '#FFFFFF',
                      padding: '15px'
                    }}
                  >
                    <MinusIcon />
                  </button>

                  {/* Quantity Display */}
                  <div 
                    className="flex flex-col"
                    style={{
                      width: '100px',
                      height: '48px',
                      border: '1px solid #C19A4D',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    {/* Quantity Number Section */}
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        height: '32px',
                        backgroundColor: '#FAF2E3',
                        borderBottom: '1px solid #C19A4D',
                        fontFamily: 'Chivo Mono, monospace',
                        fontWeight: 300,
                        fontSize: '20px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#333333'
                      }}
                    >
                      {quantities[item.id]}
                    </div>
                    {/* Unit Section */}
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        height: '16px',
                        backgroundColor: '#C19A4D',
                        fontFamily: 'Chivo Mono, monospace',
                        fontWeight: 300,
                        fontSize: '12px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#FFFFFF'
                      }}
                    >
                      {item.unit}
                    </div>
                  </div>

                  {/* Plus Button */}
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="flex items-center justify-center hover:bg-gray-50 transition-colors"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderTop: '1px solid #C19A4D',
                      borderBottom: '1px solid #C19A4D',
                      borderLeft: 'none',
                      borderRight: '1px solid #C19A4D',
                      borderTopRightRadius: '4px',
                      borderBottomRightRadius: '4px',
                      backgroundColor: '#FFFFFF',
                      padding: '15px'
                    }}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Order Queue List */
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span style={{ 
                        fontFamily: 'Uncut Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#000000'
                      }}>
                        {order.id}
                      </span>
                      <span style={{ 
                        fontFamily: 'Uncut Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#666666',
                        marginTop: '2px'
                      }}>
                        {order.customer} • {order.orderDate}
                      </span>
                    </div>

                    {!order.canFulfill && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-md">
                        <span className="text-xs font-medium">Shortage</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div style={{
                        fontFamily: 'Chivo Mono, monospace',
                        fontWeight: 300,
                        fontSize: '16px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#333333'
                      }}>
                        ${order.total.toFixed(2)}
                      </div>
                      <div style={{
                        fontFamily: 'Uncut Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#666666',
                        marginTop: '2px'
                      }}>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>

                    <div className="flex gap-1">
                      {Object.keys(statusColors).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            order.status === status 
                              ? statusColors[status] 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Material</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="e.g., Gildan T-Shirt - Red / M"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={newMaterial.color}
                  onChange={(e) => setNewMaterial({...newMaterial, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                >
                  <option value="red">Red</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity</label>
                <input
                  type="number"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({...newMaterial, quantity: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={newMaterial.unit}
                  onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="24 PCS"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMaterial}
                className="flex-1 px-4 py-2 bg-[#444EAA] text-white rounded-lg hover:bg-[#3A3F8A] transition-colors"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Order</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newOrder.email}
                  onChange={(e) => setNewOrder({...newOrder, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Items</label>
                <div className="text-sm text-gray-500 mb-2">
                  Select materials and quantities for this order
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {inventoryData.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{material.name}</span>
                      <input
                        type="number"
                        min="0"
                        className="w-16 px-2 py-1 text-sm border border-gray-200 rounded"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="flex-1 px-4 py-2 bg-[#444EAA] text-white rounded-lg hover:bg-[#3A3F8A] transition-colors"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Materials