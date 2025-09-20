from sqlalchemy.orm import Session
from typing import List, Optional
from models import Integration
from schemas import IntegrationCreate, IntegrationUpdate

def get_integrations(db: Session, skip: int = 0, limit: int = 100) -> List[Integration]:
    return db.query(Integration).offset(skip).limit(limit).all()

def get_integration(db: Session, integration_id: int) -> Optional[Integration]:
    return db.query(Integration).filter(Integration.id == integration_id).first()

def get_integration_by_name(db: Session, name: str) -> Optional[Integration]:
    return db.query(Integration).filter(Integration.name == name).first()

def create_integration(db: Session, integration: IntegrationCreate) -> Integration:
    db_integration = Integration(**integration.dict())
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration

def update_integration(db: Session, integration_id: int, integration_update: IntegrationUpdate) -> Optional[Integration]:
    db_integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if db_integration is None:
        return None
    
    update_data = integration_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_integration, field, value)
    
    db.commit()
    db.refresh(db_integration)
    return db_integration

def delete_integration(db: Session, integration_id: int) -> bool:
    db_integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if db_integration is None:
        return False
    
    db.delete(db_integration)
    db.commit()
    return True

def toggle_integration(db: Session, integration_id: int) -> Optional[Integration]:
    """Toggle the enabled status of an integration"""
    db_integration = db.query(Integration).filter(Integration.id == integration_id).first()
    if db_integration is None:
        return None
    
    db_integration.enabled = not db_integration.enabled
    db.commit()
    db.refresh(db_integration)
    return db_integration
