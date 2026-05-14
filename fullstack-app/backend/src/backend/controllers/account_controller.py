from sqlmodel import Session
from src.backend.services import account_service
from src.backend.dto.account_dto import AccountCreate
from src.backend.dto.account_dto import LoginRequest

# 1. CREATE
def create_account_controller(account: AccountCreate, db: Session):
    return account_service.add_new_account(db, account)

# 2. READ ALL
def get_all_accounts_controller(db: Session):
    return account_service.get_all_accounts(db)     

# 3. READ BY ID
def get_account_by_id_controller(account_id: int, db: Session):
    return account_service.get_account(db, account_id)      

# 4. UPDATE
def update_account_controller(account_id: int, account: AccountCreate, db: Session):        
    return account_service.modify_account(db, account_id, account)

# 5. DELETE
def delete_account_controller(account_id: int, db: Session):
    return account_service.remove_account(db, account_id)

# 6. LOGIN
def login_controller(login_data: LoginRequest, db: Session):
    return account_service.login_user(db, login_data)    
