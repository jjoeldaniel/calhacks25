import { Send } from 'lucide-react'
import React, { useState } from 'react'
import { useUI } from '../../Contexts/UIContext'
import { socket, useSocket } from '../../Contexts/SocketContext'
import type { UserData } from '../../Pages/MeetingLayout'
import { useParams } from 'react-router-dom'

const Textbox: React.FC = () => {
  const [MeetingInfo] = useUI("MeetingRoomData")
  const [CurrentInput, setCurrentInput] = useState("")
  const socket = useSocket()
  const [userSettings] = useUI("UserSettings") as unknown as [
    UserData,
    React.Dispatch<React.SetStateAction<UserData>>,
    () => void
  ];
    const { id } = useParams();

  async function SubmitMessage() {
    socket.once('newMessage', (message) => {
      console.log("Message sent to meeting:", message);
    })

    socket.emit('sendChatMessage', {
      "meetingId": id,
      "user": {
        userName: userSettings?.userName || "You",
        pronouns: userSettings?.pronouns || "they/them",
        bio: userSettings?.bio || ""
      },
      content: CurrentInput
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
