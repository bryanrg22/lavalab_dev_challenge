import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  Package, 
  TrendingUp, 
  Brain, 
  Zap, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  CheckCircle,
  Star,
  Users,
  Clock,
  Target,
  AlertTriangle,
  Database,
  Settings
} from "lucide-react"

const InventoryLandingPage = ({ onShowAuth, onSetSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false)

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Smart Inventory Management",
      description: "Track materials, products, and orders with real-time updates and automated alerts."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations for procurement, demand forecasting, and stock optimization."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description: "Comprehensive dashboards and reports to optimize your supply chain operations."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Alerts",
      description: "Never run out of stock again with smart notifications and automated reorder suggestions."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime and data backup protection."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Bill of Materials",
      description: "Track complex product structures and calculate build quantities automatically."
    }
  ]

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "50%", label: "Cost Reduction" },
    { number: "24/7", label: "AI Monitoring" },
    { number: "1000+", label: "Happy Users" }
  ]

  const useCases = [
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Prevent Stockouts",
      description: "AI alerts you before running out of critical materials"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Optimize Inventory",
      description: "Reduce carrying costs while maintaining service levels"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Streamline Operations",
      description: "Automate procurement and fulfillment processes"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tally
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsSignUp(false)
              onSetSignUp(false)
              onShowAuth(true)
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              !isSignUp 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignUp(true)
              onSetSignUp(true)
              onShowAuth(true)
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              isSignUp 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm mb-8">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Inventory Management
            <Zap className="w-4 h-4 ml-2 text-yellow-400" />
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block">Smart Inventory</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your supply chain with AI-powered insights, real-time tracking, and automated procurement recommendations. 
            <span className="text-blue-400 font-semibold">Never run out of materials again.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => {
                setIsSignUp(true)
                onSetSignUp(true)
                onShowAuth(true)
              }}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center"
            >
              <Target className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            <button className="group px-8 py-4 border border-blue-500/50 rounded-xl font-semibold text-lg hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Tired of Running Out of
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent block">
              Critical Materials?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stockouts can delay projects for weeks and cost thousands in lost productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-300">{useCase.title}</h3>
              <p className="text-gray-300">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need for
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Smart Inventory Management
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From small businesses to enterprise operations, Tally scales with your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl hover:border-blue-500/40 hover:bg-blue-900/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-white">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started in minutes with our simple 3-step process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Set Up Your Inventory</h3>
            <p className="text-gray-300">Add your materials, products, and suppliers to get started.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Analyzes Your Data</h3>
            <p className="text-gray-300">Our AI learns your patterns and provides smart recommendations.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Optimize & Scale</h3>
            <p className="text-gray-300">Reduce costs, prevent stockouts, and grow your business.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 py-20 text-center">
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-3xl p-12 hover:border-blue-500/40 hover:bg-blue-900/50 transition-all duration-300 group">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Your Inventory Management?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join businesses that have reduced inventory costs by 50% and eliminated stockouts.
          </p>
          <button
            onClick={() => {
              setIsSignUp(true)
              onSetSignUp(true)
              onShowAuth(true)
            }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-blue-500/20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tally
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Clock className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-blue-500/10 text-center text-gray-400">
            <p>&copy; 2025 Tally. Built for LavaLab 2025 Dev Challenge.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default InventoryLandingPage
