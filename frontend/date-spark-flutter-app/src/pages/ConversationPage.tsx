import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useVapi, TranscriptMessage } from '@/hooks/useVapi'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Mic, MicOff, PhoneOff, Loader2, Send, ArrowLeft, Settings2 } from 'lucide-react'; 

interface Scenario {
  id: string;
  name: string;
  description?: string;
  personality?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  imageUrl?: string;
  age?: number;
}

export const ConversationPage = () => {
  const { assistantId } = useParams<{ assistantId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = location.state as Scenario | undefined; 

  const {
    callStatus,
    isMuted,
    error,
    transcripts,
    startVapiCall,
    stopVapiCall,
    toggleMute,
  } = useVapi();

  const [assistantName, setAssistantName] = useState<string>('Assistant');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scenario?.name) {
      setAssistantName(scenario.name);
    }
    if (!assistantId) {
      navigate('/scenarios');
    }
  }, [assistantId, navigate, scenario]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [transcripts]);

  const handleStartCall = () => {
    if (assistantId) {
      startVapiCall(assistantId);
    }
  };

  const handleEndCall = () => {
    stopVapiCall();
    navigate('/scenarios'); 
  };
  
  const renderInteractionArea = () => {
    switch (callStatus) {
      case 'idle':
        return (
          <Button
            onClick={handleStartCall}
            size="lg"
            className="w-20 h-20 bg-sky-500 hover:bg-sky-600 rounded-full p-0 shadow-xl animate-pulseSlow"
            disabled={!assistantId}
            aria-label="Start Call"
          >
            <Mic size={40} className="text-white" />
          </Button>
        );
      case 'connecting':
        return (
          <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-700 rounded-full p-0 shadow-md">
            <Loader2 size={40} className="text-sky-400 animate-spin" />
          </div>
        );
      case 'active':
        return (
          <Button
            onClick={toggleMute}
            size="lg"
            variant={isMuted ? 'destructive' : 'outline'}
            className={`w-20 h-20 rounded-full p-0 shadow-xl transition-all duration-200 ease-in-out ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={40} className="text-white"/> : <Mic size={40} className="text-white"/>}
          </Button>
        );
      case 'error':
         return (
          <div className="text-center text-red-400">
            <p>Call Error. <Button variant="link" onClick={() => navigate('/scenarios')}>Try again?</Button></p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground antialiased">
      <header className="flex items-center justify-between p-3 datemate-gradient text-white sticky top-0 z-10 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate('/scenarios')} aria-label="Back to Scenarios">
          <ArrowLeft size={24} className="text-white" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold truncate">{assistantName}</h1>
          {callStatus === 'active' && <p className="text-xs text-green-600">Live</p>}
          {callStatus === 'connecting' && <p className="text-xs text-blue-600">Connecting...</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={handleEndCall} disabled={callStatus === 'idle' || callStatus === 'connecting'} aria-label="End Call">
          <PhoneOff size={24} className={callStatus === 'active' ? 'text-destructive' : 'text-muted-foreground'}/>
        </Button>
      </header>

      <main ref={chatAreaRef} className="flex-grow overflow-y-auto p-4 space-y-3 pretty-scrollbar">
        {transcripts.length === 0 && callStatus !== 'error' && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            {callStatus === 'idle' && <Mic size={48} className="mb-2"/>}
            <p>Click the mic to start the conversation.</p>
          </div>
        )}
        {error && callStatus === 'error' && (
            <div className="flex flex-col items-center justify-center h-full text-red-400">
                <Settings2 size={48} className="mb-2"/>
                <p className="text-center">Oops! Something went wrong. <br/> {error}</p>
            </div>
        )}
        {transcripts.map((msg: TranscriptMessage) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow ${ 
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="flex items-center justify-center p-4 bg-card border-t shadow-sm sticky bottom-0">
        {renderInteractionArea()}
      </footer>
    </div>
  );
};
