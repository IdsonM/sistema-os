from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    plano = Column(String)