from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Association table for Product-Material relationships (BOM)
product_materials = Table(
    'product_materials',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True),
    Column('material_id', Integer, ForeignKey('materials.id'), primary_key=True),
    Column('quantity', Integer, nullable=False)
)

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    color = Column(String, nullable=False)
    quantity = Column(Integer, default=0)
    unit = Column(String, nullable=False)
    required = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to products through BOM
    products = relationship("Product", secondary=product_materials, back_populates="materials")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    color = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    can_build = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to materials through BOM
    materials = relationship("Material", secondary=product_materials, back_populates="products")
    # Relationship to order items
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    customer = Column(String, nullable=False)
    email = Column(String, nullable=False)
    status = Column(String, default="Queued")
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    expected_delivery = Column(DateTime(timezone=True))
    total = Column(Float, default=0.0)
    tracking_number = Column(String, nullable=True)
    shipping_address = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to order items
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    # Relationship to shortages
    shortages = relationship("Shortage", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class Shortage(Base):
    __tablename__ = "shortages"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)
    material_name = Column(String, nullable=False)
    needed = Column(Integer, nullable=False)
    available = Column(Integer, nullable=False)
    short = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="shortages")
    material = relationship("Material")

class OrderQueue(Base):
    __tablename__ = "order_queue"

    id = Column(String, primary_key=True, index=True)
    customer = Column(String, nullable=False)
    email = Column(String, nullable=False)
    status = Column(String, default="Queued")
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    expected_delivery = Column(DateTime(timezone=True))
    total = Column(Float, default=0.0)
    can_fulfill = Column(Boolean, default=True)
    shortage_reason = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    enabled = Column(Boolean, default=False)
    api_key = Column(Text, nullable=True)
    webhook_url = Column(Text, nullable=True)
    settings = Column(Text, nullable=True)  # JSON string for additional settings
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
