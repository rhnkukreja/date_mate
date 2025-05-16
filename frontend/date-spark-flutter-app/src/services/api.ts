// api.ts - Full implementation
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

// Type Definitions
export interface AssistantMetadata {
  app_persona_name?: string;
  app_age?: number | string;
  app_personality?: string;
  app_setting?: string;
  app_difficulty?: string;
  app_short_description?: string;
}

export interface AssistantSummary {
  id: string;
  name: string;
  difficulty?: string;
  short_description?: string;
  metadata?: AssistantMetadata;
  creation_date?: string;
  last_used?: string;
}

export interface AssistantListResponse {
  data: AssistantSummary[];
  next_page_token?: string;
}

export interface AssistantDetails {
  id: string;
  app_persona_name: string;
  age: number;
  app_personality: string;
  app_setting: string;
  difficulty: string;
  system_prompt: string;
  personality?: string;
  creation_date: string;
  voice_model?: string;
  setting?: string;
  total_calls?: number;
  average_call_duration?: number | null;
}

export interface CreateAgentPayload {
  name: string;
  age: number;
  personality: string;
  setting: string;
  difficulty?: string;
  scenario_description?: string;
  voice_model?: string;
}

export interface CreateAgentResponse {
  assistant_id: string;
  name: string;
  status?: string;
  prompt_used?: string;
  system_prompt?: string;
}

// API Functions
export async function listAssistantSummaries(limit: number = 100): Promise<AssistantSummary[]> {
  try {
    const url = new URL('/api/assistants/', API_BASE_URL);
    url.searchParams.append('limit', limit.toString());
    
    console.log('Fetching assistants from:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Failed to fetch assistants:', response.status, errorBody);
      throw new Error(`Failed to fetch assistants: ${errorBody}`);
    }
    
    const data: AssistantListResponse = await response.json();
    console.log('Fetched assistants:', data);
    return data.data || [];
  } catch (error) {
    console.error('API Error in listAssistantSummaries:', error);
    throw error;
  }
}

export async function getAssistantDetails(assistantId: string): Promise<AssistantDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assistants/${assistantId}`);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch assistant details: ${errorBody}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const createAgent = async (payload: CreateAgentPayload): Promise<CreateAgentResponse> => {
  try {
    const url = `${API_BASE_URL}/api/create-agent/`;
    console.log('Making API request to:', url);
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        voice_model: payload.voice_model || "21m00Tcm4TlvDq8ikWAM"
      }),
    });

    let data;
    try {
      data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      const errorMessage = data?.detail || data?.message || 
        `Failed to create agent: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Ensure we return the response in the expected format
    return {
      assistant_id: data.assistant_id,
      name: data.name,
      system_prompt: data.prompt_used || data.system_prompt || ''
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Utility Functions
export async function handleApiError(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response;
}