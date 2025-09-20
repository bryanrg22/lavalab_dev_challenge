from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Material Schemas
class MaterialBase(BaseModel):
    name: str
    color: str
    quantity: int
    unit: str
    required: int

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    required: Optional[int] = None

class Material(MaterialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    color: str
    price: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    color: Optional[str] = None
    price: Optional[float] = None

class BOMItem(BaseModel):
    material_id: int
    material_name: str
    quantity: int

class Product(ProductBase):
    id: int
    can_build: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: str

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer: str
    email: str
    status: str = "Queued"
    expected_delivery: Optional[datetime] = None
    total: float = 0.0
    tracking_number: Optional[str] = None
    shipping_address: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = []

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_address: Optional[str] = None

class Order(OrderBase):
    id: str
    order_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

# Order Queue Schemas
class OrderQueueBase(BaseModel):
    customer: str
    email: str
    status: str = "Queued"
    expected_delivery: Optional[datetime] = None
    total: float = 0.0
    can_fulfill: bool = True
    shortage_reason: Optional[str] = None

class OrderQueueCreate(OrderQueueBase):
    pass

class OrderQueueUpdate(BaseModel):
    status: Optional[str] = None
    can_fulfill: Optional[bool] = None
    shortage_reason: Optional[str] = None

class OrderQueue(OrderQueueBase):
    id: str
    order_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Shortage Schemas
class ShortageBase(BaseModel):
    material_id: int
    material_name: str
    needed: int
    available: int
    short: int

class ShortageCreate(ShortageBase):
    order_id: str

class Shortage(ShortageBase):
    id: int
    order_id: str

    class Config:
        from_attributes = True

# Integration Schemas
class IntegrationBase(BaseModel):
    name: str
    display_name: str
    enabled: bool = False
    api_key: Optional[str] = None
    webhook_url: Optional[str] = None
    settings: Optional[str] = None

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationUpdate(BaseModel):
    enabled: Optional[bool] = None
    api_key: Optional[str] = None
    webhook_url: Optional[str] = None
    settings: Optional[str] = None

class Integration(IntegrationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
