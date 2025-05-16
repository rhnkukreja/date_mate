# app/routers/analytics_router.py

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from datetime import datetime
from app.models import CallAnalytics, CallsList
from app.config import logger
from app.services.vapi_client import VapiClient
import httpx

router = APIRouter(
    prefix="/api/calls",
    tags=["Call Analytics"]
)

def get_vapi_client():
    return VapiClient()

@router.get("/", response_model=CallsList)
async def list_calls(
    assistant_id: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    page: Optional[str] = None,
    vapi_client: VapiClient = Depends(get_vapi_client)
):
    """
    List all calls with pagination support.
    Optionally filter by assistant_id.
    """
    try:
        calls_data = await vapi_client.list_calls(assistant_id, limit, page)
        
        # Handle both list and dictionary responses
        calls_list = calls_data
        next_page = None
        total = len(calls_list) if isinstance(calls_list, list) else 0
        
        if isinstance(calls_data, dict):
            calls_list = calls_data.get("data", [])
            next_page = calls_data.get("next_page")
            total = calls_data.get("total", len(calls_list))
        
        calls = []
        for call in calls_list:
            try:
                start_time = datetime.fromisoformat(call["startTime"].replace("Z", "+00:00")) if call.get("startTime") else datetime.utcnow()
                end_time = datetime.fromisoformat(call["endTime"].replace("Z", "+00:00")) if call.get("endTime") else None
                
                calls.append(CallAnalytics(
                    call_id=call["id"],
                    assistant_id=call["assistantId"],
                    start_time=start_time,
                    end_time=end_time,
                    duration=call.get("duration"),
                    transcript=call.get("transcript"),
                    summary=call.get("analysis", {}).get("summary"),
                    success_metrics=call.get("analysis", {}).get("success"),
                    structured_data=call.get("analysis", {}).get("structuredData")
                ))
            except Exception as e:
                logger.error(f"Error parsing call data: {e}")
        
        return CallsList(
            data=calls,
            next_page=next_page,
            total=total
        )
    except httpx.HTTPStatusError as e:
        logger.error(f"Vapi API error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.exception("Failed to list calls")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{call_id}", response_model=CallAnalytics)
async def get_call_details(call_id: str, vapi_client: VapiClient = Depends(get_vapi_client)):
    """
    Get detailed analytics for a specific call
    """
    try:
        call = await vapi_client.get_call(call_id)
        if not call or "id" not in call:
            raise HTTPException(status_code=404, detail="Call not found")
        
        # Defensive parsing
        start_time = None
        end_time = None
        try:
            start_time = datetime.fromisoformat(call.get("startTime", "").replace("Z", "+00:00"))
        except Exception:
            pass
        try:
            end_time = datetime.fromisoformat(call.get("endTime", "").replace("Z", "+00:00"))
        except Exception:
            pass

        return CallAnalytics(
            call_id=call.get("id", ""),
            assistant_id=call.get("assistantId", ""),
            start_time=start_time,
            end_time=end_time,
            duration=call.get("duration"),
            transcript=call.get("transcript"),
            summary=call.get("analysis", {}).get("summary"),
            success_metrics=call.get("analysis", {}).get("success"),
            structured_data=call.get("analysis", {}).get("structuredData"),
        )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Call not found")
        logger.error(f"Vapi API error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.exception(f"Failed to get call details for {call_id}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/assistant/{assistant_id}/metrics", response_model=dict)
async def get_assistant_metrics(assistant_id: str, vapi_client: VapiClient = Depends(get_vapi_client)):
    """
    Get aggregated metrics for a specific assistant
    """
    try:
        metrics = await vapi_client.get_analytics(assistant_id)
        if not metrics or "assistantId" not in metrics:
            raise HTTPException(status_code=404, detail="No metrics found for this assistant")
        # Optionally, transform or validate the response here
        return {
            "assistant_id": metrics.get("assistantId"),
            "total_calls": metrics.get("totalCalls"),
            "total_minutes": metrics.get("totalMinutes"),
            "average_duration": metrics.get("averageDuration"),
            "success_rate": metrics.get("successRate"),
            "calls": metrics.get("calls", [])
        }
    except httpx.HTTPStatusError as e:
        logger.error(f"Vapi API error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.exception(f"Failed to get metrics for assistant {assistant_id}")
        raise HTTPException(status_code=500, detail=str(e))