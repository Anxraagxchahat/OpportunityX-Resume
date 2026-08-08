import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

def init_firebase():
    if not firebase_admin._apps:
        if settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
            private_key = settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n')
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": private_key,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
            })
            firebase_admin.initialize_app(cred)
        else:
            # Fallback initialization using project ID for token verification
            cred = credentials.ApplicationDefault()
            try:
                firebase_admin.initialize_app(cred, {
                    'projectId': settings.FIREBASE_PROJECT_ID,
                })
            except Exception:
                # If ADC is not available, initialize default app
                firebase_admin.initialize_app()

def verify_token(token: str):
    """
    Verify Firebase ID Token and return decoded token dict.
    Returns decoded token dictionary containing 'uid', 'email', etc.
    """
    try:
        init_firebase()
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise ValueError(f"Invalid Firebase Token: {str(e)}")
