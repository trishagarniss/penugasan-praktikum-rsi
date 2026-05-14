import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')

    salt = bcrypt.gensalt()
    
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_byte_enc = plain_password.encode('utf-8')
    hashed_password_byte_enc = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(password_byte_enc, hashed_password_byte_enc)

SECRET_KEY = "kunci_rahasia_kelompok_dua_rsi_b" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # Token akan hangus dalam 60 menit

def create_access_token(data: dict):
    """Fungsi untuk membuat token JWT setelah login berhasil"""
    to_encode = data.copy()
    
    # Atur waktu kedaluwarsa token
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Generate token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Inisialisasi skema Bearer Token untuk Swagger UI
token_auth_scheme = HTTPBearer()

def get_current_user_payload(credentials: HTTPAuthorizationCredentials = Depends(token_auth_scheme)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token sudah kedaluwarsa, silakan login ulang")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token tidak valid")

def require_admin(payload: dict = Depends(get_current_user_payload)):
    if payload.get("role_id") != 1:
        raise HTTPException(status_code=403, detail="Akses ditolak! Hanya Admin yang boleh melakukan aksi ini.")
    return payload

def require_user(payload: dict = Depends(get_current_user_payload)):
    return payload