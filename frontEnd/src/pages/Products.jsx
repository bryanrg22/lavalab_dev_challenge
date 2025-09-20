import { useState } from "react"

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const ProductIcon = ({ color = "blue" }) => (
  <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
    {color === "blue" ? (
      <div className="w-8 h-8 bg-blue-500 rounded"></div>
    ) : color === "green" ? (
      <div className="w-8 h-8 bg-green-500 rounded"></div>
    ) : color === "purple" ? (
      <div className="w-8 h-8 bg-purple-500 rounded"></div>
    ) : (
      <div className="w-8 h-8 bg-gray-500 rounded"></div>
    )}
  </div>
)

// Sample materials data (would come from Materials page in real app)
const materialsData = [
  { id: 1, name: "Gildan T-Shirt - Red / M", color: "red", quantity: 13 },
  { id: 2, name: "Gildan T-Shirt - Red / L", color: "red", quantity: 46 },
  { id: 3, name: "Gildan T-Shirt - Black / S", color: "black", quantity: 21 },
  { id: 4, name: "Gildan T-Shirt - Black / M", color: "black", quantity: 34 },
  { id: 5, name: "Gildan T-Shirt - Black / L", color: "black", quantity: 27 },
  { id: 6, name: "Gildan T-Shirt - White / S", color: "white", quantity: 34 },
  { id: 7, name: "Gildan T-Shirt - White / M", color: "white", quantity: 51 },
  { id: 8, name: "Gildan T-Shirt - White / L", color: "white", quantity: 29 },
]

// Sample products with BOM (Bill of Materials)
const productsData = [
  {
    id: 1,
    name: "Custom T-Shirt - Red / M",
    sku: "TSH-RED-M-001",
    color: "blue",
    price: 25.99,
    bom: [
      { materialId: 1, materialName: "Gildan T-Shirt - Red / M", quantity: 1 },
      { materialId: 9, materialName: "Custom Print Design", quantity: 1 }
    ],
    canBuild: 13
  },
  {
    id: 2,
    name: "Custom T-Shirt - Black / L",
    sku: "TSH-BLK-L-002",
    color: "green",
    price: 25.99,
    bom: [
      { materialId: 5, materialName: "Gildan T-Shirt - Black / L", quantity: 1 },
      { materialId: 9, materialName: "Custom Print Design", quantity: 1 }
    ],
    canBuild: 27
  },
  {
    id: 3,
    name: "Custom T-Shirt - White / S",
    sku: "TSH-WHT-S-003",
    color: "purple",
    price: 25.99,
    bom: [
      { materialId: 6, materialName: "Gildan T-Shirt - White / S", quantity: 1 },
      { materialId: 9, materialName: "Custom Print Design", quantity: 1 }
    ],
    canBuild: 34
  }
]

function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBomModal, setShowBomModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    bom: []
  })

  const filteredProducts = productsData.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateCanBuild = (bom) => {
    if (!bom || bom.length === 0) return 0
    
    return Math.min(...bom.map(item => {
      const material = materialsData.find(m => m.id === item.materialId)
      return material ? Math.floor(material.quantity / item.quantity) : 0
    }))
  }

  const handleAddProduct = () => {
    // In real app, this would save to database
    console.log("Adding product:", newProduct)
    setShowAddModal(false)
    setNewProduct({ name: "", sku: "", price: "", bom: [] })
  }

  const handleViewBom = (product) => {
    setSelectedProduct(product)
    setShowBomModal(true)
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Uncut Sans, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' }}>
            <span style={{ color: '#1A1A1A' }}>Products</span>
            <span style={{ color: '#AAAAAA' }}> / SKUs</span>
          </h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search Products"
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
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
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
            }}>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-6 px-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <ProductIcon color={product.color} />
                <div>
                  <span style={{ 
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#000000'
                  }}>
                    {product.name}
                  </span>
                  <div style={{ 
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#666666',
                    marginTop: '2px'
                  }}>
                    SKU: {product.sku} • ${product.price}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div style={{
                    fontFamily: 'Chivo Mono, monospace',
                    fontWeight: 300,
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: product.canBuild > 0 ? '#10B981' : '#EF4444',
                    backgroundColor: product.canBuild > 0 ? '#ECFDF5' : '#FEF2F2',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${product.canBuild > 0 ? '#D1FAE5' : '#FECACA'}`
                  }}>
                    {product.canBuild}
                  </div>
                  <div style={{
                    fontFamily: 'Chivo Mono, monospace',
                    fontWeight: 300,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#6B7280',
                    marginTop: '2px'
                  }}>
                    Can Build
                  </div>
                </div>

                <button
                  onClick={() => handleViewBom(product)}
                  className="flex items-center gap-2 px-3 py-2 text-[#6B7280] hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <EditIcon />
                  <span style={{
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}>View BOM</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="e.g., Custom T-Shirt - Red / M"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="e.g., TSH-RED-M-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="25.99"
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
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-[#444EAA] text-white rounded-lg hover:bg-[#3A3F8A] transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOM Modal */}
      {showBomModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Bill of Materials</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedProduct.name}</p>
            
            <div className="space-y-3">
              {selectedProduct.bom.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{item.materialName}</span>
                  <span className="text-sm font-medium">{item.quantity}x</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Can Build: {selectedProduct.canBuild}</strong>
              </div>
            </div>
            
            <button
              onClick={() => setShowBomModal(false)}
              className="w-full mt-4 px-4 py-2 bg-[#444EAA] text-white rounded-lg hover:bg-[#3A3F8A] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
