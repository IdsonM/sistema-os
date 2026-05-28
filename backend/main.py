from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import os_router
from app.routers import auth_router

# ✅ IMPORTANTE (BANCO)
from app.database import Base, engine
from app.models.os_model import OS

# ✅ CRIA AS TABELAS NO BANCO
Base.metadata.create_all(bind=engine)


app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROTAS
app.include_router(os_router.router)
app.include_router(auth_router.router)

# ✅ ROTA TESTE
@app.get("/")
def root():
    return {"message": "API rodando 🚀"}
