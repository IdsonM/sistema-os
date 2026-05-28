from sqlalchemy.orm import Session
from app.models.work_order import WorkOrder

def create_os(db: Session, os_data):
    db_os = WorkOrder(**os_data.dict())
    db.add(db_os)
    db.commit()
    db.refresh(db_os)
    return db_os

def get_all_os(db: Session):
    return db.query(WorkOrder).all()
def update_os(db: Session, os_id: int, os_data):
    os = db.query(WorkOrder).filter(WorkOrder.id == os_id).first()

    if not os:
        return None

    os.cliente = os_data.cliente
    os.descricao = os_data.descricao
    os.status = os_data.status

    db.commit()
    db.refresh(os)
    return os