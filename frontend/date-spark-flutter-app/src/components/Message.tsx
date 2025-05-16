
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type MessageProps = {
  message: MessageType;
};

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`flex w-full my-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {!message.isUser && (
        <Avatar className="mr-2">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-datemate-pink text-white">AI</AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          message.isUser 
            ? 'bg-datemate-red text-white rounded-tr-none' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'
        }`}
      >
        <p>{message.text}</p>
        <div className={`text-xs mt-1 ${message.isUser ? 'text-gray-200' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {message.isUser && (
        <Avatar className="ml-2">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default Message;
