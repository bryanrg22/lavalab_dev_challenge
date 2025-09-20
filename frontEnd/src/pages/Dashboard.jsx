import React, { useState, useEffect } from 'react'
import api from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, trendsResponse] = await Promise.all([
        api.dashboard.getStats(),
        api.dashboard.getTrends()
      ])
      setStats(statsResponse)
      setTrends(trendsResponse)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <div className={`bg-gray-800 rounded-lg p-6 border-l-4 ${color} shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-500 text-xs ml-2">vs last period</span>
        </div>
      )}
    </div>
  )

  const ProgressBar = ({ value, max, color, label }) => (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  )

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800 rounded-lg p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats || !trends) return null

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Real-time business insights and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.total.toLocaleString()}`}
          subtitle={`$${stats.revenue.this_month.toLocaleString()} this month`}
          icon="💰"
          color="border-green-500"
        />
        <StatCard
          title="Active Orders"
          value={stats.order_queue.queued + stats.order_queue.processing}
          subtitle={`${stats.order_queue.completed} completed`}
          icon="📦"
          color="border-blue-500"
        />
        <StatCard
          title="Stock Health"
          value={`${stats.materials.stock_health}%`}
          subtitle={`${stats.materials.low_stock} low stock items`}
          icon="📊"
          color="border-yellow-500"
        />
        <StatCard
          title="Build Rate"
          value={`${stats.products.build_rate}%`}
          subtitle={`${stats.products.can_build}/${stats.products.total} products`}
          icon="🔧"
          color="border-purple-500"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Orders Today"
          value={stats.orders.today}
          subtitle={`${stats.orders.this_week} this week`}
          icon="📅"
          color="border-indigo-500"
        />
        <StatCard
          title="Critical Shortages"
          value={stats.shortages.critical}
          subtitle={`${stats.shortages.impact_rate}% impact rate`}
          icon="⚠️"
          color="border-red-500"
        />
        <StatCard
          title="Active Integrations"
          value={stats.integrations.active}
          subtitle={`${stats.integrations.uptime}% uptime`}
          icon="🔗"
          color="border-cyan-500"
        />
        <StatCard
          title="Fulfillment Rate"
          value={`${stats.order_queue.fulfillment_rate}%`}
          subtitle={`${stats.order_queue.blocked} blocked orders`}
          icon="✅"
          color="border-emerald-500"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Trends */}
        <ChartCard title="Order Trends (Last 30 Days)">
          <div className="space-y-4">
            {trends.daily_orders.slice(-7).map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {new Date(day.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">{day.orders} orders</span>
                  <span className="text-green-400 text-sm">${day.revenue.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Order Status Distribution */}
        <ChartCard title="Order Status Distribution">
          <div className="space-y-4">
            {trends.order_status_distribution.map((status, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 capitalize">{status.status}</span>
                  <span className="text-white">{status.count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500"
                    style={{ 
                      width: `${(status.count / trends.order_status_distribution.reduce((sum, s) => sum + s.count, 0)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Material Stock Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Material Stock Status">
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {trends.material_stock.map((material, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: material.color }}
                  ></div>
                  <span className="text-white text-sm">{material.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    material.status === 'critical' ? 'bg-red-900 text-red-300' :
                    material.status === 'low' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {material.status}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {material.current}/{material.required}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Product Buildability */}
        <ChartCard title="Product Buildability">
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {trends.product_buildability.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: product.color }}
                  ></div>
                  <span className="text-white text-sm">{product.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.can_build > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {product.can_build > 0 ? `${product.can_build} available` : 'Cannot build'}
                  </span>
                  <span className="text-gray-400 text-sm">${product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-left">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-medium">View Orders</div>
            <div className="text-sm opacity-80">Manage order queue</div>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Inventory</div>
            <div className="text-sm opacity-80">Check stock levels</div>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors text-left">
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-medium">AI Assistant</div>
            <div className="text-sm opacity-80">Get insights</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
