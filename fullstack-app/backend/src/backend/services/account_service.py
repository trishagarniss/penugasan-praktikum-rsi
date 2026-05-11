from sqlmodel import Session
from src.backend.repositories import account_repo, role_repo, user_repo
from src.backend.dto.account_dto import AccountCreate, AccountResponse
from fastapi import HTTPException
from src.backend.utils.security import get_password_hash

# Buat Akun Baru
def add_new_account(db: Session, account_create: AccountCreate):
    user = user_repo.get_user_by_id(db, account_create.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    role = role_repo.get_role_by_id(db, account_create.role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role tidak ditemukan")

    if not account_create.email or not account_create.username or not account_create.password:
        raise HTTPException(status_code=400, detail="Email, username, dan password harus diisi")
    
    # Cek apakah email sudah digunakan
    existing_accounts = account_repo.get_accounts(db)
    for account in existing_accounts:
        if account.email == account_create.email:
            raise HTTPException(status_code=400, detail="Email sudah digunakan")
    
    account_create.password = get_password_hash(account_create.password)
    
    # Buat akun baru
    new_account = account_repo.create_account(db, account_create)
    return new_account

# Menunjukkan semua akun
def get_all_accounts(db: Session):
    return account_repo.get_accounts(db)

# menunjukkan akun berdasarkan ID
def get_account(db: Session, account_id: int):
    account = account_repo.get_account_by_id(db, account_id)
    if not account:
        raise HTTPException(status_code=404, detail=f"Akun dengan ID {account_id} tidak ditemukan")
    return account

# Mengubah data akun (Update Akun)
def modify_account(db: Session, account_id: int, account_data: AccountCreate):
    if not account_data.email or not account_data.username or not account_data.password:
        raise HTTPException(status_code=400, detail="Email, username, dan password harus diisi")
    
    existing_account = account_repo.get_account_by_id(db, account_id)
    if not existing_account:
        raise HTTPException(status_code=404, detail=f"Akun dengan ID {account_id} tidak ditemukan")
    
    existing_accounts = account_repo.get_accounts(db)
    for account in existing_accounts:
        if account.email == account_data.email and account.id != account_id:
            raise HTTPException(status_code=400, detail="Email sudah digunakan oleh akun lain")
    
    account_data.password = get_password_hash(account_data.password)

    # Update akun
    updated_account = account_repo.update_account(db, account_id, account_data)
    return updated_account

# Menghapus akun
def remove_account(db: Session, account_id: int):
    existing_account = account_repo.get_account_by_id(db, account_id)
    if not existing_account:
        raise HTTPException(status_code=404, detail=f"Akun dengan ID {account_id} tidak ditemukan")
    
    success = account_repo.delete_account(db, account_id)
    if not success:
        raise HTTPException(status_code=500, detail="Gagal menghapus akun")
    
    return {"message": f"Akun dengan ID {account_id} berhasil dihapus"}

    existing_account = account_repo.get_account_by_id(db, account_id)
    if not existing_account:
        raise HTTPException(status_code=404, detail=f"Akun dengan ID {account_id} tidak ditemukan")
    
    # Hapus akun
    success = account_repo.delete_account(db, account_id)
    if not success:
        raise HTTPException(status_code=500, detail="Gagal menghapus akun")
    
    return {"message": f"Akun dengan ID {account_id} berhasil dihapus"}