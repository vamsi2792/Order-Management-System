from sqlalchemy.orm import Session
from . import models, schemas

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(name=customer.name, email=customer.email)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customers(db: Session):
    return db.query(models.Customer).all()

def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def update_customer(db: Session, customer_id: int, customer_update: schemas.CustomerCreate):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        db_customer.name = customer_update.name
        db_customer.email = customer_update.email
        db.commit()
        db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        db.delete(db_customer)
        db.commit()
        return True
    return False

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(name=product.name, price=product.price)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session):
    return db.query(models.Product).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def update_product(db: Session, product_id: int, updated_product: schemas.ProductCreate):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return None
    product.name = updated_product.name
    product.price = updated_product.price
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return False
    db.delete(product)
    db.commit()
    return True

def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(customer_id=order.customer_id)
    products = db.query(models.Product).filter(models.Product.id.in_(order.product_ids)).all()
    db_order.products = products
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session):
    return db.query(models.Order).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def update_order(db: Session, order_id: int, updated_order: schemas.OrderCreate):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        return None
    
    # Update the customer_id
    order.customer_id = updated_order.customer_id
    
    # Update the products association
    products = db.query(models.Product).filter(models.Product.id.in_(updated_order.product_ids)).all()
    order.products = products
    
    db.commit()
    db.refresh(order)
    return order

def delete_order(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        return False
    db.delete(order)
    db.commit()
    return True
