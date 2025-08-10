from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from fastapi import HTTPException

router = APIRouter(prefix="/customers", tags=["customers"])

@router.post("/", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(database.get_db)):
    return crud.create_customer(db, customer)

@router.get("/", response_model=list[schemas.Customer])
def read_customers(db: Session = Depends(database.get_db)):
    return crud.get_customers(db)

@router.get("/{customer_id}", response_model=schemas.Customer)
def read_customer(customer_id: int, db: Session = Depends(database.get_db)):
    customer = crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{customer_id}", response_model=schemas.Customer)
def update_customer_route(customer_id: int, customer: schemas.CustomerCreate, db: Session = Depends(database.get_db)):
    db_customer = crud.update_customer(db, customer_id, customer)
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.delete("/{customer_id}", response_model=schemas.Customer)
def delete_customer_route(customer_id: int, db: Session = Depends(database.get_db)):
    db_customer = crud.delete_customer(db, customer_id)
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer