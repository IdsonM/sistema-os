from sqlalchemy import Column, Integer, String
from app.database import Base

class OS(Base):
    __tablename__ = "os"

    id = Column(Integer, primary_key=True, index=True)
    cliente = Column(String)
    descricao = Column(String)
    status = Column(String)

    equipamento = Column(String)
    orcamento = Column(String)
    data = Column(String)
