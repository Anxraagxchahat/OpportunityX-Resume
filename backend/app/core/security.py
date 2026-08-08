from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.firebase import verify_token
from typing import Optional

security = HTTPBearer(auto_error=False)

class AuthenticatedUser:
    def __init__(self, uid: str, email: str = "", name: str = "", photo_url: str = ""):
        self.uid = uid
        self.email = email
        self.name = name
        self.photo_url = photo_url

async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    authorization: Optional[str] = Header(None)
) -> AuthenticatedUser:
    token = None
    if auth and auth.credentials:
        token = auth.credentials
    elif authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        decoded = verify_token(token)
        uid = decoded.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing UID."
            )
        return AuthenticatedUser(
            uid=uid,
            email=decoded.get("email", ""),
            name=decoded.get("name") or decoded.get("email", "").split("@")[0] or "User",
            photo_url=decoded.get("picture", "")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_optional_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[AuthenticatedUser]:
    if not auth or not auth.credentials:
        return None
    try:
        return await get_current_user(auth=auth)
    except HTTPException:
        return None
