import httpx
import json
from typing import Dict, Any, Optional

from app.config import settings, logger
from app.models import CreateAgentRequest # For type hinting if needed

# Asynchronous HTTP client, initialized once and reused
# Consider managing the client lifecycle with FastAPI lifespan events for production
# For simplicity here, a global client is used.
# async_client = httpx.AsyncClient(timeout=20.0)

async def create_vapi_assistant(
    persona_name: str, # This will be used in Vapi's assistant name, e.g., "DateMate Scenario - Sofia"
    system_prompt: str,
    voice_provider: str,
    voice_model_id: str,
    # ---- New parameters for metadata ----
    app_persona_name: str, # The actual character name like "Sofia"
    age: int,
    app_personality: str,
    app_setting: str,
    # ---- End of new parameters ----
    first_message: Optional[str] = None,
    difficulty: Optional[str] = "unknown"
) -> Dict[str, Any]:
    """
    Calls the Vapi API to create a new assistant.
    """
    if not settings.VAPI_API_KEY:
        logger.error("VAPI_API_KEY not available for Vapi service.")
        raise ValueError("VAPI_API_KEY is not configured.")

    # Construct metadata for application-specific details
    assistant_metadata = {
        "app_persona_name": app_persona_name,
        "app_age": age,
        "app_personality": app_personality,
        "app_setting": app_setting,
        "app_difficulty": difficulty # Also store difficulty here for consistency
    }

    vapi_assistant_payload = {
        "name": f"DateMate Persona - {persona_name} ({difficulty})", # Vapi assistant name
        "model": {
            "provider": settings.DEFAULT_LLM_PROVIDER,
            "model": settings.DEFAULT_LLM_MODEL,
            "messages": [{"role": "system", "content": system_prompt}]
            # "tools": [] # Add tool definitions here if DateMate personas use them
        },
        "voice": {
            "provider": voice_provider,
            "voiceId": voice_model_id
        },
        "metadata": assistant_metadata # Include the metadata here
    }
    if first_message:
        vapi_assistant_payload["firstMessage"] = first_message
    
    # Remove serverUrl and serverUrlSecret if no tools are defined for these personas for now
    # A more robust check would be if vapi_assistant_payload["model"]["tools"] is empty
    vapi_assistant_payload.pop("serverUrl", None)
    vapi_assistant_payload.pop("serverUrlSecret", None)


    headers = {
        "Authorization": f"Bearer {settings.VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    api_endpoint = f"{settings.VAPI_API_URL}/assistant"

    async with httpx.AsyncClient(timeout=20.0) as client: # Client per request
        try:
            logger.info(f"Creating Vapi assistant for {persona_name} via Vapi API...")
            logger.debug(f"Vapi Assistant Creation Payload: {json.dumps(vapi_assistant_payload, indent=2)}")
            response = await client.post(api_endpoint, json=vapi_assistant_payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException as e:
            logger.error(f"Timeout error calling Vapi API to create assistant: {api_endpoint} - {e}")
            raise
        except httpx.HTTPStatusError as e:
            logger.error(f"Vapi API Error creating assistant: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in create_vapi_assistant for {persona_name}")
            raise

async def start_vapi_phone_call(
    phone_number_to_call: str,
    assistant_id: str,
    phone_number_id: str,
    variable_values: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Calls the Vapi API to start an outbound phone call.
    """
    if not settings.VAPI_API_KEY:
        logger.error("VAPI_API_KEY not available for Vapi service.")
        raise ValueError("VAPI_API_KEY is not configured.")
    if not phone_number_id:
        logger.error("VAPI_PHONE_NUMBER_ID not available for starting call.")
        raise ValueError("VAPI_PHONE_NUMBER_ID is not configured.")


    vapi_call_payload = {
        "phoneNumberId": phone_number_id,
        "assistantId": assistant_id,
        "customer": {"number": phone_number_to_call}
    }
    if variable_values:
        vapi_call_payload["assistantOverrides"] = {"variableValues": variable_values}

    headers = {
        "Authorization": f"Bearer {settings.VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    api_endpoint = f"{settings.VAPI_API_URL}/call/phone"

    async with httpx.AsyncClient(timeout=20.0) as client: # Client per request
        try:
            logger.info(f"Starting Vapi call to {phone_number_to_call} using Assistant {assistant_id}")
            logger.debug(f"Vapi Call Payload: {json.dumps(vapi_call_payload)}")
            response = await client.post(api_endpoint, json=vapi_call_payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException as e:
            logger.error(f"Timeout error calling Vapi API to start call: {api_endpoint} - {e}")
            raise
        except httpx.HTTPStatusError as e:
            logger.error(f"Vapi API Error starting call: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.exception("Unexpected error in start_vapi_phone_call")
            raise