from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.auth_service import authenticate

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    token = authenticate(data.username, data.password)

    if not token:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return {
        "access_token": token,
        "token_type": "bearer"
    }
