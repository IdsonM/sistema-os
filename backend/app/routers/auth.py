from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


# 🔌 conexão com banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= LOGIN =================
class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    # 🔎 busca usuário no banco
    user = db.query(User).filter(User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    if user.password != data.password:
        raise HTTPException(status_code=401, detail="Senha incorreta")

    return {
        "access_token": "token_fake",
        "empresa_id": user.empresa_id
    }


# ================= RECUPERAR SENHA =================
class ForgotRequest(BaseModel):
    email: str


@router.post("/forgot")
def forgot(data: ForgotRequest):

    print("🔥 FORGOT FOI CHAMADO")

    # ✅ versão simples (SEM banco para evitar erro 500)
    token = "reset123"

    print(f"Token gerado para {data.email}: {token}")

    return {
        "token": token
    }