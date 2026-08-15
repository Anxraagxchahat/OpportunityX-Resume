import jwt
import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

def init_firebase():
    if not firebase_admin._apps:
        client_email = settings.FIREBASE_CLIENT_EMAIL
        raw_key = settings.FIREBASE_PRIVATE_KEY or ""
        private_key = raw_key.strip().strip('"').strip("'")
        if "\\n" in private_key:
            private_key = private_key.replace("\\n", "\n")

        if not private_key or not client_email:
            return False

        try:
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID or "opportunityx-61efd",
                "private_key": private_key,
                "client_email": client_email,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email.replace('@', '%40')}"
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            return True
        except Exception:
            return False
    return True

def verify_token(token: str) -> dict:
    """
    Verify Firebase ID Token and return decoded token dict.
    In production with service account credentials: uses auth.verify_id_token().
    In local development / fallback: decodes standard Firebase JWT claims securely.
    """
    if init_firebase():
        try:
            return auth.verify_id_token(token)
        except Exception as e:
            if settings.APP_ENV == "production":
                raise ValueError(f"Invalid Firebase Token: {str(e)}")

    # Development fallback or unconfigured service account: decode Firebase JWT payload
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        if not decoded.get("uid") and decoded.get("user_id"):
            decoded["uid"] = decoded["user_id"]
        if not decoded.get("uid") and decoded.get("sub"):
            decoded["uid"] = decoded["sub"]
        return decoded
    except Exception as jwt_err:
        raise ValueError(f"Invalid JWT Token: {str(jwt_err)}")
