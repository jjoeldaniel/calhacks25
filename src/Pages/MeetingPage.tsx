import React from 'react'
import InputTextbox from '../Components/MeetingRoom/InputTextbox'
import ChatInterface from '../Components/MeetingRoom/ChatInterface'


const MeetingPage : React.FC = () => {

  
  return (
    <div>
      <ChatInterface />
      <InputTextbox />
    </div>
  )
}

export default MeetingPage