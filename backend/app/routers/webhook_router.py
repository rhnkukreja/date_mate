import json
from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List, Dict, Any

from app.models import VapiWebhookPayload, VapiWebhookToolCall, VapiWebhookToolCallFunction, ToolResultOutput
from app.dependencies.security import verify_vapi_signature_dependency
# from app.tool_handlers.example_handlers import TOOL_HANDLERS_REGISTRY
from app.config import logger

router = APIRouter(
    prefix="/api",
    tags=["Vapi Webhooks"],
)

@router.post("/vapi-webhook", status_code=200)
async def vapi_webhook_handler_endpoint(
    payload: VapiWebhookPayload,
    # request: Request, # Raw request if needed for manual signature verification
    # Enable signature verification by uncommenting the next line
    # _signature_check: Any = Depends(verify_vapi_signature_dependency)
):
    """
    Handles incoming webhooks from Vapi, primarily for tool/function calls.
    Vapi expects a specific response format for tool calls.
    """
    logger.info(f"Received Vapi webhook. Message type: {payload.message.type}")
    logger.debug(f"Webhook Payload Received: {payload.model_dump_json(indent=2)}")

    response_tool_results_list: List[Dict[str, Any]] = [] # Store as list of dicts for final JSON

    if payload.message.type in ["tool_calls", "function_call"]:
        tool_calls_to_process: List[VapiWebhookToolCall] = []

        if payload.message.toolCalls:
            tool_calls_to_process = payload.message.toolCalls
        elif payload.message.functionCall: # Adapt older single function_call
            # Ensure functionCall is not None and has necessary keys
            if payload.message.functionCall and \
               payload.message.functionCall.get("name") and \
               payload.message.functionCall.get("parameters") is not None: # parameters can be empty dict "{}"
                tool_calls_to_process.append(
                    VapiWebhookToolCall(
                        id=payload.message.functionCall.get("id", f"legacy_fn_{payload.message.functionCall.get('name')}"),
                        function=VapiWebhookToolCallFunction(
                            name=payload.message.functionCall.get("name"),
                            arguments=payload.message.functionCall.get("parameters", "{}")
                        )))
            else:
                logger.warning("Received 'function_call' type but content is invalid or missing.")


        if not tool_calls_to_process:
            logger.info("Webhook: No tool calls to process in the message.")
            return {"message": "Webhook received, no tool calls to process."}

        for tool_call in tool_calls_to_process:
            tool_name = tool_call.function.name
            tool_call_id = tool_call.id
            try:
                parameters = json.loads(tool_call.function.arguments)
            except json.JSONDecodeError:
                logger.error(f"Could not parse params for tool '{tool_name}' (ID: {tool_call_id}). Args: {tool_call.function.arguments}")
                error_result = ToolResultOutput(tool_call_id=tool_call_id, result={"success": False, "error": f"Invalid JSON args for tool {tool_name}"})
                response_tool_results_list.append(error_result.model_dump())
                continue

            if tool_name in TOOL_HANDLERS_REGISTRY:
                handler_fn = TOOL_HANDLERS_REGISTRY[tool_name]
                try:
                    tool_result_obj: ToolResultOutput = await handler_fn(parameters, tool_call_id)
                    response_tool_results_list.append(tool_result_obj.model_dump())
                except Exception as e:
                    logger.exception(f"Error executing tool handler for '{tool_name}' (ID: {tool_call_id})")
                    error_result = ToolResultOutput(tool_call_id=tool_call_id, result={"success": False, "error": f"Error executing tool {tool_name}: {str(e)}"})
                    response_tool_results_list.append(error_result.model_dump())
            else:
                logger.warning(f"No handler for tool: '{tool_name}' (ID: {tool_call_id})")
                no_handler_result = ToolResultOutput(tool_call_id=tool_call_id, result={"success": False, "error": f"Tool '{tool_name}' not implemented."})
                response_tool_results_list.append(no_handler_result.model_dump())

        if response_tool_results_list:
            logger.info(f"Responding to Vapi with tool results: {json.dumps(response_tool_results_list)}")
            return {"tool_results": response_tool_results_list} # Vapi expects this structure
        else:
            logger.info("No tool results to send, though tool_calls message type was received.")
            return {"message": "Webhook processed, no valid tool calls found or handled."}
    else:
        logger.info(f"Received webhook type '{payload.message.type}', not a tool/function call. No action by default.")
        return {"message": f"Webhook type '{payload.message.type}' received and acknowledged."}
