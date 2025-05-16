import hmac
import hashlib
from typing import Optional
from fastapi import Request, HTTPException, Header

from app.config import settings, logger

async def verify_vapi_signature_dependency(
    request: Request,
    x_vapi_signature: Optional[str] = Header(None, alias="x-vapi-signature") # FastAPI handles case-insensitivity
):
    """
    FastAPI dependency to verify the signature of incoming webhooks from Vapi.
    """
    if not settings.VAPI_WEBHOOK_SECRET:
        logger.warning("VAPI_WEBHOOK_SECRET is not set. Skipping webhook signature verification (NOT RECOMMENDED for production).")
        return # Allow request if secret not set (for dev/testing or if webhook is public)

    if not x_vapi_signature:
        logger.error("Webhook verification failed: Missing 'x-vapi-signature' header.")
        raise HTTPException(status_code=403, detail="Missing x-vapi-signature header")

    request_body_bytes = await request.body()

    hasher = hmac.new(settings.VAPI_WEBHOOK_SECRET.encode('utf-8'), request_body_bytes, hashlib.sha256)
    expected_signature = hasher.hexdigest()

    if not hmac.compare_digest(expected_signature, x_vapi_signature):
        logger.error(f"Webhook signature mismatch. Expected: {expected_signature}, Got: {x_vapi_signature}")
        raise HTTPException(status_code=403, detail="Invalid signature")

    logger.info("Webhook signature verified successfully via dependency.")
    # If successful, the dependency allows the request to proceed to the route handler