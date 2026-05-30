from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

# ✅ IMPORT ROTAS (CORRIGIDO)
from app.routers import os_router
from app.routers import auth   # ✅ aqui corrigimos

# ✅ BANCO
from app.database import Base, engine

# ✅ IMPORT MODELS (importante para criar tabelas)
from app.models.os_model import OS
from app.models.user import User
from app.models.empresa import Empresa

# ✅ CRIA AS TABELAS NO BANCO
Base.metadata.create_all(bind=engine)

# ✅ APP
app = FastAPI()

# ✅ CORS (CORRIGIDO)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permite Netlify acessar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROTAS
app.include_router(os_router.router)
app.include_router(auth.router)   # ✅ aqui corrigimos

# ✅ TESTE
@app.get("/")
def root():
    return {"message": "API rodando 🚀"}
