import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from a .env file at the project root
# Assuming .env is in the same directory as the main execution script or project root
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env') # Adjust if .env is elsewhere
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    # Fallback if .env is in the same directory as config.py (less common for app structure)
    load_dotenv()


class Settings:
    PROJECT_NAME: str = "DateMate Vapi Backend"
    VERSION: str = "0.3.0" # Updated version for modular structure

    # Vapi API Configuration
    VAPI_API_KEY: str = os.getenv("VAPI_API_KEY", "")
    DEFAULT_VAPI_ASSISTANT_ID: Optional[str] = os.getenv("DEFAULT_VAPI_ASSISTANT_ID")
    VAPI_PHONE_NUMBER_ID: Optional[str] = os.getenv("VAPI_PHONE_NUMBER_ID")
    VAPI_API_URL: str = "https://api.vapi.ai"

    # DateMate Agent Defaults
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "openai")
    DEFAULT_LLM_MODEL: str = os.getenv("DEFAULT_LLM_MODEL", "gpt-3.5-turbo")
    DEFAULT_VOICE_PROVIDER: str = os.getenv("DEFAULT_VOICE_PROVIDER", "elevenlabs")

    # Webhook Security
    VAPI_WEBHOOK_SECRET: Optional[str] = os.getenv("VAPI_WEBHOOK_SECRET")
    YOUR_BACKEND_BASE_URL: str = os.getenv("YOUR_BACKEND_BASE_URL", "http://localhost:8000")


settings = Settings()

# Basic Logging Configuration (can be expanded)
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

if not settings.VAPI_API_KEY:
    logger.error("CRITICAL: VAPI_API_KEY is not set in environment variables.")
