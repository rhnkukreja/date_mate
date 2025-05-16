import { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Ensure VITE_VAPI_PUBLIC_KEY is being read correctly
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string;

if (!VAPI_PUBLIC_KEY) {
  console.error('VITE_VAPI_PUBLIC_KEY is not set in .env file');
  // Optionally throw an error or handle this case as needed
}

export type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

export interface TranscriptMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const useVapi = () => { 
  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY));
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null);

  const handleCallStart = useCallback(() => {
    setCallStatus('active');
    setError(null);
    console.log('Call started');
  }, []);

  const handleCallEnd = useCallback(() => {
    setCallStatus('idle');
    setCurrentAssistantId(null); 
    // Optionally clear transcripts on call end, or keep them for review
    // setTranscripts([]); 
    console.log('Call ended');
  }, []);

  const handleError = useCallback((err: any) => { 
    const errorMessage = err?.message || 'An unknown error occurred with Vapi.';
    setCallStatus('error');
    setError(errorMessage);
    console.error('Vapi error:', err);
  }, []);

  const handleMessage = useCallback((message: any) => {
    console.log('Vapi message:', message);
    if (message.type === 'transcript' && 
        message.transcriptType === 'final' && 
        message.transcript && 
        (message.role === 'user' || message.role === 'assistant')) {
      setTranscripts(prev => [
        ...prev,
        {
          id: crypto.randomUUID(), // Generate a unique ID for the key
          role: message.role,
          content: message.transcript,
          timestamp: Date.now(),
        }
      ]);
    }
  }, []);

  useEffect(() => {
    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('error', handleError);
    vapi.on('message', handleMessage);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('error', handleError);
      vapi.off('message', handleMessage);
      if (vapi && (callStatus === 'active' || callStatus === 'connecting')) {
        vapi.stop();
      }
    };
  }, [vapi, handleCallStart, handleCallEnd, handleError, handleMessage]); 

  const startVapiCall = useCallback(async (assistantId: string) => {
    if (callStatus !== 'idle') {
      console.warn('Call is already in progress or connecting.');
      return;
    }
    if (!VAPI_PUBLIC_KEY) {
      setError('Vapi Public Key is not configured.');
      setCallStatus('error');
      return;
    }
    if (!assistantId) {
      setError('Assistant ID is not provided.');
      setCallStatus('error');
      return;
    }

    console.log(`Starting call with assistant: ${assistantId}`);
    setCallStatus('connecting');
    setCurrentAssistantId(assistantId);
    setError(null);
    setTranscripts([]); // Clear previous transcripts when a new call starts
    try {
      await vapi.start(assistantId);
    } catch (err) {
      handleError(err);
    }
  }, [vapi, callStatus, handleError]);

  const stopVapiCall = useCallback(async () => {
    console.log('Stopping call');
    await vapi.stop();
    setCallStatus('idle');
  }, [vapi]);

  const toggleMute = useCallback(async () => {
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
    console.log(newMutedState ? 'Muted' : 'Unmuted');
  }, [isMuted, vapi]);

  return {
    callStatus,
    isMuted,
    error,
    transcripts,
    startVapiCall,
    stopVapiCall,
    toggleMute,
    currentAssistantId,
  };
};
