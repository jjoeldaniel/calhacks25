import React from 'react'
import InputTextbox from '../Components/MeetingRoom/InputTextbox'
import ChatInterface from '../Components/MeetingRoom/ChatInterface'

export interface Message {
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isAI: boolean;
  audioDuration?: number;
  audioUrl?: string;
}

const MeetingPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChatInterface />
      <InputTextbox />
    </div>
  )
}

export default MeetingPage