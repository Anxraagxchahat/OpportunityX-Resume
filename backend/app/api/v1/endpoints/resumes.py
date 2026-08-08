import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.resume_repository import ResumeRepository
from app.repositories.activity_repository import ActivityRepository
from app.db.schemas.schemas import ResumeCreateRequest, ResumeUpdateRequest, ResumeResponse
from app.db.models.models import Resume

router = APIRouter(prefix="/resumes", tags=["Resumes Management"])

@router.get("", response_model=List[ResumeResponse])
async def list_resumes(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = ResumeRepository(db)
    return repo.get_user_resumes(user.uid)

@router.post("", response_model=ResumeResponse)
async def create_resume(
    req: ResumeCreateRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = ResumeRepository(db)
    resume = Resume(
        user_id=user.uid,
        title=req.title,
        content=req.content,
        template_id=req.template_id or "modern",
        font_family=req.font_family or "Inter",
        accent_color=req.accent_color or "#F97316"
    )
    created = repo.create(resume)
    ActivityRepository(db).log_activity(
        user_id=user.uid,
        event_type="RESUME_CREATED",
        details={"resume_id": created.id, "title": created.title}
    )
    return created

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = ResumeRepository(db)
    resume = repo.get_by_user_and_id(user.uid, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return resume

@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    req: ResumeUpdateRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = ResumeRepository(db)
    resume = repo.get_by_user_and_id(user.uid, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    updated_data = req.model_dump(exclude_unset=True)
    if "content" in updated_data and updated_data["content"]:
        # Save snapshot version before updating
        repo.create_version(resume_id=resume.id, title=f"AutoSave snapshot", content=resume.content)

    updated = repo.update(resume, updated_data)
    ActivityRepository(db).log_activity(
        user_id=user.uid,
        event_type="RESUME_UPDATED",
        details={"resume_id": resume_id}
    )
    return updated

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = ResumeRepository(db)
    resume = repo.get_by_user_and_id(user.uid, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    repo.delete(resume_id)
    ActivityRepository(db).log_activity(
        user_id=user.uid,
        event_type="RESUME_DELETED",
        details={"resume_id": resume_id}
    )
    return {"ok": True, "message": "Resume deleted."}

@router.post("/{resume_id}/share")
async def create_public_share_link(
    resume_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = ResumeRepository(db)
    resume = repo.get_by_user_and_id(user.uid, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    slug = f"r-{str(uuid.uuid4())[:8]}"
    link = repo.get_or_create_public_link(resume_id=resume_id, slug=slug)
    ActivityRepository(db).log_activity(
        user_id=user.uid,
        event_type="PUBLIC_RESUME_CREATED",
        details={"resume_id": resume_id, "slug": link.slug}
    )
    return {
        "share_url": f"https://resume.opportunityx.co.in/p/{link.slug}",
        "slug": link.slug,
        "view_count": link.view_count
    }

@router.get("/public/{slug}")
async def get_public_resume(slug: str, db: Session = Depends(get_db)):
    repo = ResumeRepository(db)
    res = repo.get_by_public_slug(slug)
    if not res:
        raise HTTPException(status_code=404, detail="Shared resume not found or link deactivated.")
    resume, link = res
    return {
        "title": resume.title,
        "content": resume.content,
        "template_id": resume.template_id,
        "font_family": resume.font_family,
        "accent_color": resume.accent_color,
        "view_count": link.view_count
    }
