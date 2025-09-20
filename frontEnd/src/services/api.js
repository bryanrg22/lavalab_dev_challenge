const API_BASE_URL = 'http://localhost:8001/api';

// Generic API helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Materials API
export const materialsAPI = {
  // Get all materials
  getAll: () => apiRequest('/materials/'),
  
  // Get material by ID
  getById: (id) => apiRequest(`/materials/${id}`),
  
  // Create new material
  create: (material) => apiRequest('/materials/', {
    method: 'POST',
    body: JSON.stringify(material)
  }),
  
  // Update material
  update: (id, material) => apiRequest(`/materials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(material)
  }),
  
  // Delete material
  delete: (id) => apiRequest(`/materials/${id}`, {
    method: 'DELETE'
  })
};

// Order Queue API
export const orderQueueAPI = {
  // Get all order queue items
  getAll: () => apiRequest('/order-queue/'),
  
  // Get order queue item by ID
  getById: (id) => apiRequest(`/order-queue/${id}`),
  
  // Create new order queue item
  create: (order) => apiRequest('/order-queue/', {
    method: 'POST',
    body: JSON.stringify(order)
  }),
  
  // Update order queue status
  updateStatus: (id, status) => apiRequest(`/order-queue/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  
  // Update order queue item
  update: (id, order) => apiRequest(`/order-queue/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order)
  })
};

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => apiRequest('/products/'),
  
  // Get product by ID
  getById: (id) => apiRequest(`/products/${id}`),
  
  // Create new product
  create: (product) => apiRequest('/products/', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  
  // Update product
  update: (id, product) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  
  // Delete product
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE'
  })
};

// Orders API (Fulfillment)
export const ordersAPI = {
  // Get all orders
  getAll: () => apiRequest('/orders/'),
  
  // Get order by ID
  getById: (id) => apiRequest(`/orders/${id}`),
  
  // Create new order
  create: (order) => apiRequest('/orders/', {
    method: 'POST',
    body: JSON.stringify(order)
  }),
  
  // Update order
  update: (id, order) => apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order)
  }),
  
  // Delete order
  delete: (id) => apiRequest(`/orders/${id}`, {
    method: 'DELETE'
  })
};

// Integrations API
export const integrationsAPI = {
  // Get all integrations
  getAll: () => apiRequest('/integrations/'),
  
  // Get integration by ID
  getById: (id) => apiRequest(`/integrations/${id}`),
  
  // Create new integration
  create: (integration) => apiRequest('/integrations/', {
    method: 'POST',
    body: JSON.stringify(integration)
  }),
  
  // Update integration
  update: (id, integration) => apiRequest(`/integrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(integration)
  }),
  
  // Delete integration
  delete: (id) => apiRequest(`/integrations/${id}`, {
    method: 'DELETE'
  })
};

// AI Assistant API
export const aiAPI = {
  // Get smart alerts
  getAlerts: () => apiRequest('/ai/alerts'),
  
  // Get inventory analysis
  getAnalysis: () => apiRequest('/ai/analysis'),
  
  // Chat with AI
  chat: (message) => apiRequest('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  })
};

// Health check
export const healthAPI = {
  check: () => apiRequest('/health')
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard stats
  getStats: () => apiRequest('/dashboard/stats'),
  
  // Get dashboard trends
  getTrends: () => apiRequest('/dashboard/trends')
};

// Default API export for convenience
const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE'
  }),
  // Include all the specific APIs
  materials: materialsAPI,
  orderQueue: orderQueueAPI,
  products: productsAPI,
  orders: ordersAPI,
  integrations: integrationsAPI,
  ai: aiAPI,
  health: healthAPI,
  dashboard: dashboardAPI
};

export default api;
