from sqlalchemy.orm import Session
from typing import List, Optional
from models import Material, OrderQueue
from schemas import MaterialCreate, MaterialUpdate, OrderQueueCreate, OrderQueueUpdate

def get_materials(db: Session, skip: int = 0, limit: int = 100) -> List[Material]:
    return db.query(Material).offset(skip).limit(limit).all()

def get_material(db: Session, material_id: int) -> Optional[Material]:
    return db.query(Material).filter(Material.id == material_id).first()

def create_material(db: Session, material: MaterialCreate) -> Material:
    material_data = material.dict()
    # Ensure quantity is always a valid integer
    if material_data.get('quantity') is None:
        material_data['quantity'] = 0
    db_material = Material(**material_data)
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

def update_material(db: Session, material_id: int, material_update: MaterialUpdate) -> Optional[Material]:
    db_material = db.query(Material).filter(Material.id == material_id).first()
    if db_material is None:
        return None
    
    update_data = material_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        # Ensure quantity is always a valid integer
        if field == 'quantity' and value is None:
            value = 0
        setattr(db_material, field, value)
    
    db.commit()
    db.refresh(db_material)
    return db_material

def delete_material(db: Session, material_id: int) -> bool:
    db_material = db.query(Material).filter(Material.id == material_id).first()
    if db_material is None:
        return False
    
    db.delete(db_material)
    db.commit()
    return True

# Order Queue functions
def get_order_queue(db: Session, skip: int = 0, limit: int = 100) -> List[OrderQueue]:
    return db.query(OrderQueue).offset(skip).limit(limit).all()

def get_order_queue_item(db: Session, order_id: str) -> Optional[OrderQueue]:
    return db.query(OrderQueue).filter(OrderQueue.id == order_id).first()

def create_order_queue_item(db: Session, order: OrderQueueCreate) -> OrderQueue:
    db_order = OrderQueue(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_queue_status(db: Session, order_id: str, order_update: OrderQueueUpdate) -> Optional[OrderQueue]:
    db_order = db.query(OrderQueue).filter(OrderQueue.id == order_id).first()
    if db_order is None:
        return None
    
    update_data = order_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order_queue_item(db: Session, order_id: str) -> bool:
    db_order = db.query(OrderQueue).filter(OrderQueue.id == order_id).first()
    if db_order is None:
        return False
    
    db.delete(db_order)
    db.commit()
    return True
