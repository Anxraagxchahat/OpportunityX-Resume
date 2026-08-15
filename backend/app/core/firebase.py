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
            raise ValueError("Firebase Admin credentials not configured. FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables are required.")

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
