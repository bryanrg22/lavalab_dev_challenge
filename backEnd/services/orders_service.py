from sqlalchemy.orm import Session
from typing import List, Optional
from models import Order, OrderItem, Shortage, Material
from schemas import OrderCreate, OrderUpdate, OrderItemCreate, ShortageCreate

def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[Order]:
    return db.query(Order).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: str) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def create_order(db: Session, order: OrderCreate) -> Order:
    # Create the order
    db_order = Order(**order.dict(exclude={'items'}))
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order.items:
        db_item = OrderItem(**item_data.dict(), order_id=db_order.id)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order_id: str, order_update: OrderUpdate) -> Optional[Order]:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        return None
    
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: str) -> bool:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        return False
    
    db.delete(db_order)
    db.commit()
    return True

def check_order_shortages(db: Session, order_id: str) -> List[Shortage]:
    """Check for material shortages for an order"""
    order = get_order(db, order_id)
    if not order:
        return []
    
    shortages = []
    
    for item in order.items:
        # Get product materials (BOM)
        product = item.product
        if not product or not product.materials:
            continue
            
        for material in product.materials:
            # Calculate total needed for this order item
            needed = item.quantity * 1  # Assuming 1 material per product for simplicity
            available = material.quantity
            
            if needed > available:
                shortage = Shortage(
                    order_id=order_id,
                    material_id=material.id,
                    material_name=material.name,
                    needed=needed,
                    available=available,
                    short=needed - available
                )
                shortages.append(shortage)
    
    return shortages

def create_shortage(db: Session, shortage: ShortageCreate) -> Shortage:
    db_shortage = Shortage(**shortage.dict())
    db.add(db_shortage)
    db.commit()
    db.refresh(db_shortage)
    return db_shortage

def get_order_shortages(db: Session, order_id: str) -> List[Shortage]:
    return db.query(Shortage).filter(Shortage.order_id == order_id).all()
