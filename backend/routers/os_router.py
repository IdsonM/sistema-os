from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.auth_service import authenticate

router = APIRouter(prefix="/auth", tags=["Auth"])


# ================= LOGIN =================
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


# ================= RECUPERAR SENHA =================
class ForgotRequest(BaseModel):
    email: str


@router.post("/forgot")
def forgot(data: ForgotRequest):

    # 🔥 pega usuário (por enquanto só simulação)
    username = data.email

    # 🔥 gera token simples (MVP)
    token = "reset123"

    print(f"Recuperação solicitada para: {username}")
    print(f"Token gerado: {token}")

    return {
        "token": token
    }