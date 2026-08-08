import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

def init_firebase():
    if not firebase_admin._apps:
        client_email = settings.FIREBASE_CLIENT_EMAIL or "firebase-adminsdk-fbsvc@opportunityx-61efd.iam.gserviceaccount.com"
        raw_key = settings.FIREBASE_PRIVATE_KEY or ""
        private_key = raw_key.strip().strip('"').strip("'").replace('\\n', '\n')
        
        if "-----BEGIN PRIVATE KEY-----" not in private_key:
            # Fallback to central OpportunityX private key string
            from app.core.config import Settings
            private_key = Settings().FIREBASE_PRIVATE_KEY.replace('\\n', '\n')

        cred_dict = {
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID or "opportunityx-61efd",
            "private_key_id": "651778ae11b6a510828f5cc73f685ae8f49969fb",
            "private_key": private_key,
            "client_email": client_email,
            "client_id": "108149193597757443948",
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
