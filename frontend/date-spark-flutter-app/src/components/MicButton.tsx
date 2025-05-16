
import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

type MicButtonProps = {
  onRecordingStart: () => void;
  onRecordingStop: (duration: number) => void;
};

const MicButton: React.FC<MicButtonProps> = ({ onRecordingStart, onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setStartTime(Date.now());
    onRecordingStart();
    
    // In a real app, we would start recording here
    // navigator.mediaDevices.getUserMedia({ audio: true })...
    
    // Simulate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const stopRecording = () => {
    if (isRecording && startTime) {
      const duration = Date.now() - startTime;
      setIsRecording(false);
      setStartTime(null);
      onRecordingStop(duration);
      
      // In a real app, we would stop recording here and process the audio
    }
  };

  // Cleanup in case button is held when component unmounts
  useEffect(() => {
    return () => {
      if (isRecording && startTime) {
        const duration = Date.now() - startTime;
        onRecordingStop(duration);
      }
    };
  }, [isRecording, startTime, onRecordingStop]);

  return (
    <div className="flex items-center justify-center">
      <button
        onMouseDown={startRecording}
        onTouchStart={startRecording}
        onMouseUp={stopRecording}
        onTouchEnd={stopRecording}
        onMouseLeave={isRecording ? stopRecording : undefined}
        className={`relative rounded-full p-6 flex items-center justify-center shadow-lg transition-all ${
          isRecording 
            ? 'bg-datemate-red scale-110' 
            : 'bg-datemate-pink hover:bg-datemate-red'
        }`}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full datemate-gradient animate-pulse-ring"></span>
        )}
        <Mic 
          size={32} 
          className="text-white" 
        />
      </button>
      <span className="text-sm text-gray-500 mt-2 absolute -bottom-8">
        {isRecording ? 'Release to send' : 'Hold to talk'}
      </span>
    </div>
  );
};

export default MicButton;
