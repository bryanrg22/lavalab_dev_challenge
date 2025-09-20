# Tally - LavaLab Dev Challenge Fall 2025

**Tally** is a modern inventory management system designed for small shops to efficiently manage materials, products, order queues, and fulfillment processes.

## 🚀 Live Demo

The application is fully functional with a modern React frontend and FastAPI backend. Navigate through different sections to explore all features!

## ✨ Features

### 📊 Dashboard
- Real-time overview of key metrics and KPIs
- Visual charts showing inventory trends and order statistics
- Quick access to critical alerts and notifications

### 📦 Materials Management
- **Interactive Inventory**: Search, filter, and sort materials with a premium search interface
- **Real-time Updates**: Add, edit, and adjust material quantities with instant feedback
- **Visual Icons**: Color-coded material icons (t-shirt graphics) for easy identification
- **Low Stock Alerts**: Automatic detection and highlighting of materials below required thresholds
- **Order Queue Integration**: Seamless transition from inventory to order processing

### 🛍️ Products Catalog
- **Product Management**: Create and manage product SKUs with detailed information
- **Bill of Materials (BOM)**: View product composition and material requirements
- **Build Calculations**: Automatic calculation of how many products can be built from available materials
- **Color-coded Icons**: Visual product icons with color-coded backgrounds
- **Advanced Search**: Premium search functionality with live filtering

### 📋 Order Queue & Fulfillment
- **Order Processing**: Complete order lifecycle management
- **Status Tracking**: Track orders through Queued → Reserved → In Progress → Shipped → Fulfilled/Cancelled
- **Material Reservation**: Automatic material allocation and reservation system
- **Customer Management**: Store and manage customer information and order history
- **Shipping Integration**: Tracking number management and delivery status updates

### 🔗 Integrations
- **Email Providers**: Integration stubs for transactional email services
- **E-commerce Platforms**: Ready-to-connect Shopify and other platform integrations
- **AI Assistant**: Built-in AI analysis and alert system for inventory optimization


## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router** for seamless navigation
- **Custom Components** with reusable UI elements
- **Real-time State Management** with React hooks

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping (ORM)
- **SQLite** - Lightweight database (production-ready for PostgreSQL)
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for production deployment

### Key Features
- **CORS-enabled** for seamless frontend-backend communication
- **RESTful API** design with comprehensive endpoints
- **Real-time calculations** for inventory and build quantities
- **Data validation** and error handling
- **Interactive API documentation** with Swagger UI

### Future Enhancements
- **Cloud Functions** for automated emails and notifications
- **Resend/SendGrid** integration for transactional emails
- **Demand forecasting** with EWMA algorithms
- **PostgreSQL** migration for production scaling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lavalab_dev_challenge
   ```

2. **Backend Setup**
   ```bash
   cd backEnd
   pip install -r requirements.txt
   python seed_data.py  # Creates database with sample data
   python main.py       # Starts FastAPI server on port 8001
   ```

3. **Frontend Setup**
   ```bash
   cd frontEnd
   npm install
   npm run dev         # Starts React dev server on port 5173
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

## 📱 Application Pages

### 🏠 Dashboard
- **Real-time Metrics**: Overview of inventory levels, order status, and key performance indicators
- **Visual Analytics**: Charts and graphs showing trends and patterns
- **Quick Actions**: Fast access to common tasks and alerts

### 📦 Materials Page
- **Premium Search Interface**: Advanced search with live filtering and sorting
- **Interactive Inventory**: Click +/- buttons to adjust material quantities in real-time
- **Visual Material Icons**: Color-coded t-shirt icons for easy material identification
- **Add New Materials**: Modal form for creating new inventory items
- **Order Queue Integration**: Seamless workflow from inventory to order processing

### 🛍️ Products Page
- **Product Catalog**: Complete list of all products with detailed information
- **Bill of Materials (BOM)**: View what materials are needed to build each product
- **Build Calculations**: Automatic calculation showing how many products can be built
- **Product Icons**: Visual product icons with color-coded backgrounds
- **Add New Products**: Form for creating new product SKUs with color selection

### 📋 Order Queue & Fulfillment
- **Order Management**: Complete order lifecycle from creation to fulfillment
- **Status Tracking**: Visual progress through order states
- **Material Reservation**: Automatic allocation and tracking of reserved materials
- **Customer Information**: Store and manage customer details and order history

### 🔗 Integrations
- **Service Connections**: Ready-to-connect integrations for email and e-commerce platforms
- **AI Assistant**: Built-in AI analysis for inventory optimization and alerts


## 🗄️ Database Schema

The application uses SQLite with SQLAlchemy ORM. Here's the current database structure:

### Materials Table
```sql
materials/
├── id (Primary Key)
├── name (String) - Material name
├── color (String) - Material color
├── quantity (Integer) - Available quantity
├── unit (String) - Unit of measurement (PCS, etc.)
├── required (Integer) - Required quantity threshold
├── created_at (DateTime) - Creation timestamp
└── updated_at (DateTime) - Last update timestamp
```

### Products Table
```sql
products/
├── id (Primary Key)
├── name (String) - Product name
├── sku (String, Unique) - Stock Keeping Unit
├── color (String) - Product color
├── price (Float) - Product price
├── can_build (Integer) - Calculated buildable quantity
├── created_at (DateTime) - Creation timestamp
└── updated_at (DateTime) - Last update timestamp
```

### Orders Table
```sql
orders/
├── id (Primary Key)
├── customer (String) - Customer name
├── email (String) - Customer email
├── status (String) - Order status
├── total (Float) - Order total
├── tracking_number (String) - Shipping tracking
├── shipping_address (String) - Delivery address
├── created_at (DateTime) - Creation timestamp
└── updated_at (DateTime) - Last update timestamp
```

### Order Items Table
```sql
order_items/
├── id (Primary Key)
├── order_id (Foreign Key) - References orders.id
├── product_id (Foreign Key) - References products.id
├── quantity (Integer) - Item quantity
└── price (Float) - Item price
```

## 📁 Project Structure

```
lavalab_dev_challenge/
│
├── frontEnd/                    # React Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AuthModal.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/              # Main application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Materials.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Fulfillment.jsx
│   │   │   ├── Integrations.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── services/           # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.js      # Tailwind CSS configuration
│
├── backEnd/                     # FastAPI Backend Application
│   ├── services/               # Business logic services
│   │   ├── materials_service.py
│   │   ├── products_service.py
│   │   ├── orders_service.py
│   │   ├── integrations_service.py
│   │   └── ai_service.py
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic data schemas
│   ├── database.py             # Database configuration
│   ├── seed_data.py            # Database seeding script
│   ├── requirements.txt        # Python dependencies
│   └── tally.db               # SQLite database file
│
└── README.md                   # This file
```

## 🎯 Key Features Implemented

### ✅ Completed Features
- **Full-stack Application**: React frontend with FastAPI backend
- **Materials Management**: Complete CRUD operations with real-time updates
- **Products Catalog**: Product management with BOM calculations
- **Order Processing**: Order queue and fulfillment workflow
- **Modern UI/UX**: Premium search interfaces and visual icons
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **API Documentation**: Interactive Swagger UI documentation
- **Data Validation**: Comprehensive input validation and error handling

### 🔧 Technical Achievements
- **CORS Configuration**: Seamless frontend-backend communication
- **Real-time Calculations**: Automatic inventory and build quantity calculations
- **Visual Design**: Color-coded icons and premium search interfaces
- **Error Handling**: Robust error handling and user feedback
- **Database Design**: Well-structured SQLite schema with relationships

## 🚀 Deployment

### Development
- Frontend: `npm run dev` (http://localhost:5173)
- Backend: `python main.py` (http://localhost:8001)

### Production Ready
- Backend can be deployed with Gunicorn + Uvicorn
- Frontend builds to static files for any web server
- Database can be migrated to PostgreSQL for scaling

## 📝 License

This project is licensed under the MIT License.

---

**Created by Bryan Ramirez-Gonzalez for LavaLab Fall 2025 Dev Challenge**

*Built with ❤️ using React, FastAPI, and modern web technologies*