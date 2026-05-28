from pydantic import BaseModel

class WorkOrderBase(BaseModel):
    cliente: str
    descricao: str
    status: str

class WorkOrderCreate(WorkOrderBase):
    pass

class WorkOrderResponse(WorkOrderBase):
    id: int

    class Config:
        orm_mode = True