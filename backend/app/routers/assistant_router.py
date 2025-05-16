# app/routers/assistant_router.py

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Dict, Any
from app.models import AssistantSummary, AssistantDetail, UpdateAssistantRequest, AssistantList, AssistantMetadata
from app.config import logger
from app.services.vapi_client import VapiClient
import re
import os
from datetime import datetime

router = APIRouter(
    prefix="/api/assistants",
    tags=["assistants"],
)

async def get_vapi_client() -> VapiClient:
    VAPI_API_KEY = os.getenv("VAPI_API_KEY") # Good to check if the env var is set
    if not VAPI_API_KEY:
        # This check is important. If the key isn't in the environment,
        # settings.VAPI_API_KEY might also be None or raise an error depending on Pydantic settings.
        raise HTTPException(status_code=500, detail="VAPI_API_KEY is not configured in the environment.")
    
    # Your custom app.services.vapi_client.VapiClient handles the API key 
    # from app.config.settings within its __init__ method.
    # No need to pass api_key or call with_api_key().
    return VapiClient()

def get_assistant_details_from_vapi_object(vapi_assistant_obj: Dict[str, Any]) -> Dict[str, Any]:
    metadata_dict: Dict[str, Any] = {}
    model_settings = vapi_assistant_obj.get("model", {})

    vapi_name = vapi_assistant_obj.get("name", "Unknown Persona")
    parsed_name = vapi_name
    parsed_difficulty_from_name = "medium"

    name_parts = vapi_name.split(" - ")
    if len(name_parts) > 1:
        potential_name_with_difficulty = name_parts[-1]
        match = re.match(r"(.+?)\s*\((easy|medium|hard)\)", potential_name_with_difficulty, re.IGNORECASE)
        if match:
            parsed_name = match.group(1).strip()
            parsed_difficulty_from_name = match.group(2).lower()
        else:
            parsed_name = potential_name_with_difficulty.strip()
    elif "(" in vapi_name and ")" in vapi_name:
        match = re.match(r"(.+?)\s*\((easy|medium|hard)\)", vapi_name, re.IGNORECASE)
        if match:
            parsed_name = match.group(1).strip()
            parsed_difficulty_from_name = match.group(2).lower()
    
    metadata_dict["app_persona_name"] = parsed_name

    system_prompt = ""
    if isinstance(model_settings, dict) and "messages" in model_settings:
        for message in model_settings.get("messages", []):
            if message.get("role") == "system":
                system_prompt = message.get("content", "")
                break
    
    metadata_dict["app_age"] = 28
    metadata_dict["app_personality"] = "friendly"
    metadata_dict["app_setting"] = "a casual place"
    metadata_dict["app_difficulty"] = parsed_difficulty_from_name
    metadata_dict["app_short_description"] = f"Chat with {parsed_name}."

    if system_prompt:
        age_match = re.search(r"(\d+)\s*year-old", system_prompt, re.IGNORECASE)
        if age_match:
            metadata_dict["app_age"] = int(age_match.group(1))

        personality_match = re.search(r"identifies as (\w+)|personality is (\w+)|is (\w+) and", system_prompt, re.IGNORECASE)
        if personality_match:
            metadata_dict["app_personality"] = next(filter(None, personality_match.groups()), "friendly").lower()

        setting_match = re.search(r"at a (\w+\s*\w*)|in a (\w+\s*\w*)|setting is a (\w+\s*\w*)", system_prompt, re.IGNORECASE)
        if setting_match:
            metadata_dict["app_setting"] = next(filter(None, setting_match.groups()), "a casual place").strip()
        
        difficulty_match = re.search(r"difficulty is (easy|medium|hard)", system_prompt, re.IGNORECASE)
        if difficulty_match:
            metadata_dict["app_difficulty"] = difficulty_match.group(1).lower()

        first_sentence_match = re.match(r"([^\.\!\?]+[\.\!\?])", system_prompt)
        if first_sentence_match:
            metadata_dict["app_short_description"] = first_sentence_match.group(1).strip()
        elif len(system_prompt) > 0:
            description_candidate = system_prompt.strip()
            metadata_dict["app_short_description"] = description_candidate[:100] + ("..." if len(description_candidate) > 100 else "")
    
    return metadata_dict

def process_assistant_item(item: Dict[str, Any]) -> AssistantSummary:
    app_metadata_dict = get_assistant_details_from_vapi_object(item)
    app_metadata_obj = AssistantMetadata(**app_metadata_dict)

    created_at_str = item.get("createdAt")
    creation_date_obj = datetime.utcnow()
    if created_at_str:
        try:
            creation_date_obj = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
        except ValueError:
            logger.warning(f"Could not parse createdAt '{created_at_str}' for assistant {item.get('id')}. Using current UTC time.")
    
    updated_at_str = item.get("updatedAt")
    last_used_obj = None
    if updated_at_str:
        try:
            last_used_obj = datetime.fromisoformat(updated_at_str.replace("Z", "+00:00"))
        except ValueError:
            logger.warning(f"Could not parse updatedAt '{updated_at_str}' for assistant {item.get('id')}. Setting last_used to None.")

    return AssistantSummary(
        id=item.get("id"),
        name=item.get("name", "Unnamed Assistant"), # Vapi's name
        personality=app_metadata_obj.app_personality, # From app metadata
        creation_date=creation_date_obj,
        voice_model=str(item.get("voice", {}).get("voiceId", "")), # Simplified, adjust as needed
        difficulty=app_metadata_obj.app_difficulty, # From app metadata
        last_used=last_used_obj,
        metadata=app_metadata_obj
    )

@router.get("/", response_model=AssistantList)
async def list_assistants(
    limit: int = Query(100, ge=1, le=100),
    vapi_client: VapiClient = Depends(get_vapi_client)
):
    try:
        raw_response = await vapi_client.list_assistants(limit=limit)
        
        # Handle different response formats
        if isinstance(raw_response, list):
            assistants_data = raw_response
            next_page_token = None
        else:  # Assume paginated dict response
            assistants_data = raw_response.get("data", [])
            next_page_token = raw_response.get("nextPageToken")

        processed = []
        for item in assistants_data:
            try:
                processed.append(process_assistant_item(item))
            except Exception as e:
                logger.error(f"Skipping invalid item: {str(e)}")
        
        return AssistantList(data=processed, next_page_token=next_page_token)
    
    except Exception as e:
        logger.error(f"API Error: {str(e)}")
        raise HTTPException(500, "Failed to load assistants")

@router.get("/{assistant_id}", response_model=AssistantDetail) 
async def get_assistant(assistant_id: str, vapi_client: VapiClient = Depends(get_vapi_client)):
    """Get details of a specific assistant"""
    try:
        asst = await vapi_client.get_assistant(assistant_id)
        
        # Retrieve application-specific data from metadata
        metadata = asst.get("metadata", {})
        app_persona_name = metadata.get("app_persona_name", asst.get("name", "Unknown")) # Fallback to Vapi name
        age = metadata.get("app_age", 25) # Default if not in metadata
        app_personality = metadata.get("app_personality", "") # Default if not in metadata
        app_setting = metadata.get("app_setting", "Unknown setting")
        app_difficulty = metadata.get("app_difficulty", "easy")

        return AssistantDetail(
            id=asst["id"],
            name=app_persona_name,             # Use the name from metadata
            personality=app_personality,       # Use personality from metadata
            creation_date=datetime.fromisoformat(asst["createdAt"].replace("Z", "+00:00")),
            voice_model=asst.get("voice", {}).get("voiceId", ""),
            difficulty=app_difficulty,         # Use difficulty from metadata
            last_used=datetime.fromisoformat(asst["lastUsed"].replace("Z", "+00:00")) if asst.get("lastUsed") else None,
            age=age,                           # Use age from metadata
            setting=app_setting,               # Use setting from metadata
            system_prompt=asst.get("model", {}).get("messages", [{}])[0].get("content", ""), 
            total_calls=metadata.get("total_calls", 0), 
            average_call_duration=metadata.get("average_call_duration", None) 
        )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Assistant not found")
        logger.error(f"Vapi API error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.exception(f"Failed to get assistant {assistant_id}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{assistant_id}", response_model=AssistantDetail)
async def update_assistant(
    assistant_id: str, 
    update_data: UpdateAssistantRequest,
    vapi_client: VapiClient = Depends(get_vapi_client)
):
    """Update an existing assistant"""
    try:
        # First get the existing assistant
        existing = await vapi_client.get_assistant(assistant_id)
        
        # Prepare update payload
        update_payload = {
            "name": update_data.name if update_data.name else existing["name"],
            "description": update_data.personality if update_data.personality else existing.get("description", ""),
            "voice": {
                "provider": "11labs",
                "voiceId": update_data.voice_model if update_data.voice_model else existing.get("voice", {}).get("voiceId", "")
            }
        }
        
        # Update the assistant
        updated = await vapi_client.update_assistant(assistant_id, update_payload)
        
        return AssistantDetail(
            id=updated["id"],
            name=updated.get("name", "Unknown"),
            personality=updated.get("description", ""),
            creation_date=datetime.fromisoformat(updated["createdAt"].replace("Z", "+00:00")),
            voice_model=updated.get("voice", {}).get("voiceId", ""),
            difficulty=update_data.difficulty or "easy",
            last_used=datetime.fromisoformat(updated["lastUsed"].replace("Z", "+00:00")) if updated.get("lastUsed") else None,
            age=25,  # Default value
            setting=updated.get("description", ""),
            system_prompt=updated.get("model", {}).get("messages", [{}])[0].get("content", ""),
            total_calls=0,
            average_call_duration=None
        )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Assistant not found")
        logger.error(f"Vapi API error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.exception(f"Failed to update assistant {assistant_id}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{assistant_id}", status_code=200)
async def delete_assistant(
    assistant_id: str,
    vapi_client: VapiClient = Depends(get_vapi_client)
) -> Dict[str, Any]:
    """Delete a specific Vapi assistant"""
    try:
        result = await vapi_client.delete_assistant(assistant_id)
        logger.info(f"Successfully deleted assistant {assistant_id}")
        return {
            "success": True,
            "message": f"Assistant {assistant_id} deleted successfully",
            "data": result
        }
    except httpx.HTTPStatusError as e:
        logger.error(f"Failed to delete assistant {assistant_id}: {e.response.text}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to delete assistant: {e.response.text}"
        )
