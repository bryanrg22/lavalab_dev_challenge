import { useState, useEffect } from "react"
import { productsAPI, materialsAPI } from "../services/api"

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

const ProductIcon = ({ color = "red" }) => {
  // Product SVG icon (shirt/box icon)
  const ProductSVG = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16l-2 4v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8L4 4z" />
      <path d="M4 4l2-2h12l2 2" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
    </svg>
  )

  return (
    <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
      {color === "red" ? (
        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      ) : color === "black" ? (
        <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      ) : color === "white" ? (
        <div className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      ) : color === "blue" ? (
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      ) : color === "green" ? (
        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      ) : color === "purple" ? (
        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      ) : (
        <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
          <ProductSVG />
        </div>
      )}
    </div>
  )
}

// Data will be loaded from backend APIs

function Products() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBomModal, setShowBomModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    color: "red",
    price: "",
    bom: []
  })

  // Load data from backend on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [productsData, materialsData] = await Promise.all([
        productsAPI.getAll(),
        materialsAPI.getAll()
      ])
      
      setProducts(productsData)
      setMaterials(materialsData)
      
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = (products || []).filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateCanBuild = (bom) => {
    if (!bom || bom.length === 0) return 0
    
    return Math.min(...bom.map(item => {
      const material = materials.find(m => m.id === item.materialId)
      return material ? Math.floor(material.quantity / item.quantity) : 0
    }))
  }

  const handleAddProduct = async () => {
    try {
      // Ensure price is a number
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0
      }
      
      const createdProduct = await productsAPI.create(productData)
      setProducts(prev => [...prev, createdProduct])
      setShowAddModal(false)
      setNewProduct({ name: "", sku: "", color: "red", price: "", bom: [] })
    } catch (err) {
      console.error('Error adding product:', err)
      setError('Failed to add product. Please try again.')
    }
  }

  const handleViewBom = (product) => {
    setSelectedProduct(product)
    setShowBomModal(true)
  }

  return (
    <div className="flex-1 bg-white min-h-screen">
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
          <div className="flex items-center gap-4">
            {/* Premium Search Bar Design */}
            <div className="relative group">
              {/* Animated background glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              
              {/* Main search container */}
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-blue-300 overflow-hidden">
                {/* Search icon with enhanced styling */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <SearchIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-16 py-4 bg-transparent rounded-2xl focus:ring-0 focus:outline-none w-96 text-gray-900 placeholder-gray-500 font-medium"
                  style={{
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontWeight: 500,
                    fontSize: '15px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                />
                
                {/* Right side indicators */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {/* Search status indicator */}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400 font-medium">Live</span>
                  </div>
                  
                  {/* Clear button (appears when typing) */}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
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

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#444EAA] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
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

      {/* Products List */}
      <div className="px-6 pb-12">
        <div className="space-y-3">
          {(filteredProducts || []).map((product) => (
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
                    color: product.can_build > 0 ? '#10B981' : '#EF4444',
                    backgroundColor: product.can_build > 0 ? '#ECFDF5' : '#FEF2F2',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${product.can_build > 0 ? '#D1FAE5' : '#FECACA'}`
                  }}>
                    {product.can_build}
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
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Add New Product</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Custom T-Shirt - Red / M"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">SKU</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none text-gray-900 placeholder-gray-500"
                  placeholder="e.g., TSH-RED-M-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">Color</label>
                <select
                  value={newProduct.color}
                  onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none text-gray-900 bg-white"
                >
                  <option value="red">Red</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none text-gray-900 placeholder-gray-500"
                  placeholder="25.99"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>Bill of Materials</h3>
            <p className="text-sm mb-4" style={{ color: '#1A1A1A' }}>{selectedProduct.name}</p>
            
            <div className="space-y-3">
              {selectedProduct.bom && selectedProduct.bom.length > 0 ? (
                selectedProduct.bom.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm" style={{ color: '#1A1A1A' }}>{item.materialName}</span>
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{item.quantity}x</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">No Bill of Materials defined for this product.</p>
                  <p className="text-xs text-gray-500 mt-1">BOM functionality will be available in a future update.</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Can Build: {selectedProduct.can_build || 0}</strong>
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
