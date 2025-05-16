from typing import Dict, Any, Optional, List, Union
from pydantic import BaseModel, Field
from datetime import datetime

# --- Generic Vapi Interaction Models ---

class StartCallRequest(BaseModel):
    phone_number_to_call: str = Field(..., description="The destination phone number in E.164 format.")
    assistant_id: Optional[str] = Field(None, description="Vapi Assistant ID to use. If None, uses default from config.")
    customer_name: Optional[str] = Field(None, description="Name to pass as a variable {{customer_name}}.")
    task_info: Optional[str] = Field(None, description="Task description to pass as a variable {{task_info}}.")
    other_variables: Optional[Dict[str, Any]] = Field({}, description="A dictionary for other custom variables.")

class StartCallResponse(BaseModel):
    success: bool
    message: str
    call_id: Optional[str] = None
    status: Optional[str] = None

class VapiWebhookToolCallFunction(BaseModel):
    name: str
    arguments: str # JSON string of arguments

class VapiWebhookToolCall(BaseModel):
    id: str # Tool call ID
    type: str = "function"
    function: VapiWebhookToolCallFunction

class VapiWebhookMessage(BaseModel):
    type: str
    role: Optional[str] = None
    toolCalls: Optional[List[VapiWebhookToolCall]] = Field(None, alias="tool_calls")
    functionCall: Optional[Dict[str, Any]] = Field(None, alias="function_call") # For older Vapi versions

class VapiWebhookPayload(BaseModel):
    message: VapiWebhookMessage

class ToolResultOutput(BaseModel): # Renamed from ToolResult to avoid conflict if used as input
    tool_call_id: str
    result: Dict[str, Any]

# --- DateMate Specific Models ---

class CreateAgentRequest(BaseModel):
    name: str = Field(..., description="Name of the AI persona")
    age: int = Field(..., gt=0, description="Age of the AI persona")
    personality: str = Field(..., description="Key personality trait")
    setting: str = Field(..., description="Conversation setting")
    voice_model: str = Field(..., description="Voice model ID to be used (frontend will send a default if not on form)")
    difficulty: Optional[str] = Field("easy", description="Difficulty level of the conversation (easy, medium, hard)")
    scenario_description: Optional[str] = Field(None, description="Additional user-defined scenario details")

class CreateAgentResponse(BaseModel):
    assistant_id: str
    status: str = "success"
    name: str
    prompt_used: str # For debugging/verification

# Assistant Management Models

class AssistantMetadata(BaseModel):
    app_persona_name: Optional[str] = None
    app_age: Optional[Union[int, str]] = None # Allow string for parsing flexibility
    app_personality: Optional[str] = None
    app_setting: Optional[str] = None
    app_difficulty: Optional[str] = None # e.g., 'easy', 'medium', 'hard'
    app_short_description: Optional[str] = None

class AssistantSummary(BaseModel):
    id: str
    name: str  # This is Vapi's name for the assistant
    personality: Optional[str] = None # This should be derived from app_metadata.app_personality
    creation_date: datetime
    voice_model: Optional[str] = None # Could be voice ID or a descriptive name
    difficulty: Optional[str] = None # This should be derived from app_metadata.app_difficulty
    last_used: Optional[datetime] = None
    metadata: Optional[AssistantMetadata] = None

class AssistantList(BaseModel):
    data: List[AssistantSummary]
    next_page_token: Optional[str] = None

class AssistantDetail(AssistantSummary):
    age: int
    setting: str
    system_prompt: str
    total_calls: int = 0
    average_call_duration: Optional[float] = None

class UpdateAssistantRequest(BaseModel):
    name: Optional[str] = None
    personality: Optional[str] = None
    voice_model: Optional[str] = None
    difficulty: Optional[str] = None
    setting: Optional[str] = None

# Call Analytics Models
class CallAnalytics(BaseModel):
    call_id: str
    assistant_id: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    success_metrics: Optional[bool] = None
    structured_data: Optional[dict] = None

class CallsList(BaseModel):
    data: List[CallAnalytics]
    next_page: Optional[str] = None
    total: int