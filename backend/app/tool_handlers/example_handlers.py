import asyncio
import hashlib
from typing import Dict
from app.models import ToolResultOutput # Use the renamed model
from app.config import logger # Use the configured logger

async def handle_check_availability(parameters: dict, tool_call_id: str) -> ToolResultOutput:
    logger.info(f"Executing tool 'check_availability' (ID: {tool_call_id}) with parameters: {parameters}")
    item_id = parameters.get('itemId')
    requested_date = parameters.get('date')

    if not item_id:
        return ToolResultOutput(tool_call_id=tool_call_id, result={"success": False, "error": "Missing itemId parameter."})

    await asyncio.sleep(0.1) # Simulate async I/O
    is_available = True
    available_count = 10
    estimated_delivery_days = 2

    return ToolResultOutput(
        tool_call_id=tool_call_id,
        result={
            "success": True, "itemId": item_id, "is_available": is_available,
            "available_count": available_count, "estimated_delivery_days": estimated_delivery_days,
            "requested_date": requested_date
        }
    )

async def handle_book_appointment(parameters: dict, tool_call_id: str) -> ToolResultOutput:
    logger.info(f"Executing tool 'book_appointment' (ID: {tool_call_id}) with parameters: {parameters}")
    name = parameters.get('name')
    phone = parameters.get('phone')
    slot_datetime_iso = parameters.get('slot_datetime_iso')

    if not all([name, phone, slot_datetime_iso]):
        return ToolResultOutput(tool_call_id=tool_call_id, result={"success": False, "error": "Missing required parameters for booking."})

    await asyncio.sleep(0.2) # Simulate async I/O
    booking_id = f"BK-{hashlib.md5(name.encode()).hexdigest()[:6].upper()}"
    success = True

    return ToolResultOutput(
        tool_call_id=tool_call_id,
        result={"success": success, "booking_id": booking_id, "name": name, "slot_booked": slot_datetime_iso}
    )

# Mapping of tool names to their handler functions
# This can be imported and used in the webhook router
TOOL_HANDLERS_REGISTRY = {
    "check_availability": handle_check_availability,
    "book_appointment": handle_book_appointment,
    # Add more tool handlers here
}