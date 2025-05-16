
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import MicButton from '@/components/MicButton';
import Message, { MessageType } from '@/components/Message';
import { Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PracticePageProps {
  scenarioType?: 'custom' | 'regular';
}

const PracticePage: React.FC<PracticePageProps> = ({ scenarioType = 'regular' }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [scenario, setScenario] = useState(() => {
    if (scenarioType === 'custom') {
      return {
        id: id || 'custom-1',
        name: 'Custom Scenario',
        age: 25,
        personality: 'Custom',
        environment: 'Custom Environment',
        imageUrl: '',
      };
    }
    return {
      id: id || '1',
      name: 'Emma',
      age: 28,
      personality: 'Outgoing',
      environment: 'Coffee Shop',
      imageUrl: '',
    };
  });
  
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      text: "Hi there! It's nice to meet you. I'm Emma. This is my first time at this coffee shop, do you come here often?",
      isUser: false,
      timestamp: new Date(Date.now() - 60000),
    }
  ]);
  
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const handleStartRecording = () => {
    // Here we would start actual recording
    console.log('Recording started');
  };
  
  const handleStopRecording = (duration: number) => {
    // In a real app, we would process the audio recording here
    console.log(`Recording stopped after ${duration}ms`);
    
    // Only process if the recording was longer than 500ms
    if (duration < 500) {
      toast({
        title: "Recording too short",
        description: "Please hold the mic button a bit longer",
      });
      return;
    }
    
    // Add the user message
    const userMessageText = getRandomUserMessage();
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking and responding
    setIsAiTyping(true);
    setTimeout(() => {
      const aiMessage: MessageType = {
        id: `ai-${Date.now()}`,
        text: getRandomAiResponse(),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
      
      // Check if we should end the conversation and show feedback
      if (messages.length >= 5) {
        setTimeout(() => {
          navigate('/feedback');
        }, 2000);
      }
    }, 2000);
  };
  
  // Sample messages for demonstration
  const getRandomUserMessage = () => {
    const messages = [
      "Yes, I come here pretty often. They have the best coffee in town.",
      "It's my first time here too. The place has a nice vibe.",
      "I love their cappuccinos. Have you tried one yet?",
      "I actually work nearby. What brings you to this neighborhood?",
      "I've been coming here for years. I'd recommend their blueberry muffins.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  const getRandomAiResponse = () => {
    const responses = [
      "Oh, that's great to know! What do you usually order here? I'm having trouble deciding what to get.",
      "You're right about the vibe! I love places with this kind of atmosphere. Do you enjoy coffee shops generally or do you prefer other types of places?",
      "I haven't tried their cappuccino yet, but I love a good one. I usually go for lattes. Do you always get cappuccinos or do you like to change it up?",
      "I'm actually just exploring the area. I moved nearby recently. What kind of work do you do?",
      "Blueberry muffins sound delicious! Thanks for the recommendation. Do you have any other favorite spots in this area?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);
  
  // End the session early
  const handleEndSession = () => {
    navigate('/feedback');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="datemate-gradient p-4 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate('/scenarios')}
        >
          Back
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-datemate-pink text-white">
              {scenario.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {scenario.name}, {scenario.age}
            </h1>
            <p className="text-xs text-white opacity-90">
              {scenario.personality} • {scenario.environment}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={handleEndSession}
        >
          End
        </Button>
      </div>
      
      {/* Chat Area */}
      <ScrollArea 
        className="flex-1 p-4 pb-24"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
          
          {isAiTyping && (
            <div className="flex items-center mt-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-datemate-pink text-white">
                  {scenario.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 animate-pulse flex items-center">
                <Loader size={16} className="animate-spin text-datemate-pink mr-2" />
                <span className="text-sm text-gray-500">Typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Recording Interface */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center h-24 bg-gradient-to-t from-background to-transparent">
        <MicButton
          onRecordingStart={handleStartRecording}
          onRecordingStop={handleStopRecording}
        />
      </div>
    </div>
  );
};

export default PracticePage;
