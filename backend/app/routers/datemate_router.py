from fastapi import APIRouter, HTTPException
import httpx

from app.models import CreateAgentRequest, CreateAgentResponse
from app.services.prompt_service import generate_datemate_prompt
from app.services.vapi_service import create_vapi_assistant
from app.config import settings, logger

router = APIRouter(
    prefix="/api",
    tags=["DateMate Agent Creation"],
)

@router.post("/create-agent", response_model=CreateAgentResponse, status_code=201)
async def create_datemate_agent_endpoint(payload: CreateAgentRequest):
    """
    Creates a new Vapi Assistant for DateMate based on the provided persona.
    """
    try:
        system_prompt = generate_datemate_prompt(
            name=payload.name,
            age=payload.age,
            personality=payload.personality,
            setting=payload.setting,
            difficulty=payload.difficulty,
            scenario_description=payload.scenario_description
        )
        logger.info(f"Generated prompt for {payload.name}: {system_prompt[:200]}...")

        first_message = f"Hi! I'm {payload.name}, nice to meet you!"

        assistant_data = await create_vapi_assistant(
            persona_name=payload.name,  # For Vapi assistant's display name (e.g., "DateMate Persona - Sofia")
            system_prompt=system_prompt,
            voice_provider=settings.DEFAULT_VOICE_PROVIDER, # Or parse from payload.voice_model if it includes provider
            voice_model_id=payload.voice_model, # Assuming this is just the ID
            first_message=first_message,
            difficulty=payload.difficulty,
            # ---- Parameters for metadata ----
            app_persona_name=payload.name,  # The actual character name for metadata
            age=payload.age,
            app_personality=payload.personality,
            app_setting=payload.setting
        )

        assistant_id = assistant_data.get("id")
        if not assistant_id:
            logger.error(f"Vapi assistant creation succeeded but no ID returned. Response: {assistant_data}")
            raise HTTPException(status_code=500, detail="Assistant created but ID missing in Vapi response.")

        logger.info(f"Successfully created Vapi assistant '{payload.name}'. Assistant ID: {assistant_id}")
        return CreateAgentResponse(
            assistant_id=assistant_id,
            name=payload.name,
            prompt_used=system_prompt
        )
    except ValueError as ve: # Catch configuration errors from vapi_service
        logger.error(f"Configuration error during agent creation: {ve}")
        raise HTTPException(status_code=500, detail=str(ve))
    except httpx.TimeoutException:
        logger.error("Timeout error when calling Vapi API to create assistant.")
        raise HTTPException(status_code=504, detail="Vapi API call timed out")
    except httpx.HTTPStatusError as e:
        error_detail = f"Vapi API Error creating assistant: {e.response.status_code} - {e.response.text}"
        logger.error(error_detail)
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)
    except Exception as e:
        logger.exception(f"An unexpected error occurred in /api/create-agent for {payload.name}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")