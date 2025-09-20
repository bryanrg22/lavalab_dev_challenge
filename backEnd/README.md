# Tally Inventory Management Backend

A FastAPI-based backend for the Tally inventory management system.

## Features

- **Materials Management**: CRUD operations for inventory materials
- **Products Management**: Product catalog with Bill of Materials (BOM)
- **Order Management**: Order queue and fulfillment tracking
- **Integrations**: External service integrations (Email, Shopify, etc.)
- **Real-time Calculations**: Automatic inventory calculations and shortage detection

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **SQLite**: Lightweight database (can be switched to PostgreSQL)
- **Pydantic**: Data validation using Python type annotations

## Setup Instructions

### 1. Install Dependencies

```bash
cd backEnd
pip install -r requirements.txt
```

### 2. Run Database Seeding

```bash
python seed_data.py
```

This will create the database and populate it with sample data.

### 3. Start the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 4. View API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Materials
- `GET /api/materials/` - Get all materials
- `GET /api/materials/{id}` - Get material by ID
- `POST /api/materials/` - Create new material
- `PUT /api/materials/{id}` - Update material
- `DELETE /api/materials/{id}` - Delete material

### Order Queue
- `GET /api/order-queue/` - Get all order queue items
- `POST /api/order-queue/` - Create new order queue item
- `PUT /api/order-queue/{id}` - Update order queue status

### Products
- `GET /api/products/` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products/` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders (Fulfillment)
- `GET /api/orders/` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders/` - Create new order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Integrations
- `GET /api/integrations/` - Get all integrations
- `GET /api/integrations/{id}` - Get integration by ID
- `POST /api/integrations/` - Create new integration
- `PUT /api/integrations/{id}` - Update integration
- `DELETE /api/integrations/{id}` - Delete integration

## Database Schema

### Materials
- `id`: Primary key
- `name`: Material name
- `color`: Material color
- `quantity`: Available quantity
- `unit`: Unit of measurement
- `required`: Required quantity threshold

### Products
- `id`: Primary key
- `name`: Product name
- `sku`: Stock Keeping Unit
- `color`: Product color
- `price`: Product price
- `can_build`: Calculated quantity that can be built

### Orders
- `id`: Order ID
- `customer`: Customer name
- `email`: Customer email
- `status`: Order status
- `total`: Order total
- `tracking_number`: Shipping tracking number
- `shipping_address`: Delivery address

### Order Items
- `id`: Primary key
- `order_id`: Foreign key to Order
- `product_id`: Foreign key to Product
- `quantity`: Item quantity
- `price`: Item price

## Development

### Adding New Features

1. Create model in `models.py`
2. Create schema in `schemas.py`
3. Create service functions in `services/`
4. Add API endpoints in `main.py`

### Database Migrations

For production, consider using Alembic for database migrations:

```bash
pip install alembic
alembic init alembic
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=sqlite:///./tally.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Production Deployment

For production deployment:

1. Switch to PostgreSQL:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tally_db
   ```

2. Use a production ASGI server:
   ```bash
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

3. Set up proper environment variables and secrets management

## Testing

Test the API endpoints using the interactive documentation at `/docs` or with curl:

```bash
# Get all materials
curl http://localhost:8000/api/materials/

# Create a new material
curl -X POST http://localhost:8000/api/materials/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Material", "color": "blue", "quantity": 10, "unit": "PCS", "required": 5}'
```
