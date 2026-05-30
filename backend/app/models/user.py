from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    # 🔥 ligação com empresa
    empresa_id = Column(Integer, ForeignKey("empresas.id"))