# app/services/vapi_client.py
from typing import Dict, Any, Optional, List
import httpx
from app.config import settings, logger

class VapiClient:
    """Client for interacting with the Vapi API"""
    
    def __init__(self):
        self.base_url = "https://api.vapi.ai"
        self.headers = {
            "Authorization": f"Bearer {settings.VAPI_API_KEY}",
            "Content-Type": "application/json"
        }
    
    async def list_assistants(self, limit: int = 10, page_token: Optional[str] = None):
        params = {"limit": limit}
        if page_token:
            params["pageToken"] = page_token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/assistant",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return response.json()
    
    async def get_assistant(self, assistant_id):
        """Get a specific assistant by ID"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/assistant/{assistant_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
    
    async def update_assistant(self, assistant_id, data):
        """Update an assistant"""
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f"{self.base_url}/assistant/{assistant_id}",
                headers=self.headers,
                json=data
            )
            response.raise_for_status()
            return response.json()
    
    async def list_calls(self, assistant_id=None, limit=100, page=None):
        """List all calls with optional filtering"""
        params = {"limit": limit}
        if assistant_id:
            params["assistantId"] = assistant_id
        if page:
            params["page"] = page
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/call",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return response.json()
    
    async def get_call(self, call_id):
        """Get a specific call by ID"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/call/{call_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
    
    async def get_analytics(self, assistant_id: str):
        url = "https://api.vapi.ai/analytics"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        params = {"assistantId": assistant_id}
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params)
            print("Vapi analytics response:", response.status_code, response.text)
            response.raise_for_status()
            return response.json()
        
    async def delete_assistant(self, assistant_id: str) -> Dict[str, Any]:
        """Delete a Vapi assistant by ID"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/assistant/{assistant_id}"
            headers = self.get_headers()
            response = await client.delete(url, headers=headers)
            response.raise_for_status()
            return response.json()

    async def delete_call(self, call_id: str) -> Dict[str, Any]:
        """Delete/archive a call record by ID"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/call/{call_id}"
            headers = self.get_headers()
            response = await client.delete(url, headers=headers)
            response.raise_for_status()
            return response.json()