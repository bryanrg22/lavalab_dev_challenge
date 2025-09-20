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

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16,8 20,8 23,11 23,16 16,16" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// Sample order data
const ordersData = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john@example.com",
    status: "In Progress",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-20",
    items: [
      { productId: 1, productName: "Custom T-Shirt - Red / M", quantity: 2, price: 25.99 },
      { productId: 2, productName: "Custom T-Shirt - Black / L", quantity: 1, price: 25.99 }
    ],
    total: 77.97,
    shortages: [
      { materialId: 1, materialName: "Gildan T-Shirt - Red / M", needed: 2, available: 1, short: 1 }
    ],
    trackingNumber: null,
    shippingAddress: "123 Main St, City, State 12345"
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    status: "Reserved",
    orderDate: "2024-01-16",
    expectedDelivery: "2024-01-22",
    items: [
      { productId: 3, productName: "Custom T-Shirt - White / S", quantity: 3, price: 25.99 }
    ],
    total: 77.97,
    shortages: [],
    trackingNumber: null,
    shippingAddress: "456 Oak Ave, City, State 12345"
  },
  {
    id: "ORD-003",
    customer: "Mike Wilson",
    email: "mike@example.com",
    status: "Shipped",
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-18",
    items: [
      { productId: 1, productName: "Custom T-Shirt - Red / M", quantity: 1, price: 25.99 }
    ],
    total: 25.99,
    shortages: [],
    trackingNumber: "1Z999AA1234567890",
    shippingAddress: "789 Pine St, City, State 12345"
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

function Fulfillment() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId, newStatus) => {
    // In real app, this would update the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  const handleAddTracking = (orderId) => {
    if (trackingNumber.trim()) {
      // In real app, this would update the database
      console.log(`Adding tracking number ${trackingNumber} to order ${orderId}`)
      setTrackingNumber("")
      setShowOrderDetail(false)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Uncut Sans, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' }}>
            <span style={{ color: '#1A1A1A' }}>Fulfillment</span>
            <span style={{ color: '#AAAAAA' }}> / Orders</span>
          </h1>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search Orders"
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
              style={{
                fontFamily: 'Uncut Sans, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              <option value="All">All Status</option>
              <option value="Queued">Queued</option>
              <option value="Reserved">Reserved</option>
              <option value="In Progress">In Progress</option>
              <option value="Shipped">Shipped</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
              onClick={() => handleViewOrder(order)}
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

                  {order.shortages.length > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-md">
                      <AlertIcon />
                      <span className="text-xs font-medium">{order.shortages.length} Shortage{order.shortages.length > 1 ? 's' : ''}</span>
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

                  {order.trackingNumber && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TruckIcon />
                      <span className="text-xs">Shipped</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Order Details - {selectedOrder.id}</h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Customer Information</h4>
              <div className="text-sm text-gray-600">
                <div><strong>Name:</strong> {selectedOrder.customer}</div>
                <div><strong>Email:</strong> {selectedOrder.email}</div>
                <div><strong>Address:</strong> {selectedOrder.shippingAddress}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{item.productName}</span>
                    <div className="text-sm">
                      <span className="font-medium">{item.quantity}x</span>
                      <span className="ml-2">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shortages */}
            {selectedOrder.shortages.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                  <AlertIcon />
                  Material Shortages
                </h4>
                <div className="space-y-2">
                  {selectedOrder.shortages.map((shortage, index) => (
                    <div key={index} className="text-sm text-red-700">
                      <div><strong>{shortage.materialName}</strong></div>
                      <div>Needed: {shortage.needed} • Available: {shortage.available} • Short: {shortage.short}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Management */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Order Status</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(statusColors).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedOrder.id, status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedOrder.status === status 
                        ? statusColors[status] 
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping */}
            {selectedOrder.status === "Shipped" && !selectedOrder.trackingNumber && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Add Tracking Number</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={() => handleAddTracking(selectedOrder.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {selectedOrder.trackingNumber && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckIcon />
                  Tracking Information
                </h4>
                <div className="text-sm text-green-700">
                  <div><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</div>
                  <div><strong>Expected Delivery:</strong> {selectedOrder.expectedDelivery}</div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderDetail(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fulfillment
