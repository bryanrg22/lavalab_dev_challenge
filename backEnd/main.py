from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from datetime import datetime, timedelta
from sqlalchemy import func, and_
from typing import List

from database import get_db, engine
from models import Base, Material as MaterialModel, Product as ProductModel, Order as OrderModel, OrderQueue as OrderQueueModel, Integration as IntegrationModel, OrderItem, Shortage
from schemas import (
    Material, MaterialCreate, MaterialUpdate, 
    Product, ProductCreate, ProductUpdate, 
    Order, OrderCreate, OrderUpdate, 
    OrderQueue, OrderQueueCreate, OrderQueueUpdate,
    Integration, IntegrationCreate, IntegrationUpdate
)
from services import materials_service, products_service, orders_service, integrations_service
from services.ai_service import AIInventoryAssistant

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tally Inventory Management API",
    description="Backend API for Tally inventory management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Tally Inventory Management API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Materials endpoints
@app.get("/api/materials/", response_model=List[Material])
def get_materials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return materials_service.get_materials(db, skip=skip, limit=limit)

@app.get("/api/materials/{material_id}", response_model=Material)
def get_material(material_id: int, db: Session = Depends(get_db)):
    material = materials_service.get_material(db, material_id)
    if material is None:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@app.post("/api/materials/", response_model=Material)
def create_material(material: MaterialCreate, db: Session = Depends(get_db)):
    return materials_service.create_material(db, material)

@app.put("/api/materials/{material_id}", response_model=Material)
def update_material(material_id: int, material_update: MaterialUpdate, db: Session = Depends(get_db)):
    material = materials_service.update_material(db, material_id, material_update)
    if material is None:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@app.delete("/api/materials/{material_id}")
def delete_material(material_id: int, db: Session = Depends(get_db)):
    success = materials_service.delete_material(db, material_id)
    if not success:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"message": "Material deleted successfully"}

# Order Queue endpoints
@app.get("/api/order-queue/", response_model=List[OrderQueue])
def get_order_queue(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return materials_service.get_order_queue(db, skip=skip, limit=limit)

@app.post("/api/order-queue/", response_model=OrderQueue)
def create_order_queue_item(order: OrderQueueCreate, db: Session = Depends(get_db)):
    return materials_service.create_order_queue_item(db, order)

@app.put("/api/order-queue/{order_id}", response_model=OrderQueue)
def update_order_queue_status(order_id: str, order_update: OrderQueueUpdate, db: Session = Depends(get_db)):
    order = materials_service.update_order_queue_status(db, order_id, order_update)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Products endpoints
@app.get("/api/products/", response_model=List[Product])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return products_service.get_products(db, skip=skip, limit=limit)

@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = products_service.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return products_service.create_product(db, product)

@app.put("/api/products/{product_id}", response_model=Product)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    product = products_service.update_product(db, product_id, product_update)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    success = products_service.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Orders endpoints
@app.get("/api/orders/", response_model=List[Order])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return orders_service.get_orders(db, skip=skip, limit=limit)

@app.get("/api/orders/{order_id}", response_model=Order)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = orders_service.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.post("/api/orders/", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return orders_service.create_order(db, order)

@app.put("/api/orders/{order_id}", response_model=Order)
def update_order(order_id: str, order_update: OrderUpdate, db: Session = Depends(get_db)):
    order = orders_service.update_order(db, order_id, order_update)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.delete("/api/orders/{order_id}")
def delete_order(order_id: str, db: Session = Depends(get_db)):
    success = orders_service.delete_order(db, order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}

# Integrations endpoints
@app.get("/api/integrations/", response_model=List[Integration])
def get_integrations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return integrations_service.get_integrations(db, skip=skip, limit=limit)

@app.get("/api/integrations/{integration_id}", response_model=Integration)
def get_integration(integration_id: int, db: Session = Depends(get_db)):
    integration = integrations_service.get_integration(db, integration_id)
    if integration is None:
        raise HTTPException(status_code=404, detail="Integration not found")
    return integration

@app.post("/api/integrations/", response_model=Integration)
def create_integration(integration: IntegrationCreate, db: Session = Depends(get_db)):
    return integrations_service.create_integration(db, integration)

@app.put("/api/integrations/{integration_id}", response_model=Integration)
def update_integration(integration_id: int, integration_update: IntegrationUpdate, db: Session = Depends(get_db)):
    integration = integrations_service.update_integration(db, integration_id, integration_update)
    if integration is None:
        raise HTTPException(status_code=404, detail="Integration not found")
    return integration

@app.delete("/api/integrations/{integration_id}")
def delete_integration(integration_id: int, db: Session = Depends(get_db)):
    success = integrations_service.delete_integration(db, integration_id)
    if not success:
        raise HTTPException(status_code=404, detail="Integration not found")
    return {"message": "Integration deleted successfully"}

# AI Assistant endpoints
@app.get("/api/ai/alerts")
def get_smart_alerts(db: Session = Depends(get_db)):
    """Get AI-powered smart alerts for inventory management"""
    try:
        ai_assistant = AIInventoryAssistant(db)
        alerts = ai_assistant.get_smart_alerts()
        return {"alerts": alerts, "count": len(alerts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating alerts: {str(e)}")

@app.get("/api/ai/analysis")
def get_inventory_analysis(db: Session = Depends(get_db)):
    """Get comprehensive inventory health analysis"""
    try:
        ai_assistant = AIInventoryAssistant(db)
        analysis = ai_assistant.analyze_inventory_health()
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing inventory: {str(e)}")

@app.post("/api/ai/chat")
def chat_with_ai(request: dict, db: Session = Depends(get_db)):
    """Chat with AI assistant for procurement insights"""
    try:
        query = request.get("message", "")
        if not query:
            raise HTTPException(status_code=400, detail="Message is required")
        
        ai_assistant = AIInventoryAssistant(db)
        response = ai_assistant.generate_procurement_insights(query)
        
        return {
            "response": response,
            "timestamp": datetime.now().isoformat(),
            "query": query
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing AI request: {str(e)}")

# Dashboard endpoints
@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get comprehensive dashboard statistics"""
    try:
        # Get current date and date ranges
        now = datetime.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        # Material stats
        total_materials = db.query(MaterialModel).count()
        low_stock_materials = db.query(MaterialModel).filter(MaterialModel.quantity < MaterialModel.required).count()
        out_of_stock_materials = db.query(MaterialModel).filter(MaterialModel.quantity == 0).count()
        
        # Product stats
        total_products = db.query(ProductModel).count()
        products_can_build = db.query(ProductModel).filter(ProductModel.can_build > 0).count()
        products_cannot_build = db.query(ProductModel).filter(ProductModel.can_build == 0).count()
        
        # Order stats
        total_orders = db.query(OrderModel).count()
        orders_today = db.query(OrderModel).filter(OrderModel.created_at >= today_start).count()
        orders_this_week = db.query(OrderModel).filter(OrderModel.created_at >= week_ago).count()
        orders_this_month = db.query(OrderModel).filter(OrderModel.created_at >= month_ago).count()
        
        # Order queue stats
        queued_orders = db.query(OrderQueueModel).filter(OrderQueueModel.status == "Queued").count()
        processing_orders = db.query(OrderQueueModel).filter(OrderQueueModel.status == "Processing").count()
        completed_orders = db.query(OrderQueueModel).filter(OrderQueueModel.status == "Completed").count()
        blocked_orders = db.query(OrderQueueModel).filter(OrderQueueModel.can_fulfill == False).count()
        
        # Revenue stats
        total_revenue = db.query(func.sum(OrderModel.total)).scalar() or 0
        revenue_today = db.query(func.sum(OrderModel.total)).filter(OrderModel.created_at >= today_start).scalar() or 0
        revenue_this_week = db.query(func.sum(OrderModel.total)).filter(OrderModel.created_at >= week_ago).scalar() or 0
        revenue_this_month = db.query(func.sum(OrderModel.total)).filter(OrderModel.created_at >= month_ago).scalar() or 0
        
        # Integration stats
        total_integrations = db.query(IntegrationModel).count()
        active_integrations = db.query(IntegrationModel).filter(IntegrationModel.enabled == True).count()
        
        # Shortage stats
        total_shortages = db.query(Shortage).count()
        critical_shortages = db.query(Shortage).filter(Shortage.short > 0).count()
        
        return {
            "materials": {
                "total": total_materials,
                "low_stock": low_stock_materials,
                "out_of_stock": out_of_stock_materials,
                "stock_health": round((total_materials - low_stock_materials - out_of_stock_materials) / max(total_materials, 1) * 100, 1)
            },
            "products": {
                "total": total_products,
                "can_build": products_can_build,
                "cannot_build": products_cannot_build,
                "build_rate": round(products_can_build / max(total_products, 1) * 100, 1)
            },
            "orders": {
                "total": total_orders,
                "today": orders_today,
                "this_week": orders_this_week,
                "this_month": orders_this_month
            },
            "order_queue": {
                "queued": queued_orders,
                "processing": processing_orders,
                "completed": completed_orders,
                "blocked": blocked_orders,
                "fulfillment_rate": round(completed_orders / max(completed_orders + blocked_orders, 1) * 100, 1)
            },
            "revenue": {
                "total": round(total_revenue, 2),
                "today": round(revenue_today, 2),
                "this_week": round(revenue_this_week, 2),
                "this_month": round(revenue_this_month, 2)
            },
            "integrations": {
                "total": total_integrations,
                "active": active_integrations,
                "uptime": round(active_integrations / max(total_integrations, 1) * 100, 1)
            },
            "shortages": {
                "total": total_shortages,
                "critical": critical_shortages,
                "impact_rate": round(critical_shortages / max(total_shortages, 1) * 100, 1)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")

@app.get("/api/dashboard/trends")
def get_dashboard_trends(db: Session = Depends(get_db)):
    """Get trend data for charts"""
    try:
        # Get last 30 days of data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        # Get all orders from the last 30 days
        recent_orders = db.query(OrderModel).filter(OrderModel.created_at >= start_date).all()
        
        # Group orders by date (simplified approach)
        daily_orders_dict = {}
        for order in recent_orders:
            date_str = order.created_at.date().isoformat()
            if date_str not in daily_orders_dict:
                daily_orders_dict[date_str] = {"orders": 0, "revenue": 0.0}
            daily_orders_dict[date_str]["orders"] += 1
            daily_orders_dict[date_str]["revenue"] += order.total or 0.0
        
        # Convert to list format
        daily_orders = [
            {
                "date": date,
                "orders": data["orders"],
                "revenue": data["revenue"]
            }
            for date, data in sorted(daily_orders_dict.items())
        ]
        
        # Material stock trends (simplified - showing current vs required)
        material_stock = db.query(
            MaterialModel.name,
            MaterialModel.quantity,
            MaterialModel.required,
            MaterialModel.color
        ).all()
        
        # Product buildability trends
        product_buildability = db.query(
            ProductModel.name,
            ProductModel.can_build,
            ProductModel.price,
            ProductModel.color
        ).all()
        
        # Order status distribution
        order_status_dist = db.query(
            OrderQueueModel.status,
            func.count(OrderQueueModel.id).label('count')
        ).group_by(OrderQueueModel.status).all()
        
        return {
            "daily_orders": daily_orders,
            "material_stock": [
                {
                    "name": row.name,
                    "current": row.quantity,
                    "required": row.required,
                    "status": "critical" if row.quantity < row.required else "good" if row.quantity >= row.required * 1.5 else "low",
                    "color": row.color
                }
                for row in material_stock
            ],
            "product_buildability": [
                {
                    "name": row.name,
                    "can_build": row.can_build,
                    "price": float(row.price),
                    "color": row.color
                }
                for row in product_buildability
            ],
            "order_status_distribution": [
                {
                    "status": row.status,
                    "count": row.count
                }
                for row in order_status_dist
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trend data: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
