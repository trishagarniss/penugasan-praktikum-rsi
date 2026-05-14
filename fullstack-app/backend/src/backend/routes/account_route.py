from fastapi import APIRouter, Depends
from sqlmodel import Session
from src.backend.database.connection import get_session
from src.backend.dto.account_dto import AccountCreate, AccountResponse
from src.backend.controllers import account_controller
from src.backend.dto.account_dto import LoginRequest

router = APIRouter(prefix="/accounts", tags=["Accounts"])

# 1. CREATE (POST)
@router.post("/", response_model=AccountResponse, status_code=201)
def create_account_route(account: AccountCreate, db: Session = Depends(get_session)):
    return account_controller.create_account_controller(account, db)

# 2. READ ALL (GET)
@router.get("/", response_model=list[AccountResponse]) 
def get_all_accounts_route(db: Session = Depends(get_session)):
    return account_controller.get_all_accounts_controller(db)

# 3. READ BY ID (GET)
@router.get("/{account_id}", response_model=AccountResponse)
def get_account_by_id_route(account_id: int, db: Session = Depends(get_session)):
    return account_controller.get_account_by_id_controller(account_id, db)

# 4. UPDATE (PUT)
@router.put("/{account_id}", response_model=AccountResponse)
def update_account_route(account_id: int, account: AccountCreate, db: Session = Depends(get_session)):
    return account_controller.update_account_controller(account_id, account, db)    

# 5. DELETE (DELETE)
@router.delete("/{account_id}")
def delete_account_route(account_id: int, db: Session = Depends(get_session)):
    return account_controller.delete_account_controller(account_id, db)

# 6. LOGIN (POST)
@router.post("/login")
def login_route(login_data: LoginRequest, db: Session = Depends(get_session)):
    return account_controller.login_controller(login_data, db)