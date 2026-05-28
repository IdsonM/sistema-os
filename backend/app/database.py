from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Caminho do banco SQLite (vai criar um arquivo os.db)
DATABASE_URL = "sqlite:///./os.db"

# engine = conexão com o banco
engine = create_engine(DATABASE_URL)

# Sessão do banco (usado para fazer operações)
SessionLocal = sessionmaker(bind=engine)

# Base para os models
Base = declarative_base()
