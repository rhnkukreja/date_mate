from fastapi import APIRouter, HTTPException , Depends
from typing import Optional, Dict, Any
import httpx

from app.models import StartCallRequest, StartCallResponse
from app.services.vapi_service import start_vapi_phone_call
from app.services.vapi_client import VapiClient
from app.config import settings, logger

router = APIRouter(
    prefix="/api",
    tags=["Vapi Call Management"],
)

def get_vapi_client():
    """Dependency to get VapiClient instance"""
    return VapiClient()

@router.post("/start-call", response_model=StartCallResponse, status_code=201)
async def start_call_endpoint(payload: StartCallRequest):
    """
    Initiates an outbound Vapi phone call using a pre-existing assistant.
    """
    assistant_id_to_use = payload.assistant_id or settings.DEFAULT_VAPI_ASSISTANT_ID
    if not assistant_id_to_use:
        logger.error("Assistant ID is missing for /api/start-call (neither in payload nor default config).")
        raise HTTPException(status_code=400, detail="Missing Assistant ID")
    if not settings.VAPI_PHONE_NUMBER_ID:
        logger.error("VAPI_PHONE_NUMBER_ID is not configured for /api/start-call.")
        raise HTTPException(status_code=500, detail="Server configuration error: Vapi Phone Number ID missing")

    variable_values: Dict[str, Any] = {}
    if payload.customer_name:
        variable_values['customer_name'] = payload.customer_name
    if payload.task_info:
        variable_values['task_info'] = payload.task_info
    if payload.other_variables:
        variable_values.update(payload.other_variables)

    try:
        call_data = await start_vapi_phone_call(
            phone_number_to_call=payload.phone_number_to_call,
            assistant_id=assistant_id_to_use,
            phone_number_id=settings.VAPI_PHONE_NUMBER_ID,
            variable_values=variable_values if variable_values else None
        )
        logger.info(f"Successfully initiated Vapi call. Call ID: {call_data.get('id')}")
        return StartCallResponse(
            success=True, message="Vapi call initiated successfully.",
            call_id=call_data.get('id'), status=call_data.get('status')
        )
    except ValueError as ve: # Catch configuration errors from vapi_service
        logger.error(f"Configuration error during call initiation: {ve}")
        raise HTTPException(status_code=500, detail=str(ve))
    except httpx.TimeoutException:
        logger.error("Timeout error when calling Vapi API to start call.")
        raise HTTPException(status_code=504, detail="Vapi API call timed out")
    except httpx.HTTPStatusError as e:
        error_detail = f"Vapi API Error starting call: {e.response.status_code} - {e.response.text}"
        logger.error(error_detail)
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)
    except Exception as e:
        logger.exception("An unexpected error occurred in /api/start-call")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")
    


@router.delete("/{call_id}", status_code=200)
async def delete_call(
    call_id: str,
    vapi_client: VapiClient = Depends(get_vapi_client)
) -> Dict[str, Any]:
    """Delete a specific call record"""
    try:
        result = await vapi_client.delete_call(call_id)
        logger.info(f"Successfully deleted call {call_id}")
        return {
            "success": True,
            "message": f"Call {call_id} deleted successfully",
            "data": result
        }
    except httpx.HTTPStatusError as e:
        logger.error(f"Failed to delete call {call_id}: {e.response.text}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to delete call: {e.response.text}"
        )