from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

import re

# Engine configuration with connection pooling for Supabase PostgreSQL
DATABASE_URL = settings.DATABASE_URL or "sqlite:///./opportunityx_dev.db"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Automatic conversion of direct Supabase 5432 URLs (IPv6-only) to IPv4 Pooler 6543 URLs for Render compatibility
direct_supabase_match = re.search(r"postgresql://([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co:5432/(.+)", DATABASE_URL)
if direct_supabase_match:
    user = direct_supabase_match.group(1)
    pwd = direct_supabase_match.group(2)
    project_ref = direct_supabase_match.group(3)
    db_name = direct_supabase_match.group(4)
    if "." not in user:
        user = f"{user}.{project_ref}"
    DATABASE_URL = f"postgresql://{user}:{pwd}@aws-0-ap-south-1.pooler.supabase.com:6543/{db_name}"

# Handle unencoded '@' inside password string if passed directly in DATABASE_URL
if DATABASE_URL.count("@") > 1 and "postgresql://" in DATABASE_URL:
    prefix, rest = DATABASE_URL.split("://", 1)
    last_at_idx = rest.rfind("@")
    user_pass = rest[:last_at_idx]
    host_db = rest[last_at_idx + 1:]
    if ":" in user_pass:
        user, password = user_pass.split(":", 1)
        password_encoded = password.replace("@", "%40")
        DATABASE_URL = f"{prefix}://{user}:{password_encoded}@{host_db}"

connect_args = {}
if DATABASE_URL.startswith("postgresql"):
    if "sslmode" not in DATABASE_URL.lower():
        connect_args["sslmode"] = "require"
elif DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_size=10 if not DATABASE_URL.startswith("sqlite") else 5,
    max_overflow=20 if not DATABASE_URL.startswith("sqlite") else 10,
    pool_recycle=300,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
