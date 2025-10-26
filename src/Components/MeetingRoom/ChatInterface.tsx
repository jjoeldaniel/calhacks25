import React, { useMemo, useState, useEffect, useRef } from "react";
import type { Message } from "../../Pages/MeetingPage";
import type { MeetingRoomData, UserData } from '../../Pages/MeetingLayout';
import { useUI } from "../../Contexts/UIContext";
import { AudioMessage } from './AudioMessage';
import { Sparkles } from "lucide-react";
import { useSocket } from "../../Contexts/SocketContext";
import { Meta, useParams } from "react-router-dom";
import BackendConfig from "../../Config/BackendConfig";

const ChatInterface: React.FC = () => {
  const [MeetingInfo] = useUI("MeetingRoomData") as unknown as [
    MeetingRoomData,
    React.Dispatch<React.SetStateAction<MeetingRoomData>>,
    () => void
  ];
  const [userSettings] = useUI("UserSettings") as unknown as [
    UserData,
    React.Dispatch<React.SetStateAction<UserData>>,
    () => void
  ];

  const socket = useSocket();
  const { id } = useParams();

  // Helper function to get the base URL for audio files
  const getAudioBaseUrl = () => {
    const baseUrl = BackendConfig.socketEndpoint.replace('/socket', '').replace(/\/$/, '');
    return baseUrl;
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [Messages, setMessages] = useState(MeetingInfo?.pastMessages || [])

  useEffect(() => {
    const handleNewMessage = (data: { message: Message }) => {
      console.log("New MESAGE", data)
      setMessages((prev) => {
        console.log(prev, data.message, [...prev, data.message])
        return ([...prev, data.message])
      })
    };

    socket.on("newMessage", handleNewMessage)



    return () => {
      socket.off("newMessage", handleNewMessage)
    }
  }, [])


  useEffect(() => {
    if (Messages?.length === 0) {
      setMessages(MeetingInfo?.pastMessages || [])
    }

    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [MeetingInfo?.pastMessages]);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex-1 min-h-0 bg-chat-bg overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {Messages.map((message) => {
          const isSelf = message.userInfo.userName === userSettings?.userName;
          // Left-aligned (other users / AI)
          if (!isSelf) {
            return (
              <div key={message.userInfo.userName + String(message?.timestamp)} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${message?.isAI ? 'bg-linear-to-br from-purple-500 to-pink-500' : 'bg-zinc-700'}`}>
                  {message?.isAI ? <Sparkles className="w-5 h-5" /> : <span className="text-sm">{message?.userInfo.userName}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={message?.isAI ? 'text-purple-400' : 'text-white'}>
                      {message.userInfo.userName}
                    </span>
                    {message?.isAI && (
                      <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">AI</span>
                    )}
                    {/* <span className="text-xs text-zinc-500">{formatTime(message?.timestamp)}</span> */}
                  </div>
                  <p className="text-zinc-300 wrap-break-word">{message?.content}</p>
                  {/* Audio Message for AI */}
                  {message.isAI && (
                    <AudioMessage 
                      duration={message.audioDuration || 10} 
                      audioUrl={message.audioUrl ? `${getAudioBaseUrl()}${message.audioUrl}` : "/buh.mp3"} 
                    />
                  )}
                </div>
              </div>
            );
          }

          // Right-aligned (current user)
          return (
            <div key={message.userInfo.userName + String(message.timestamp)} className="flex gap-3 justify-end">
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-baseline gap-2 mb-1 justify-end">
                  <span className={'text-white font-medium'}>{message.userInfo.userName}</span>
                  <span className="text-xs text-zinc-500">{formatTime(new Date(message?.timestamp))}</span>
                </div>
                <p className="inline-block bg-purple-600 text-white px-4 py-2 rounded-bl-2xl rounded-tl-2xl rounded-tr-lg wrap-break-word">{message.content}</p>
              </div>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-zinc-700`}>
                <span className="text-sm">{message.userInfo.userName}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

export default ChatInterface