from fastapi import APIRouter
from app.database import SessionLocal
from app.models.os_model import OS

router = APIRouter(prefix="/os", tags=["OS"])


# ================= LISTAR =================
@router.get("/")
def listar():
    db = SessionLocal()
    dados = db.query(OS).all()
    db.close()
    return dados


# ================= CRIAR =================
@router.post("/")
def criar(os: dict):
    db = SessionLocal()

    nova_os = OS(
        cliente=os["cliente"],
        descricao=os["descricao"],
        status=os["status"]
    )

    db.add(nova_os)
    db.commit()
    db.refresh(nova_os)
    db.close()

    return nova_os


# ================= EDITAR =================
@router.put("/{id}")
def atualizar(id: int, nova_os: dict):
    db = SessionLocal()

    os_db = db.query(OS).filter(OS.id == id).first()

    if os_db:
        os_db.cliente = nova_os["cliente"]
        os_db.descricao = nova_os["descricao"]
        os_db.status = nova_os["status"]

        db.commit()

    db.close()
    return os_db


# ================= EXCLUIR =================
@router.delete("/{id}")
def deletar(id: int):
    db = SessionLocal()

    os_db = db.query(OS).filter(OS.id == id).first()

    if os_db:
        db.delete(os_db)
        db.commit()

    db.close()
    return {"msg": "deletado"}
