import { Send } from 'lucide-react'
import React, { useState } from 'react'
import { useUI } from '../../Contexts/UIContext'
import { useSocket } from '../../Contexts/SocketContext'

const Textbox : React.FC = () => {
  const [MeetingInfo] = useUI("MeetingRoomData")
  const [CurrentInput, setCurrentInput] = useState("")
  const socket = useSocket()

  async function SubmitMessage() {
    socket.emit("sendChatMessage",{
      content : CurrentInput
    })
    setCurrentInput("")
  }

  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <input
          value={CurrentInput}
          type="text"
          placeholder={`Message ${MeetingInfo?.roomName}...`}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              SubmitMessage()
            }
          }}
          onChange={(event) => {
            setCurrentInput(event.target.value)
          }}
          className="flex-1 h-11 w-full rounded-md border px-4 py-2 text-base bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          onClick={() => SubmitMessage()}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-11 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowe cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button> 
      </div>
    </div>
  )
}

export default Textbox
