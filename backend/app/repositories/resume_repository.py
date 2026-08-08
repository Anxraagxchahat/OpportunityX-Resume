from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models.models import Resume, ResumeVersion, PublicResumeLink
from app.repositories.base_repository import BaseRepository

class ResumeRepository(BaseRepository[Resume]):
    def __init__(self, db: Session):
        super().__init__(Resume, db)

    def get_user_resumes(self, user_id: str) -> List[Resume]:
        return (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id, Resume.is_archived == False)
            .order_by(Resume.updated_at.desc())
            .all()
        )

    def get_by_user_and_id(self, user_id: str, resume_id: str) -> Optional[Resume]:
        return (
            self.db.query(Resume)
            .filter(Resume.id == resume_id, Resume.user_id == user_id)
            .first()
        )

    def create_version(self, resume_id: str, title: str, content: Dict[str, Any]) -> ResumeVersion:
        version_count = (
            self.db.query(ResumeVersion)
            .filter(ResumeVersion.resume_id == resume_id)
            .count()
        )
        version = ResumeVersion(
            resume_id=resume_id,
            version_number=version_count + 1,
            title=title,
            content=content
        )
        self.db.add(version)
        self.db.commit()
        self.db.refresh(version)
        return version

    def get_or_create_public_link(self, resume_id: str, slug: str) -> PublicResumeLink:
        existing = (
            self.db.query(PublicResumeLink)
            .filter(PublicResumeLink.resume_id == resume_id)
            .first()
        )
        if existing:
            return existing
        link = PublicResumeLink(
            resume_id=resume_id,
            slug=slug,
            is_active=True
        )
        self.db.add(link)
        self.db.commit()
        self.db.refresh(link)
        return link

    def get_by_public_slug(self, slug: str) -> Optional[tuple[Resume, PublicResumeLink]]:
        link = (
            self.db.query(PublicResumeLink)
            .filter(PublicResumeLink.slug == slug, PublicResumeLink.is_active == True)
            .first()
        )
        if not link:
            return None
        resume = self.get_by_id(link.resume_id)
        if resume:
            link.view_count += 1
            self.db.commit()
        return resume, link
