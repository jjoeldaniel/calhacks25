import { Send } from 'lucide-react'
import React from 'react'
import { useUI } from '../../Contexts/UIContext'

const Textbox : React.FC = () => {
  const [MeetingInfo] = useUI("MeetingRoomData")
  

  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <input
          type="text"
          placeholder={`Message ${MeetingInfo?.roomName}...`}
          className="flex-1 h-11 w-full rounded-md border px-4 py-2 text-base bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all h-11 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 cursor-pointer" />
        </button> 
      </div>
    </div>
  )
}

export default Textbox
