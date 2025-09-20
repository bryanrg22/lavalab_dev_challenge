"""
Database seeding script to populate the database with sample data
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Material, Product, Order, OrderItem, OrderQueue, Integration, Shortage, product_materials
from datetime import datetime, timedelta

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(OrderQueue).delete()
        db.query(Shortage).delete()
        db.query(product_materials).delete()
        db.query(Product).delete()
        db.query(Material).delete()
        db.query(Integration).delete()
        db.commit()
        
        # Seed Materials
        materials_data = [
            {"name": "Gildan T-Shirt - Red / M", "color": "red", "quantity": 13, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - Red / L", "color": "red", "quantity": 46, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - Black / S", "color": "black", "quantity": 21, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - Black / M", "color": "black", "quantity": 34, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - Black / L", "color": "black", "quantity": 27, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - White / S", "color": "white", "quantity": 34, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - White / M", "color": "white", "quantity": 51, "unit": "24 PCS", "required": 24},
            {"name": "Gildan T-Shirt - White / L", "color": "white", "quantity": 29, "unit": "24 PCS", "required": 24},
            {"name": "Custom Print Design", "color": "blue", "quantity": 100, "unit": "1 PCS", "required": 1},
        ]
        
        materials = []
        for material_data in materials_data:
            material = Material(**material_data)
            db.add(material)
            materials.append(material)
        
        db.commit()
        
        # Seed Products
        products_data = [
            {"name": "Custom T-Shirt - Red / M", "sku": "TSH-RED-M-001", "color": "red", "price": 25.99},
            {"name": "Custom T-Shirt - Black / L", "sku": "TSH-BLK-L-002", "color": "black", "price": 25.99},
            {"name": "Custom T-Shirt - White / S", "sku": "TSH-WHT-S-003", "color": "white", "price": 25.99},
        ]
        
        products = []
        for product_data in products_data:
            product = Product(**product_data)
            db.add(product)
            products.append(product)
        
        db.commit()
        
        # Create BOM relationships (Bill of Materials)
        # Product 1: Red M T-shirt needs Red M material + Print Design
        db.execute(product_materials.insert().values(product_id=1, material_id=1, quantity=1))
        db.execute(product_materials.insert().values(product_id=1, material_id=9, quantity=1))
        
        # Product 2: Black L T-shirt needs Black L material + Print Design
        db.execute(product_materials.insert().values(product_id=2, material_id=5, quantity=1))
        db.execute(product_materials.insert().values(product_id=2, material_id=9, quantity=1))
        
        # Product 3: White S T-shirt needs White S material + Print Design
        db.execute(product_materials.insert().values(product_id=3, material_id=6, quantity=1))
        db.execute(product_materials.insert().values(product_id=3, material_id=9, quantity=1))
        
        db.commit()
        
        # Seed Order Queue
        order_queue_data = [
            {
                "id": "ORD-001",
                "customer": "John Smith",
                "email": "john@example.com",
                "status": "Queued",
                "order_date": datetime.now() - timedelta(days=2),
                "expected_delivery": datetime.now() + timedelta(days=3),
                "total": 77.97,
                "can_fulfill": True
            },
            {
                "id": "ORD-002",
                "customer": "Sarah Johnson",
                "email": "sarah@example.com",
                "status": "Reserved",
                "order_date": datetime.now() - timedelta(days=1),
                "expected_delivery": datetime.now() + timedelta(days=4),
                "total": 77.97,
                "can_fulfill": True
            },
            {
                "id": "ORD-003",
                "customer": "Mike Wilson",
                "email": "mike@example.com",
                "status": "Queued",
                "order_date": datetime.now(),
                "expected_delivery": datetime.now() + timedelta(days=5),
                "total": 129.95,
                "can_fulfill": False,
                "shortage_reason": "Insufficient Red / M inventory"
            }
        ]
        
        for order_data in order_queue_data:
            order = OrderQueue(**order_data)
            db.add(order)
        
        db.commit()
        
        # Seed Orders (Fulfillment)
        orders_data = [
            {
                "id": "ORD-004",
                "customer": "Alice Brown",
                "email": "alice@example.com",
                "status": "In Progress",
                "order_date": datetime.now() - timedelta(days=3),
                "expected_delivery": datetime.now() + timedelta(days=2),
                "total": 77.97,
                "shipping_address": "123 Main St, City, State 12345"
            },
            {
                "id": "ORD-005",
                "customer": "Bob Davis",
                "email": "bob@example.com",
                "status": "Shipped",
                "order_date": datetime.now() - timedelta(days=5),
                "expected_delivery": datetime.now() - timedelta(days=1),
                "total": 25.99,
                "tracking_number": "1Z999AA1234567890",
                "shipping_address": "456 Oak Ave, City, State 12345"
            }
        ]
        
        for order_data in orders_data:
            order = Order(**order_data)
            db.add(order)
        
        db.commit()
        
        # Seed Order Items
        order_items_data = [
            {"order_id": "ORD-004", "product_id": 1, "product_name": "Custom T-Shirt - Red / M", "quantity": 2, "price": 25.99},
            {"order_id": "ORD-004", "product_id": 2, "product_name": "Custom T-Shirt - Black / L", "quantity": 1, "price": 25.99},
            {"order_id": "ORD-005", "product_id": 1, "product_name": "Custom T-Shirt - Red / M", "quantity": 1, "price": 25.99},
        ]
        
        for item_data in order_items_data:
            item = OrderItem(**item_data)
            db.add(item)
        
        db.commit()
        
        # Seed Integrations
        integrations_data = [
            {"name": "email", "display_name": "Email", "enabled": True},
            {"name": "shopify", "display_name": "Shopify", "enabled": False},
            {"name": "woocommerce", "display_name": "WooCommerce", "enabled": False},
            {"name": "slack", "display_name": "Slack", "enabled": True},
            {"name": "webhooks", "display_name": "Webhooks", "enabled": False},
        ]
        
        for integration_data in integrations_data:
            integration = Integration(**integration_data)
            db.add(integration)
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print(f"📦 Created {len(materials)} materials")
        print(f"🛍️ Created {len(products)} products")
        print(f"📋 Created {len(order_queue_data)} order queue items")
        print(f"📦 Created {len(orders_data)} orders")
        print(f"🔗 Created {len(integrations_data)} integrations")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
