from typing import List, Optional
from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    price: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True


class CustomerBase(BaseModel):
    name: str
    email: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    customer_id: Optional[int]
    product_ids: List[int]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    customer: Optional['Customer']
    products: List[Product]
    product_ids: Optional[List[int]] = None
    
    class Config:
        orm_mode = True

Order.update_forward_refs()