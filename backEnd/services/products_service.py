from sqlalchemy.orm import Session
from typing import List, Optional
from models import Product, Material
from schemas import ProductCreate, ProductUpdate

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[Product]:
    return db.query(Product).offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()

def create_product(db: Session, product: ProductCreate) -> Product:
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: ProductUpdate) -> Optional[Product]:
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        return None
    
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> bool:
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        return False
    
    db.delete(db_product)
    db.commit()
    return True

def calculate_can_build(db: Session, product_id: int) -> int:
    """Calculate how many units of a product can be built based on available materials"""
    product = get_product(db, product_id)
    if not product or not product.materials:
        return 0
    
    # Get minimum quantity available for all required materials
    min_quantity = float('inf')
    for material in product.materials:
        # Get the quantity required from the association table
        association = db.query(product_materials).filter(
            product_materials.c.product_id == product_id,
            product_materials.c.material_id == material.id
        ).first()
        
        if association:
            required_quantity = association.quantity
            available_quantity = material.quantity
            can_build = available_quantity // required_quantity
            min_quantity = min(min_quantity, can_build)
    
    return int(min_quantity) if min_quantity != float('inf') else 0

def update_product_can_build(db: Session, product_id: int) -> Optional[Product]:
    """Update the can_build field for a product"""
    db_product = get_product(db, product_id)
    if db_product is None:
        return None
    
    db_product.can_build = calculate_can_build(db, product_id)
    db.commit()
    db.refresh(db_product)
    return db_product
