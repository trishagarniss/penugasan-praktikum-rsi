from sqlmodel import Session, select
from datetime import datetime
from src.backend.database.schema.models import Account
from src.backend.dto.account_dto import AccountCreate,  AccountResponse

def create_account(db: Session, data):
    new_account = Account(
        user_id=data.user_id,   
        role_id=data.role_id,
        email=data.email,
        username=data.username,
        password=data.password
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

def get_accounts(db: Session):
    return db.exec(select(Account)).all()

def get_account_by_id(db: Session, account_id: int):
    return db.get(Account, account_id)

def update_account(db: Session, account_id: int, account_data: AccountCreate):
    db_account = db.get(Account, account_id)
    if db_account:
        db_account.email = account_data.email
        db_account.username =account_data.username
        db_account.password = account_data.password
        db_account.updated_at = datetime.now()
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return db_account
    return None

def get_account_by_username(db: Session, username: str):
    accounts = db.exec(select(Account)).all()
    return next((acc for acc in accounts if acc.username == username), None)

def delete_account(db: Session, account_id: int):
    db_account = db.get(Account, account_id)
    if db_account:
        db.delete(db_account)
        db.commit()
        return True
    return False