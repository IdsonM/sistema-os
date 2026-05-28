from sqlalchemy import Column, Integer, String
from app.db.session import Base

class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, index=True)
    cliente = Column(String, index=True)
    descricao = Column(String)
    status = Column(String)
