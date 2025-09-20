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
      const createdProduct = await productsAPI.create(newProduct)
      setProducts(prev => [...prev, createdProduct])
      setShowAddModal(false)
      setNewProduct({ name: "", sku: "", price: "", bom: [] })
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
                  color: '#1A1A1A'
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>Add New Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="e.g., Custom T-Shirt - Red / M"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>SKU</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none"
                  placeholder="e.g., TSH-RED-M-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>Price</label>
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
                style={{ color: '#1A1A1A' }}
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
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>Bill of Materials</h3>
            <p className="text-sm mb-4" style={{ color: '#1A1A1A' }}>{selectedProduct.name}</p>
            
            <div className="space-y-3">
              {selectedProduct.bom.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm" style={{ color: '#1A1A1A' }}>{item.materialName}</span>
                  <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{item.quantity}x</span>
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
