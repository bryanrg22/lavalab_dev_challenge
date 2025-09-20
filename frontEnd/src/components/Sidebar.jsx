import { Link, useLocation } from "react-router-dom"

const TallyLogo = () => (
  <img 
    src="/logo.svg" 
    alt="Tally Logo" 
    className="w-9 h-9"
  />
)

const MaterialsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const ProductsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const FulfillmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
)

const IntegrationsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const menuItems = [
  { path: "/materials", label: "Materials", icon: MaterialsIcon },
  { path: "/products", label: "Products", icon: ProductsIcon },
  { path: "/fulfillment", label: "Fulfillment", icon: FulfillmentIcon },
  { path: "/integrations", label: "Integrations", icon: IntegrationsIcon },
]

function Sidebar({ expanded = true, onToggle }) {
  const location = useLocation()

  return (
    <div className={`bg-white h-screen flex flex-col transition-all duration-300 border-r border-[#DEDEDE] ${
      expanded ? "w-[200px]" : "w-12"
    }`}>
      {/* Logo Section */}
      <div className={`${expanded ? 'px-6 py-6' : 'px-3 py-6'} flex justify-center`}>
        <div className="flex items-center gap-3">
          <TallyLogo />
          {expanded && (
            <span 
              style={{
                fontFamily: 'Uncut Sans, sans-serif',
                fontSize: '24px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#444EAA'
              }}
            >
              Tally
            </span>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1">
        <div className={`space-y-2 ${expanded ? 'px-3' : 'px-2'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-all duration-200 ${
                  expanded 
                    ? `gap-2 mx-3 px-3 py-2 rounded ${
                        isActive 
                          ? "bg-[#F3F4FC] border border-[#DADCEE]" 
                          : "text-[#6B7280] hover:bg-gray-50"
                      }`
                    : `justify-center p-2 rounded ${
                        isActive 
                          ? "bg-[#F3F4FC] border border-[#DADCEE]" 
                          : "text-[#6B7280] hover:bg-gray-50"
                      }`
                }`}
                style={{
                  borderRadius: '4px',
                  minHeight: '36px'
                }}
              >
                <div style={{ color: '#6B7280' }}>
                  <Icon />
                </div>
                {expanded && (
                  <span 
                    style={{
                      fontFamily: 'Uncut Sans, sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: isActive ? '#262626' : '#6B7280'
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className={`${expanded ? 'px-3' : 'px-2'} pb-6 space-y-4`}>
        {/* Logout */}
        <button className={`flex items-center transition-all duration-200 ${
          expanded 
            ? 'gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg w-full'
            : 'justify-center p-2 text-red-500 hover:bg-red-50 rounded'
        }`}>
          <LogoutIcon />
          {expanded && (
            <span 
              style={{
                fontFamily: 'Uncut Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#DC2626'
              }}
            >
              Logout
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className={`flex items-center transition-all duration-200 ${
          expanded 
            ? 'gap-3 px-3 py-2.5'
            : 'justify-center p-2'
        }`}>
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
            <img 
              src="/pfp.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          {expanded && (
            <>
              <div className="flex-1 min-w-0">
                <p 
                  style={{
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#262626'
                  }}
                  className="truncate"
                >
                  Don't Ruin It
                </p>
                <p 
                  style={{
                    fontFamily: 'Uncut Sans, sans-serif',
                    fontSize: '10px',
                    fontWeight: 400,
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#6B7280'
                  }}
                  className="truncate"
                >
                  Pro Crafter
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar